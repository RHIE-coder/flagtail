const {
    ConfigType,
} = require('./constants');

const {
    BasePath,
    getObjectValueFromKey,
    Validator,
} = require('./utils');

class AliasConfig {

    #basePath

    constructor(rootPathOrBasePath) {

        let basePath;

        if(!(rootPathOrBasePath instanceof BasePath)) {
            basePath = new BasePath(rootPathOrBasePath);
        } else {
            basePath = rootPathOrBasePath;
        }
        basePath.check()
        this.#basePath = basePath;
    } 

    parse(aliasMap) {
        if(!(aliasMap instanceof Object)) {
            throw new TypeError(`'aliasMap' is not object type`);
        }

        let parsedAliasMap = {}

        for(const aliasRule in aliasMap) {
            const stringOrArray = aliasMap[aliasRule]
            const aliasPath = stringOrArray instanceof Array 
                ? stringOrArray[0].replace("*","")
                : stringOrArray.replace("*","")
            const realPath = this.#basePath.getChildPath(aliasPath);

            parsedAliasMap = {
                ...parsedAliasMap,
                [aliasRule.replace("*","")]: realPath,
            }
        }
        
        return parsedAliasMap;
    }
}

class JSONConfig {
    
    #basePath
    #configType
    #jsonData

    constructor(rootPath, configType) {
        const basePath = new BasePath(rootPath);
        basePath.check();
        this.#basePath = basePath;
        this.#configType = configType;
    } 

    load() {
        const configType = this.#configType;
        this.#jsonData = this.#basePath.loadJSON(configType);
        return this;
    }

    parse() {
        const configType = this.#configType;
        const jsonData = this.#jsonData;

        const parsedJSONConfig = {}
        let parsedAliasMap = {}

        if(ConfigType.TSCONFIG) {
            const outDir = getObjectValueFromKey(
                "compilerOptions.outDir",
                jsonData,
            );
            if(Validator.isNotNull(outDir)) {
                parsedJSONConfig.outDir = outDir;
            }
            const rootDir = getObjectValueFromKey(
                "compilerOptions.rootDir",
                jsonData,
            );
            if(Validator.isNotNull(rootDir)){
                parsedJSONConfig.rootDir = rootDir;
            }
        }

        if(
            configType === ConfigType.JSCONFIG
            ||
            configType === ConfigType.TSCONFIG
        ) {
            let isBaseUrlExist = false;
            let isPathsExist = false;

            const baseUrl = getObjectValueFromKey(
                "compilerOptions.baseUrl",
                jsonData,
            );

            const paths = getObjectValueFromKey(
                "compilerOptions.paths",
                jsonData,
            );

            if(Validator.isNotNull(baseUrl)) {
                parsedJSONConfig.baseUrl = baseUrl;
                isBaseUrlExist = true;
            }
        

            if(Validator.isNotNull(paths)) {
                parsedJSONConfig.paths = paths;
                isPathsExist = true;
            }

            if(isBaseUrlExist && isPathsExist) {
                parsedAliasMap = new AliasConfig(this.#basePath.getChildPath(baseUrl)).parse(paths);
            }

            if(!isBaseUrlExist && isPathsExist) {
                parsedAliasMap = new AliasConfig(this.#basePath).parse(paths);
            }

            return {
                parsedJSONConfig,
                parsedAliasMap,
            };
        }

        if(configType === ConfigType.PACKAGE) {

            let isModuleAliasesExist = false;

            const aliasMap = getObjectValueFromKey(
                "_moduleAliases",
                jsonData,
            );

            if(Validator.isNotNull(aliasMap)) {
                isModuleAliasesExist = true
            }

            if(isModuleAliasesExist){
                parsedAliasMap = new AliasConfig(this.#basePath).parse(aliasMap)
            }
            // "_moduleDirectories": ["node_modules_custom"], 
            return {
                parsedAliasMap,
            };
        }

        return {
            parsedAliasMap,
        };
    }

}

module.exports= {
    AliasConfig,
    JSONConfig,
}