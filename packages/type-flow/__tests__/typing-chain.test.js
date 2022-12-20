const { Typing, safeCall } = require('../src');

class Member {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    isAdult() {
        return this.age >= 18
    }
}

test('CHECK: the (chaining)', () => {
    expect(Typing.the(111).isPrimitiveOf(Number).isNotNull().isSatisfy(v => v >= 100).isValid()).toBeTruthy();
    expect(Typing.the(new Member('rhie-coder', 20)).isInstanceOf(Member).isSatisfy(v => v.isAdult())).toBeTruthy();
});

test('CHECK: safeCall', async () => {
    const result = await safeCall(() => {
            Typing.check([
                Typing.the('hello').isNotNull().isPrimitiveOf(String),
                Typing.the({role:"user"}).isArray().isNotNull().isSatisfy(v => v.role === "admin"),
                Typing.the(100).isPrimitiveOf(Number).isSatisfy(v => v % 2 === 0),
                Typing.the(new Member('rhie', 17)).isInstanceOf(Member).isSatisfy(v => v.isAdult())
            ])
        },
        (err) => {
            return err
        })
    const errMsg = (await result).message;
    expect(errMsg).toBe('[[{"target":{"role":"user"}},{"isArray":false},{"isNotNull":true},{"isSatisfy":false}],[{"target":{"name":"rhie","age":17}},{"isInstanceOf":true},{"isSatisfy":false}]]')
})


