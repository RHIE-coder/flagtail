// This package takes inspiration from module-alias & better-module-alias
// https://github.com/ilearnio/module-alias
// https://github.com/Sawtaytoes/better-module-alias

const BuiltinModule = require('module')
const path = require('path')
const fs = require('fs');

// Guard against poorly mocked module constructors
const Module = module.constructor.length > 1
			    ? module.constructor
			    : BuiltinModule


const moduleAliasMapper = {}
const moduleAliasNameList = []

const getBasePathFromFilePath = filepath => filepath.replace(/^(.+)[\\/]node_modules$/, '$1')

const getRealPathOfAlias = ( alias, parentModule, resolvePath ) => {

	const parentFilePath = parentModule
			.paths
			.find(filePath => moduleAliasMapper[getBasePathFromFilePath(filePath)])

	if (!parentFilePath) {
		throw new Error(
			`The file at '${resolvePath}' does not exist.`
				.concat('\n\n')
				.concat('Verify these paths:')
				.concat('\n')
				.concat(JSON.stringify(moduleAliasMapper, null, 2))
		)
	}

	const basePath = getBasePathFromFilePath(parentFilePath)
	
	const aliasTarget = moduleAliasMapper[basePath][alias]

	return resolvePath.replace(alias, aliasTarget)
}

const originalResolveFilename = Module._resolveFilename

Module._resolveFilename = function (resolvePath, parentModule, isMain) {	
	const registedAlias = moduleAliasNameList.find((beginningAlias) => resolvePath.startsWith(beginningAlias));

	const moduleFilePath = registedAlias
						? getRealPathOfAlias(registedAlias, parentModule, resolvePath)
						: resolvePath

	return originalResolveFilename.call(
				this,
				moduleFilePath,
				parentModule,
				isMain,
			)
}

const generateAliasesMap = (basePath, aliasName, aliasPath) => {
	let type = null;
	let filePath = null;

	/* Type Validate */
	if(typeof aliasPath === 'string') {
		type = 'string';
	}

	if(aliasPath instanceof Array) {
		type = 'array'; 
	}

	if(type === 'array' && aliasPath.length > 1) {
		throw new SyntaxError('jsconfig paths array value should have 1 element');
	}

	if(type === null) {
		throw new SyntaxError('jsconfig paths value should be string or array')
	}

	if(type === 'string') {
		filePath = path.join(basePath, aliasPath)
	}

	if(type === 'array') {
		filePath = path.join(basePath, aliasPath[0])
	}
	const wildcardRemovedAliasName = aliasName.replace('*', '');
	const wildcardRemovedPath = filePath.replace('*', '');
	return {
		aliasName: wildcardRemovedAliasName,
		filePath: wildcardRemovedPath,
	};
}

const addModuleAliases = (basePath, aliases) => {
	
	Object
		.keys(aliases)
		.map(alias => generateAliasesMap(basePath, alias, aliases[alias]))
		.forEach(({aliasName, filePath}) => {
			if (!moduleAliasMapper[basePath]) {
				moduleAliasMapper[basePath] = {}
			}

			moduleAliasMapper[basePath][aliasName] = filePath;

			!moduleAliasNameList.includes(aliasName)
				&& moduleAliasNameList.push(aliasName)
				&& moduleAliasNameList.sort();

		})
}


const scanConfigFile = (from) => {
	const configFileName = 'jsconfig.json';
	const jsConfigPath = path.join(from, configFileName)
	const config = JSON.parse(fs.readFileSync(jsConfigPath, 'utf-8'));
	const paths = config.compilerOptions.paths;
	return paths;
}

const init = (config) => {
	let aliases;
	if(!config?.rootPath) throw new ReferenceError('the rootPath should not be empty')
	if (config?.aliasesMapping) {
		aliases = config.aliasesMapping;
	} else {
		aliases = scanConfigFile(config.rootPath);
	}

	addModuleAliases(config.rootPath, aliases);
	return moduleAliasMapper;
};



module.exports = init;
