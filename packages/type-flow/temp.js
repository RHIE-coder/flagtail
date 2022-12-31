const {
    Typing,
    safeCall
} = require('./src');

class Member {

    constructor(name, age) {
        
        

        if(typeof name === "string") {
            if(name.length > 30) {
                throw new RangeError(`the name length (${name.length}) is too long (over 30)`)
            }
            this.name = name;
        } else {
            throw new TypeError(`the name type must be string type`);
        }

        if(typeof age === "number") {
            if(age < 0) {
                throw new RangeError(`the age ${age} cannot be minus number`);
            }
            this.age = age;
        } else {
            throw new TypeError(`the age type must be number type`);
        }

    }

    isAdult() {
        return this.age > 18;
    }
}

function main() {
    try {
        const alice = new Member("Alice", 30)
        console.log(alice.isAdult())
    } catch (err) {
        console.log(err);
    }
}

main()