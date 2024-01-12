
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
 */
function removeTail(originPath:string, tailName:string):string{
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

export default function() {
    const executorPath = process.argv[0];
    const removeTarget = removeTail(executorPath,""
}