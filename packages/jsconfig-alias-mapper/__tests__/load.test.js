const jsconfigAliasMapper = require('../')
const path = require("path")

test('jest alias mapping check', () => {
    const { add } = require("@/utils/math");
    const encrpyter = require('@/crypto/encrypt');
    const decrpyter = require('@/crypto/decrypt');

    expect(add(1, 2)).toBe(3);
    expect(decrpyter(encrpyter('hello world'))).toBe('hello world');
})

test('no option check', ()=> {
    const aliasPath = jsconfigAliasMapper()[path.resolve('.')]['@/']

    const { add } = require(`${aliasPath}utils/math`);
    const encrpyter = require(`${aliasPath}crypto/encrypt`);
    const decrpyter = require(`${aliasPath}crypto/decrypt`);

    expect(add(1, 2)).toBe(3);
    expect(decrpyter(encrpyter('hello world'))).toBe('hello world');
})

test('rootPath option check', ()=> {
    const aliasPath = jsconfigAliasMapper({
        rootPath: __dirname,
    })[__dirname]["@/"]

    const { add } = require(`${aliasPath}utils/math`);
    const encrpyter = require(`${aliasPath}crypto/encrypt`);
    const decrpyter = require(`${aliasPath}crypto/decrypt`);

    expect(add(1, 2)).toBe(3);
    expect(decrpyter(encrpyter('hello world'))).toBe('hello world');
});

test('alias option check', ()=> {
    const aliasPath = jsconfigAliasMapper({
        alias: {
            '@/*': "../mock/*"
        },
    })[__dirname]["@/"]
    const { add } = require(`${aliasPath}utils/math`);
    const encrpyter = require(`${aliasPath}crypto/encrypt`);
    const decrpyter = require(`${aliasPath}crypto/decrypt`);

    expect(add(1, 2)).toBe(3);
    expect(decrpyter(encrpyter('hello world'))).toBe('hello world');
})

test('use all options check', ()=> {
    const aliasPath = jsconfigAliasMapper({
        rootPath: __dirname,
        alias: {
            '@/*': "../mock/*"
        },
    })[__dirname]["@/"]

    const { add } = require(`${aliasPath}utils/math`);
    const encrpyter = require(`${aliasPath}crypto/encrypt`);
    const decrpyter = require(`${aliasPath}crypto/decrypt`);

    expect(add(1, 2)).toBe(3);
    expect(decrpyter(encrpyter('hello world'))).toBe('hello world');
})