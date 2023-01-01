# `type-flow`

A validation library that makes your code safe and readable

## # Installation

```sh
npm i @flagtail/type-flow
```

## # Why `type-flow`

### - Before use `type-flow`

```js
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
```

### - With `type-flow`

```js
const {
    Typing,
    safeCall
} = require('@flagtail/type-flow');

class Member {

    constructor(name, age) {
        
        Typing.check([
            Typing.the(name).isPrimitiveOf(String).isSatisfy(v => v.length <= 30),
            Typing.the(age).isPrimitiveOf(Number).isSatisfy(v => v >= 0)
        ]) 

        this.name = name;
        this.age = age;
    }

    isAdult() {
        return this.age > 18;
    }
}

function main() {

    safeCall(()=>{
        const alice = new Member("Alice", 30)
        console.log(alice.isAdult())
    },
    (err=>{
        console.log(err);
    })) 
}

main()
```

<hr><br><br><br><br>

## # API Reference

### - `isNotNull(value)`

 - value: `any`

#### * example

```js
Typing.isNotNull(false)  // true
Typing.isNotNull(10)     // true
Typing.isNotNull('word') // true

Typing.isNotNull(null)      // false
Typing.isNotNull(undefined) // false
Typing.isNotNull('')        // false
```

<br><br>

### - `isNull(value)`

 - value: `any`

#### * example

```js
Typing.isNotNull(false)  // false
Typing.isNotNull(10)     // false
Typing.isNotNull('word') // false

Typing.isNotNull(null)      // true
Typing.isNotNull(undefined) // true
Typing.isNotNull('')        // true

```

<br><br>

### - `ifNullThrow(value)`

 - value: `any`

#### * example

```js
Typing.ifNullThrow(null)      // ERROR: the value is null or undefined or empty
Typing.ifNullThrow(undefined) // ERROR: the value is null or undefined or empty
Typing.ifNullThrow('')        // ERROR: the value is null or undefined or empty
```

<br><br>

### - `isWrapper(value)`

 - value: `any`

#### * example

```js
Typing.isWrapper(new String('text')) // true
Typing.isWrapper(new Number(10))     // true
Typing.isWrapper(new Boolean(false)) // true

Typing.isWrapper('text') // false
Typing.isWrapper(10)     // false
Typing.isWrapper(false)  // false
```

<br><br>

### - `isPrimitive(value)`

 - value: `any`

#### * example

```js
Typing.isPrimitive(new String('text'))) // false
Typing.isPrimitive(new Number(10)))     // false
Typing.isPrimitive(new Boolean(false))) // false
Typing.isPrimitive(function() {}))      // false
Typing.isPrimitive(class {}))           // false
Typing.isPrimitive({}))                 // false

Typin.isPrimitive(100))                 // true
Typin.isPrimitive('text'))              // true
Typin.isPrimitive(false))               // true
Typin.isPrimitive(BiInt(123456789)))    // true
Typin.isPrimitive(Symbol('sym')))       // true
```

<br><br>

### - `isFunction(value)`

 - value: `any`

#### * example

```js
Typing.isFunction(function myFunc() {}))  // true
Typing.isFunction(function () {}))        // true
Typing.isFunction(()=>{}))                // true

Typing.isFunction(class {}))          // false
Typing.isFunction({}))                // false
Typing.isFunction('function() {}'))   // false
```

<br><br>

### - `isClass(value)`

 - value: `any`

#### * example

```js
Typing.isClass(class myClass {})) // true
Typing.isClass(class {}))         // true
  
Typing.isClass(function myFunc() {})) // false
Typing.isClass(function () {}))       // false
Typing.isClass(()=>{}))               // false
Typing.isClass({}))                   // false
Typing.isClass('class {}'))           // false
```

<br><br>

### - `isObject(value)`

 - value: `any`

#### * example

```js
Typing.isObject([]) // true

class Clazz {}

Typing.isObject(class MyClass {}))  // false
Typing.isObject(class {}))          // false
Typing.isObject(new Clazz()))       // true

Typing.isObject(function myFunc() {})) // false
Typing.isObject(function () {}))       // false
Typing.isObject(()=>{}))               // false

Typing.isObject(new String('test'))) // true
Typing.isObject('test'))             // false
```

<br><br>

### - `isArray(value)`

 - value: `any`

#### * example

```js
Typing.isArray([1, 2, 3, 4])    // true
Typing.isArray({a: 10, b: 20})  // false
```

