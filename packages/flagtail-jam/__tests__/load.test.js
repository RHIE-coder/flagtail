const jam = require('..');
const nodePath = require('path');

test('origin mock test using jest configuration', () => {
    const { add } = require("#/utils/math");
    const encrpyter = require('#/crypto/encrypt');
    const decrpyter = require('#/crypto/decrypt');

    expect(add(1, 2)).toBe(3);
    expect(decrpyter(encrpyter('hello world'))).toBe('hello world');
})


test('default loading', () => {

    const result = jam.load();

    expect(result.aliasMap['@/crypto']).toBeDefined()
    expect(result.aliasMap['@/utils']).toBeDefined()

    const { add } = require(`${result.aliasMap['@/utils']}/math`);
    const encrpyter = require(`${result.aliasMap['@/crypto']}/encrypt`);
    const decrpyter = require(`${result.aliasMap['@/crypto']}/decrypt`);

    expect(add(1, 2)).toBe(3);
    expect(decrpyter(encrpyter('hello world'))).toBe('hello world');

    console.log(result.aliasMap)
})

test('mapping alias directly', () => {

    const result = jam.load({
        aliasMap:{
            '@/crypto': nodePath.join("mock", "crypto"),
            '@/utils': nodePath.join("mock", "utils"),
        }
    });

    expect(result.aliasMap['@/crypto']).toBeDefined()
    expect(result.aliasMap['@/utils']).toBeDefined()

    const { add } = require(`${result.aliasMap['@/utils']}/math`);
    const encrpyter = require(`${result.aliasMap['@/crypto']}/encrypt`);
    const decrpyter = require(`${result.aliasMap['@/crypto']}/decrypt`);

    expect(add(1, 2)).toBe(3);
    expect(decrpyter(encrpyter('hello world'))).toBe('hello world');

})

test('mapping alias using options', () => {

    const result = jam.load({
        rootPath: process.cwd(),
        configType: jam.ConfigType.JSCONFIG,
    });

    expect(result.aliasMap['@/crypto']).toBeDefined()
    expect(result.aliasMap['@/utils']).toBeDefined()

    const { add } = require(`${result.aliasMap['@/utils']}/math`);
    const encrpyter = require(`${result.aliasMap['@/crypto']}/encrypt`);
    const decrpyter = require(`${result.aliasMap['@/crypto']}/decrypt`);

    expect(add(1, 2)).toBe(3);
    expect(decrpyter(encrpyter('hello world'))).toBe('hello world');

})