const Typing = require('../src');

(async()=>{
    const result = Typing.chain('hello').isNotNull().primitiveOf(String).sameWith('hello');
    console.log(result.isValid())
    console.log(result.verbose())

    Typing.watch(()=>{
        if(
            Typing.notValid([
                Typing.chain('hello').isNotNull().primitiveOf(String).sameWith('hello'),
                Typing.chain(100).isNotNull().primitiveOf(Number).sameWith(111),
                Typing.is('greeting').sameWith('greeting'),
            ])
        ) {
            throw new TypeError()
        }
    },
    (err)=>{
        console.log(err);
    })
})()