<br><br>

### - `is(value).instanceOf(type)`

 - value: `any`
 - type : `data type || Array[data type]`

#### * example

```js
class Clazz {}

Typing.is(new Clazz()).instanceOf(Clazz))   // true
Typing.is(new Clazz()).instanceOf(Object))  // true
Typing.is([1, 2, 3, 4]).instanceOf(Array))  // true
Typing.is([1, 2, 3, 4]).instanceOf(Object)) // true

Typing.is('test').instanceOf(String)) // false
Typing.is(Clazz).instanceOf(Clazz))   // false

class Member{}

Typing.is(new Member()).instanceOf([Member,Array]) // true
Typing.is(new Member()).instanceOf([Error,Array])  // false
```

<br><br>

### - `is(value).primitiveOf(type)`

 - value: `any`
 - type : `data type || Array[data type]`

#### * example

```js
Typing.is(10).primitiveOf(Number))        // true
Typing.is('text').primitiveOf(String))    // true 
Typing.is(false).primitiveOf('boolean'))  // true

Typing.is([1, 2, 3]).primitiveOf('array')) // false
Typing.is(10).primitiveOf('string'))       // false
Typing.is('text').primitiveOf(Number))     // false

const age = "30";
const name = "Alice"

Typing.is(age).primitiveOf(["number", String]) // true
Typing.is(name).primitiveOf([Number,Boolean])  // false
```

<br><br>

### - `is(value).satisfy(action)`

 - value : `any`
 - action: `function`

#### * example

```js
class Member {
    constructor(name, age) {
    this.name = name;
    this.age = age;
    }

    isAdult() {
    return this.age >= 18
    }
}

Typing.is(100).satisfy(v => v % 2 === 0)) // true

Typing.is(new Member('rhie', 17)).satisfy(v => v.isAdult())) // false
```

<br><br>

### - `the(value) ~~~ isValid()`

 - value: `any`

chainning method(return `TypingChain`)

#### * example

```js
class Member {
    constructor(name, age) {
    this.name = name;
    this.age = age;
    }

    isAdult() {
    return this.age >= 18
    }
}

Typing.the(111)
      .isPrimitiveOf(Number)
      .isNotNull()
      .isSatisfy(v => v >= 100)
      .isValid() // true

Typing.the(new Member('rhie-coder', 20))
      .isInstanceOf(Member)
      .isSatisfy(v => v.isAdult()))
      .isValid()
```

<br><br>

### - `check(typeCHeck)`

 - typeCheck: `Array[TypingChain]`

It will throw errors if `TypingChian` is not valid.

#### * example

```js
class Member {
    constructor(name, age) {
    this.name = name;
    this.age = age;
    }

    isAdult() {
    return this.age >= 18
    }
}

Typing.check([
    Typing.the('hello').isNotNull().isPrimitiveOf(String),
    Typing.the({role:"user"}).isArray().isNotNull().isSatisfy(v => v.role === "admin"),
    Typing.the(100).isPrimitiveOf(Number).isSatisfy(v => v % 2 === 0),
    Typing.the(new Member('rhie', 17)).isInstanceOf(Member).isSatisfy(v => v.isAdult())
])
/* Throw Errors
[
  [
    {
      "target": {
        "role": "user"
      }
    },
    {
      "isArray": false
    },
    {
      "isNotNull": true
    },
    {
      "isSatisfy": false
    }
  ],
  [
    {
      "target": {
        "name": "rhie",
        "age": 17
      }
    },
    {
      "isInstanceOf": true
    },
    {
      "isSatisfy": false
    }
  ]
]
*/
```

<br><br>

### - `safeCall(callback, errorHandler)`

 - callback    : `function()`
 - errorHandler: `function(err)`

#### * example

```js
try {
    Typing.check([
        Typing.the('hello').isNotNull().isPrimitiveOf(String),
        Typing.the({role:"user"}).isArray().isNotNull().isSatisfy(v => v.role === "admin"),
        Typing.the(100).isPrimitiveOf(Number).isSatisfy(v => v % 2 === 0),
        Typing.the(new Member('rhie', 17)).isInstanceOf(Member).isSatisfy(v => v.isAdult())
    ])
} catch(err) {
    console.log(JSON.stringify(
        JSON.parse(err.message),
        null,
        2
    ))
}
```

is same with below:

```js
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
```

<hr><br><br><br><br>


## # License

[MIT](./LICENSE)