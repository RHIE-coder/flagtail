const JSONResolver = require("./json-resolver");

const preventSignal = Symbol("prevent-direct-call")

async function safeCall(callback, exceptHandler) {
    try {
        return await callback();
    } catch (error) {
        if(!exceptHandler) {
            exceptHandler = (error) => {
                console.error(error.message);
                return error
            }
        }

        return await exceptHandler(error);
    }
}

class TypingChain {

    #target;
    #boolResults
    #verbose

    constructor(target, internalSignal) {
        this.#preventDirectCall("TypingChain", internalSignal);
        this.#target = target;
        this.#boolResults = [];
        this.#verbose = [{target}];
    }

    get target(){
        return this.#target;
    }

    isValid() {
        return this.#boolResults.every(trueOrFalse => trueOrFalse === true);
    }

    verbose() {
        return JSONResolver.action(this.#verbose);
    }

    #preventDirectCall(name, internalSignal){
        if(internalSignal !== preventSignal) throw SyntaxError(`Can't direct call ${name}`);
    }

    update(args, internalSignal){
        this.#preventDirectCall("TypingChain.update", internalSignal);
        this.#boolResults.push(args.result);
        this.#verbose.push({ [args.name]: args.result });
    }
}

class Typing {

    constructor() {
        throw new SyntaxError("Can't make <Typing> instance");
    }

    static #wrapperTypes = [ Boolean, Number, BigInt, String, Symbol]

    static #primitiveTypes = [ "boolean", "number", "bigint", "string", "symbol" ]

    static isNotNull(value) {
        return (
            value !== null &&
            value !== undefined &&
            value !== ""
        ) ? true : false;
    }

    static isNull(value) {
        return (
            value === null ||
            value === undefined ||
            value === ""
        ) ? true : false;
    }

    static ifNullThrow(value) {
        if (Typing.isNull(value)) {
            throw new TypeError(`the value is null or undefined or empty`)
        }
        return true;
    }

    static isWrapper(value) {
        const wrapperClasses = [String, Number, Boolean];
        return wrapperClasses.some(clazz => value instanceof clazz)
    }

    static isPrimitive(value) {
        return (typeof value !== 'object' && typeof value !== 'function') || value === null
    }

    static isFunction(value) {
        return typeof value === "function" && !value.toString().startsWith("class")
    }

    static isClass(value) {
        return typeof value === "function" && value.toString().startsWith("class")
    }

    static isObject(value) {
        return typeof value === "object"
    }

    static isArray(value) {
        return typeof value === "object" && value instanceof Array;
    }

    static check(typingArr) {

        const checkArgsMatchedTypingChainType = typingArr.every(boolInstance=> {
            return boolInstance instanceof TypingChain;
        })

        if(!checkArgsMatchedTypingChainType) {
            throw new TypeError("All of types must be <TypingChain> type");
        }

        const isValid = typingArr.every(typeChainResult => {
            return typeChainResult.isValid() === true;
        });
        
        const verboseArrItem = typingArr.map(typeChainResult=> typeChainResult.verbose())
        const errItem = []
        for (let verboseInfo of verboseArrItem) {
            for (let infoItem of verboseInfo.slice(1)) {
                console.log(infoItem);
                const value = Object.entries(infoItem)[0][1];
                if (value === false) {
                    errItem.push(verboseInfo);
                    break;
                }
            }
        }
        if(!isValid) {
            throw new ReferenceError(
                JSON.stringify(
                    errItem,
                    // null,
                    // 4,
                )
            )
        }

        return isValid;
    }

    static is(value) {
        return {
           
            satisfy(predictCallback) {
  
                if(!Typing.isFunction(predictCallback)) {
                    throw new TypeError(`the callback must be function`);
                }

                const trueOrFalse = predictCallback(value);

                if(!Typing.is(trueOrFalse).primitiveOf(Boolean)) {
                    throw new TypeError(`the returned value of callback must be boolean`);
                }

                return trueOrFalse;
            },

            instanceOf(typeName) {
                return value instanceof typeName;
            },

            primitiveOf(typeName) {
               
                if(typeof typeName === "function") {
                    const primitiveIndex = Typing.#wrapperTypes.indexOf(typeName);

                    if(primitiveIndex === -1) {
                        return false;
                    }

                    return typeof value === Typing.#primitiveTypes[primitiveIndex];
                }

                if(typeof typeName === "string") {
                    const primitiveIndex = Typing.#primitiveTypes.indexOf(typeName);

                    if(primitiveIndex === -1) {
                        return false;
                    }

                    return typeof value === Typing.#primitiveTypes[primitiveIndex];
                }

                return false;
            },
            
        }
    }

    static the(target) {

        const propNames = Object.getOwnPropertyDescriptors(Typing);

        const chainable = new TypingChain(target, preventSignal);
        
        ["instanceOf", "primitiveOf", "satisfy"].forEach(innerKeyOf_is=>{
            const prefix = "is"; 
            const keyName = prefix + innerKeyOf_is[0].toUpperCase() + innerKeyOf_is.substring(1)
            chainable[keyName] = function(arg) {
                this.update({
                    name: keyName, 
                    result: Typing.is(this.target)[innerKeyOf_is](arg),
                    param: arg,
                }, preventSignal);
                return this;
            } 
        })
        delete propNames["the"]
        delete propNames["is"]

        for(const key in propNames){
            if(key === "length" || key === "name" || key === "prototype") continue;
            chainable[key] = function() {
                this.update({
                    name: key, 
                    result: Typing[key](this.target),
                }, preventSignal);
                return this;
            }
        }

        return chainable;
    }

}

module.exports = {
    Typing,
    safeCall,
}