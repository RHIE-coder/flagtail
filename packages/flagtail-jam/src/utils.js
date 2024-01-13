/** 
 * @name utils.js
 * @author rhie-coder <https://github.com/rhie-coder>
 * @description
 * pure utility functions to avoid code duplication
 */
const path = require("path");
const fs = require("fs");
const strip = require("strip-comments");

/**
 * @name Validator
 * @class
 * @public
 * @description
 * javascript data validation
 */
class Validator {

    constructor() {
        throw new SyntaxError(`the instance of ${this.constructor.name} is not allowed`);
    }

    /**
     * @static
     * @param {any} value 
     * @returns {boolean} return true if value is undefined or null
     */
    static isNull(value) {
        if(value === undefined || value === null) {
            return true;
        }

        return false;
    }

    /**
     * @static
     * @param {any} value 
     * @returns {boolean} return true if value is not undefined or null
     */
    static isNotNull(value) {
        return !Validator.isNull(value);
    }

    /**
     * @static
     * @param {any} value 
     * @returns {boolean} return true if value is empty string
     */
    static isEmptyString(value) {
        if (typeof value === "string") {
            return value === "";
        }
        return false;
    }

    /**
     * @static
     * @param {any} value 
     * @returns {boolean} return true if value is empty object
     */
    static isEmptyObject(value) {
        if(value instanceof Object) {
            return Object.keys(value).length === 0;
        }

        return false;
    }
    /**
     * @static
     * @param {any} value 
     * @returns {boolean} return true if value is empty array
     */
    static isEmptyArray(value) {
        const isObject = value instanceof Object;
        const isArray = isObject && Array.isArray(value);

        if (isArray) {
            return value.length === 0;
        }

        return  false;
    }
    /**
     * @static
     * @param {any} value 
     * @returns {object} return { function of(typeName) }
     */
    static isType(value) {
        return {
            /**
             * @param {any} typeName 
             * @returns {boolean} result of type equals
             */
            of(typeName) {
                if(value instanceof Object) {
                    return value instanceof typeName;
                }
                return typeof value === typeName;
            },
        };
    }
}

/**
 * @name BasePath
 * @class
 * @public
 * @description
 * get file data from base path
 */
class BasePath {

    #basePath
    #isChecked;

    constructor(basePath) {
        if(typeof basePath !== "string") {
            throw new TypeError(`'basePath' is not string`);
        }

        this.#basePath = basePath;
        this.#isChecked = false;
    }

    get basePath() {
        return this.#basePath;
    }

    isCheck() {
        return this.#isChecked;
    }

    check() {
        if(!fs.existsSync(this.#basePath)) {
            throw new ReferenceError(`${this.#basePath} is not exists`)
        }

        if(!fs.statSync(this.#basePath).isDirectory()) {
            throw new RangeError(`${this.#basePath} is not directory`)
        }

        this.#isChecked = true;
        return this;
    }

    getChildPath(childPath) {
        if(typeof childPath !== "string") {
            throw new TypeError(`'childPath' is not string`);
        }

        if(!this.#isChecked) {
            throw new ReferenceError(`need to check basePath=${this.#basePath}`)
        }
        const fullPath = path.join(this.#basePath, childPath); 

        if(!fs.existsSync(fullPath)) {
            throw new ReferenceError(`${fullPath} is not exists`);
        }

        return fullPath;
    }

    loadFileData(childFilePath) {
        const fullFilePath = this.getChildPath(childFilePath); 

        if(!fs.statSync(fullFilePath).isFile()) {
            throw new RangeError(`${fullFilePath} is not file`);
        }

        const data = fs.readFileSync(fullFilePath);
        const commentRemovedString = strip(data.toString());
        return commentRemovedString;
    }

    loadJSON(childFilePath) {
        return JSON.parse(this.loadFileData(childFilePath));
    }
    
}


/**
 * @param {string} dotSupportableKey
 * @param {object} targetObj 
 * @returns {any} value of object
 * @description
 * support dot-included key name to get value of object
 * @example
 * ```js
 * const target = {
 *     a: 100,
 *     b: {
 *         c: 200,
 *         d: {
 *             e: 300,
 *             f: [10, 20, 30]
 *         }
 *     },
 *     g: 400,
 * }
 *
 * console.log(getObjectValueFromKey("a", target)) // 100
 * console.log(getObjectValueFromKey("b.c", target)) // 200
 * console.log(getObjectValueFromKey("b.d.e", target)) // 300
 * console.log(getObjectValueFromKey("b.d.f.1", target)) // 20
 * console.log(getObjectValueFromKey("g", target)) // 400
 * ```
 */
function getObjectValueFromKey(dotSupportableKey, targetObj) {
    dotSupportableKey = dotSupportableKey ?? "";

    if (dotSupportableKey === "") {
        throw new ReferenceError(`the dotSupportableKey is not defined`)
    }

    if (typeof dotSupportableKey !== "string") {
        throw new TypeError(`the dotSupportableKey should be string type`)
    }

    if (!targetObj) {
        throw new ReferenceError(`the targetObj is not defined`)
    }

    if (typeof targetObj !== "object") {
        throw new TypeError(`the targetObj should be object type`)
    }

    const filteredKeys = dotSupportableKey.split(".");

    if (!filteredKeys.every(keyName => keyName !== "")) {
        throw new SyntaxError(`${dotSupportableKey} is invalid key to get value`)
    }

    for (const keyName of filteredKeys) {
        targetObj = targetObj[keyName];

        if (!targetObj) {
            break;
        }
    }

    return targetObj;
}


/**
 * @param {string} originPath The file path being filtered
 * @param {string} tailName The string of the tail file path to be removed
 * @returns {string} filtered file path
 * @example
 * ```js
 * const originPath = "/path/to/package/node_modules"
 * const filteredPath = PathGenerator.removeTail(originPath, "node_modules")
 * console.log(filteredPath) // "/path/to/package" 
 * ```
 * @description
 * not use it now. just preserve function from [module-alias] & [better-module-alias]
 */
function removeTail(originPath, tailName) {
    originPath = originPath ?? "";

    if (originPath === "") {
        throw new ReferenceError(`the originPath is not defined`)
    }

    if (typeof originPath !== "string") {
        throw new TypeError(`the originPath should be string type`)
    }

    tailName = tailName ?? "";

    if (tailName === "") {
        throw new ReferenceError(`the tailName is not defined`)
    }

    if (typeof tailName !== "string") {
        throw new TypeError(`the tailName should be string type`)
    }

    const rex = new RegExp(`^(.+)[\\/]${tailName}$`)

    return originPath.replace(rex, '$1');
}


module.exports = Object.freeze({
    Validator,
    BasePath,
    getObjectValueFromKey,
});