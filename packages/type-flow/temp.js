const {
    Typing,
    safeCall
} = require('./src');


class Member {
    constructor(name, age) {
    this.name = name;
    this.age = age;
    }

    isAdult() {
    return this.age >= 18
    }
}

safeCall(()=>{
    Typing.check([
        Typing.the('hello').isNotNull().isPrimitiveOf(String),
        Typing.the({role:"user"}).isArray().isNotNull().isSatisfy(v => v.role === "admin"),
        Typing.the(100).isPrimitiveOf(Number).isSatisfy(v => v % 2 === 0),
        Typing.the(new Member('rhie', 17)).isInstanceOf(Member).isSatisfy(v => v.isAdult())
    ])
},
(err)=> {
    console.log(JSON.stringify(
        JSON.parse(err.message),
        null,
        2
    ))
})