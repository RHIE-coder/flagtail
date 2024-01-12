const {
    Validator,
} = require('./utils');

class Manager {

    #aliasMap
    #aliasRuleList
    #cache

    constructor(aliasMap) {
        if(Validator.isNull(aliasMap)) {
            throw new ReferenceError(`aliasMap is not defined`);
        }

        if(!Validator.isType(aliasMap).of(Object)) {
            throw new TypeError(`alias is not object type`);
        }

        if(Validator.isEmptyObject(aliasMap)) {
            throw new ReferenceError(`aliasMap is not exist to set`);
        }

        this.#aliasMap = aliasMap;
        this.#aliasRuleList = Object.keys(aliasMap);
        this.#cache = {};
    }

    resolve(resolvePath) {

        if(this.#cache[resolvePath]) {
            return this.#cache[resolvePath];
        }

        const filteredAliasRuleList = this.#aliasRuleList.filter((aliasRule)=>resolvePath.startsWith(aliasRule));

        if(filteredAliasRuleList.length > 1) {
            throw new RangeError(`aliases duplicated: ${JSON.stringify(filteredAliasRuleList)}`)
        }

        if(filteredAliasRuleList.length === 1) {
            const selectedAliasRule = filteredAliasRuleList[0];
            const realPath = this.#aliasMap[selectedAliasRule];
            const paresedResolvePath = resolvePath.replace(selectedAliasRule, realPath);
            this.#cache[resolvePath] = paresedResolvePath;
            return paresedResolvePath;
        }

        return resolvePath;
    }
}

module.exports = {
    Manager,
}