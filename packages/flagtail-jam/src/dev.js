// This package takes inspiration from module-alias & better-module-alias
// https://github.com/ilearnio/module-alias
// https://github.com/Sawtaytoes/better-module-alias
const BuiltinModule = require('module');
const path = require('path');
const fs = require('fs');

// Guard against poorly mocked module constructors
const Module = module.constructor.length > 1
			    ? module.constructor
			    : BuiltinModule


const moduleAliasMapper = {}
const moduleAliasNameList = []

const getBasePathFromFilePath = filepath => filepath.replace(/^(.+)[\\/]node_modules$/, '$1');

const getRealPathOfAlias = ( alias, parentModule, resolvePath ) => {

	const parentFilePath = parentModule
			.paths
			.find(filePath => moduleAliasMapper[getBasePathFromFilePath(filePath)]);

	if (!parentFilePath) {
		throw new Error(
			`The file at '${resolvePath}' does not exist.`
				.concat('\n\n')
				.concat('Verify these paths:')
				.concat('\n')
				.concat(JSON.stringify(moduleAliasMapper, null, 2))
		)
	}

	const basePath = getBasePathFromFilePath(parentFilePath);
	
	const aliasTarget = moduleAliasMapper[basePath][alias];

	return resolvePath.replace(alias, aliasTarget);
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
		throw new SyntaxError('jsconfig/tsconfig paths array value should have 1 element');
	}

	if(type === null) {
		throw new SyntaxError('jsconfig/tsconfig paths value should be string or array')
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

/* 
	remain function

	 - package.json
*/
const findRootPathByPackageJson = (rootPathCandidates) => {

	let selectedBasePath = [];

	for(const basePath of rootPathCandidates) {
		try {
			const packageJson = fs.readFileSync(path.join(basePath, "package.json"))
			if(packageJson) {
				selectedBasePath.push(basePath);
			}
		} catch (err) {
			continue;
		}
	}
	
	if (selectedBasePath.length === 0) {
		throw new Error('there is no any root path (includes package.json). To use rootPath option is recommended')
	}

	if (selectedBasePath.length > 1) {
		throw new Error(`cannot define which one is root path 
			(founded package.json included project ${selectedBasePath}). 
			To use rootPath option is recommended`)
	}

	return selectedBasePath[0];
}

const findRootPathByJsconfigJson = (rootPathCandidates) => {

	let selectedBasePath = [];

	for(const basePath of rootPathCandidates) {
		try {
			const jsconfigJson = fs.readFileSync(path.join(basePath, "jsconfig.json"))
			if(jsconfigJson) {
				selectedBasePath.push(basePath);
			}
		} catch (err) {
			continue;
		}
	}
	
	if (selectedBasePath.length === 0) {
		throw new Error('there is no any root path (includes package.json). To use rootPath option is recommended')
	}

	if (selectedBasePath.length > 1) {
		throw new Error(`cannot define which one is root path 
			(tried to find jsconfig.json included project ${selectedBasePath}). 
			To use rootPath option is recommended`)
	}

	return selectedBasePath[0];
}

const getRootPath = () => {
	const execNodePath = process.cwd();
	const pathStack = module
					.paths
					.map(nodeModulePath => getBasePathFromFilePath(nodeModulePath))
					.filter(mappedPath => !mappedPath.includes("node_modules"))
					.filter(removedNodeModulesPath => removedNodeModulesPath.includes(execNodePath))	

	const rootPath = findRootPathByJsconfigJson(pathStack);
	return rootPath
}

/**
 * @author rhie-coder <https://github.com/rhie-coder>
 * 
 * @public  
 * 
 * @param {object} moduleAliasConfig            (optional) default: {}
 * @param {string} moduleAliasConfig.root   (optional) default: $PWD
 * @param {string} moduleAliasConfig.alias      (optional)
 * @returns {object} moduleAliasMapper
 * 
 * @description
 *  - alias: set module alias which is key-value format without config files(jsconfig.json || tsconfig.json) 
 * 
 * @example
 * ```js
 * const jam = require("flagtail-jam");
 * 
 * const alias = {
 *   "@/*": "../*" 
 * };
 * 
 * jam.init(alias);
 * 
 * const calc = require("@/common/calc");
 * calc.add(10, 20);
 * ```
 */
const init = (moduleAliasConfig) => {
	let aliases;

	moduleAliasConfig = moduleAliasConfig ?? {};

	if(!moduleAliasConfig?.path) {
		moduleAliasConfig.path = getRootPath();
	}

	if (config?.paths) {
		aliases = moduleAliasConfig.paths;
	} else {
		aliases = scanConfigFile(moduleAliasConfig.rootPath);
	}

	addModuleAliases(config.rootPath, aliases);
	return moduleAliasMapper;
};