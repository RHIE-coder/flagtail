const jsconfigAliasMapper = require('../')

test('module import check', ()=> {
    jsconfigAliasMapper({
        rootPath: __dirname,
    })
    const { add } = require("@/utils/math");
    const encrpyter = require('@/crypto/encrypt');
    const decrpyter = require('@/crypto/decrypt');

    expect(add(1, 2)).toBe(3);
    expect(decrpyter(encrpyter('hello world'))).toBe('hello world');
});