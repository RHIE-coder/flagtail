/**
 * @name ConfigType
 * @public
 */
class ConfigType {
    static #JSCONFIG = "jsconfig.json";
    static #TSCONFIG = "tsconfig.json";
    static #PACKAGE = "package.json";

    constructor() {
        throw new SyntaxError(`${this.constructor.name}'s instance is blocked`)
    }

    static get JSCONFIG() {
        return ConfigType.#JSCONFIG;
    }

    static get TSCONFIG() {
        return ConfigType.#TSCONFIG;
    }

    static get PACKAGE() {
        return ConfigType.#PACKAGE;
    }
}

module.exports = Object.freeze({
    ConfigType,
});
