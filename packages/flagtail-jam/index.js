// This package takes inspiration from module-alias & better-module-alias
// https://github.com/ilearnio/module-alias
// https://github.com/Sawtaytoes/better-module-alias

const {
    Validator,
} = require("./src/utils");

const {
    ConfigType,
} = require("./src/constants");

const { 
    AliasConfig,
    JSONConfig,
} = require("./src/config-parser");

const {
    Manager,
} = require("./src/manager");

const init = require("./src/module-resolver");

/**
 * @author rhie-coder <https://github.com/rhie-coder>
 * 
 * @public  
 * 
 * @param {object} options                                       (optional) 
 * @param {string} options.rootPath                              (optional) @default: process.cwd()
 * @param {string} options.aliasMap                              (optional)
 * @param {JSCONFIG | TSCONFIG | PACKAGE} options.configType     (optional) 
 * @returns {object} JamSettingResult
 * 
 * @description
 *  - rootPath: the path includes confguration files (jsconfig.json || tsconfig.json || package.json)
 *  - aliasMap: set module alias which is key-value format without config files(jsconfig.json || tsconfig.json || package.json) 
 *  - configType: set source of the alias configuration
 * 
 * ### check configuration files priority (default)
 *  1. jsconfig.json
 *  2. tsconfig.json
 *  3. package.json
 * 
 * ### how to set alias
 *  - `jsconfig.json` and `tsconfig.json`
 * 
 * ```json
 * {
 *   "compilerOptions": {
 *     "baseUrl": "./base",
 *     "paths": {
 *       "@/*": [
 *           "../path/to/*"
 *       ]
 *     }
 *   }
 * }
 * ```
 * 
 *  - `package.json`
 * 
 * ```json
 * {
 *   "_moduleAliases": {
 *     "$tests": "./tests",
 *     "$utils": "./utils"
 *   }
 * }
 * ```
 * 
 * this `package.json` setup method is the same as 
 * [module-alias](https://github.com/ilearnio/module-alias) and
 * [better-module-alias](https://github.com/Sawtaytoes/better-module-alias) does
 * so that you can do migration easily
 * 
 * ### if `aliasMap` is set, all configuration files will be ignored
 *
 * @example
 * ```js
 * const jam = require("flagtail-jam");
 * 
 * jam.load()
 * 
 * const calc = require("@/common/calc");
 * calc.add(10, 20);
 * ```
 * 
 * @example
 * ```js
 * const jam = require("flagtail-jam");
 * 
 * jam.load({
 *   rootPath: "../../path/to"
 * })
 * 
 * const calc = require("@/common/calc");
 * calc.add(10, 20);
 * ```
 * 
 * @example
 * ```js
 * const jam = require("flagtail-jam");
 * 
 * const aliasMap = {
 *   "@/*": "../*" 
 * };
 * 
 * jam.load({aliasMap})
 * 
 * const calc = require("@/common/calc");
 * calc.add(10, 20);
 * ```
 */
const load = (options) => {

    const settingResult = {
        settingSource:{},
        aliasMap:{},
    }

    let readConfigFileMode = true;
    let finalAlias = null;

    options ??= {};

    if(Validator.isNull(options)) {
        throw new ReferenceError(`options is not defined`);
    }

    /*  
        rootPath
    */
    let rootPath = options.rootPath ?? process.cwd();

    if(Validator.isNull(rootPath) || Validator.isEmptyString(rootPath)) {
       rootPath = process.cwd();
    }

    if(!Validator.isType(rootPath).of("string")) {
        throw new TypeError(`rootPath is not string type`);
    }

    settingResult.settingSource.rootPath = rootPath;

    /*  
        aliasMap
    */
    let aliasMap = options.aliasMap;

    if(Validator.isNotNull(aliasMap)) {
        finalAlias = new AliasConfig(rootPath).parse(aliasMap);
        readConfigFileMode = false;

        settingResult.aliasMap = finalAlias;
    }
     
    if(!readConfigFileMode) {
        init(new Manager(finalAlias))
        return settingResult;
    }

    /*  
        configType
    */
    let configType = options.configType;

    if(Validator.isNull(configType) || Validator.isEmptyString(configType)) {
       configType = ConfigType.JSCONFIG;
    }

    if(!Validator.isType(configType).of("string")) {
        throw new TypeError(`'configType' is not string type`)
    }

    settingResult.settingSource.configType = configType;

    const jsonConfigData = new JSONConfig(rootPath, configType).load().parse();
    finalAlias = jsonConfigData.parsedAliasMap;
    settingResult.aliasMap = finalAlias;
    settingResult.settingSource = {
        ...settingResult.settingSource,
        ...jsonConfigData.parsedJSONConfig,
    }

    init(new Manager(finalAlias))
    return settingResult;
} 


module.exports = {
    load,
    ConfigType,
}