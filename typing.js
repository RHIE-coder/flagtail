const JSONResolver = require("./json-resolver");

const preventSignal = Symbol("prevent-direct-call")

class SafeCaller {

    static async watch(callback, exceptHandler) {

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

    static watch = SafeCaller.watch;

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
        return typeof value === "function" && (
            value.toString().startsWith("()") ||
            value.toString().startsWith("function")
        )
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

    static notValid(typingArr) {
        return !typingArr.every(bool => {
            if(bool instanceof TypingChain) return bool.isValid() === true;
            return bool === true;
        });
    }

    static valid(typingArr) {
        return typingArr.every(bool => {
            if(bool instanceof TypingChain) return bool.isValid() === true;
            return bool === true;
        });
    }

    static is(value) {
        return {
            
            instanceOf(typeName) {
                return value instanceof typeName;
            },

            primitiveOf(typeName) {
                
                if(typeof typeName === "function") {
                    return Typing.#wrapperTypes.includes(typeName);
                }

                if(typeof typeName === "string") {
                    return Typing.#primitiveTypes.includes(typeName);
                }

                return false;

            },

            sameWith(valueOrType) {
                if(Typing.isArray(valueOrType)) {
                    for(let i = 0; valueOrType.length > 0; i++){
                        if(value === valueOrType[i]) return true;
                    }
                    return false;
                }
                return value === valueOrType;
            },
            
        }
    }

    static chain(target) {

        const propNames = Object.getOwnPropertyDescriptors(Typing);

        const chainable = new TypingChain(target, preventSignal);
        
        ["instanceOf", "primitiveOf", "sameWith"].forEach(innerKeyOf_is=>{
            chainable[innerKeyOf_is] = function(arg) {
                this.update({
                    name: innerKeyOf_is, 
                    result: Typing.is(this.target)[innerKeyOf_is](arg),
                    param: arg,
                }, preventSignal);
                return this;
            } 
        })

        delete propNames["chain"]
        delete propNames["is"]
        delete propNames["call"]


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

module.exports = Typing