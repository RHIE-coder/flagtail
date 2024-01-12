const {
    Manager,
} = require('./manager')

const initModuleResolver = function(manager){

    if(!(manager instanceof Manager)) {
        throw new TypeError(`manager shuold be instance of <Manager>`)
    }

    const BuiltinModule = require('module');

    // Guard against poorly mocked module constructors
    const Module = module.constructor.length > 1
                    ? module.constructor
                    : BuiltinModule;

    const originalResolveFilename = Module._resolveFilename;

    Module._resolveFilename = function (resolvePath, parentModule, isMain) {	

        return originalResolveFilename.call(
                    this,
                    manager.resolve(resolvePath),
                    parentModule,
                    isMain,
                )
    }
}

module.exports = initModuleResolver