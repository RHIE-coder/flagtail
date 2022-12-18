const Typing  = require('../src');

test('CHECK', () => {
  Typing.chain('hello').isNotNull().primitiveOf(String).sameWith('hello');
});


console.log(Typing.chain('hello').isNotNull().primitiveOf(String).sameWith('hello'))


