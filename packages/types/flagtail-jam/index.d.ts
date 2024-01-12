declare namespace jam {
    export const ConfigType: {
        JSCONFIG: "jsconfig.json";
        TSCONFIG: "tsconfig.json";
        PACKAGE: "package.json";
    };

    interface Options {
        rootPath?: string;
        aliasMap?: Record<string, string>;
        configType?: typeof ConfigType[keyof typeof ConfigType];
    }

    interface AliasMap {
        [key: string]: string;
    }

    interface SettingSource{
        rootPath?:string;
        configType?:string;
        outDir?:string;
        rootDir?:string;
        baseUrl?:string;
        paths?:object;
    }

    interface JamSettingResult {
        settingSource:SettingSource,
        aliasMap:AliasMap;
    }

    function load(options?: Options): JamSettingResult;
}

export = jam;