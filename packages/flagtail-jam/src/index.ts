// This package takes inspiration from module-alias & better-module-alias
// https://github.com/ilearnio/module-alias
// https://github.com/Sawtaytoes/better-module-alias

// import BuiltinModule from "module";
// import path from 'path';
// import fs from 'fs';

// const Module:Function = module.constructor.length > 1
//                 ? module.constructor
//                 : BuiltinModule

const getBasePathFromFilePath = (filepath:string) => filepath.replace(/^(.+)[\\/]node_modules$/, '$1');


const getRootPath = () => {
	// const execNodePath = process.cwd();
	const pathStack = module
					.paths
					.map(nodeModulePath => getBasePathFromFilePath(nodeModulePath))
					// .filter(mappedPath => !mappedPath.includes("node_modules"))
					// .filter(removedNodeModulesPath => removedNodeModulesPath.includes(execNodePath))	
    return pathStack;
}

console.log(getRootPath())