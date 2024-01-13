# `flagtail-jam`

## # JAM (JSON Aliases Mapper)

Register custom module paths using JSON configuration file in NodeJS

support: `jsconfig.json`, `tsconfig.json`, `package.json`

<br><br>

## # Why Set Module Aliases Using `jsconfig.json` Or `tsconfig.json`

You can enjoy IDE's intelligence, code automatic completion, code location movement, and more.

 - [jsconfig.json reference](https://code.visualstudio.com/docs/languages/jsconfig)
 - [tsconfig.json reference](https://www.typescriptlang.org/tsconfig)

<br><br>

## # Why Need `flagtail-jam`

#### - "god no plz... save us..."

```js
require('../../../../some/very/deep/module');
```

what if you change this code file location?

```js
require('../../../../../../some/very/deep/module');
```

calculate it carefully... ok?

#### - "thx god!"

```js
require('@/some/very/deep/module');
```

what if you change this code file location?

```js
require('@/some/very/deep/module');
```

cool~!

<br><br>

## # Usage

### - Installation

```sh
npm i --save flagtail-jam
```

### - JavaScript Configuration

##### & `jsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": "./jslib",
    "paths": {
      "@/crypto/*": [
        "crypto/*"
      ],
      "@/utils": [
        "utils/*"
      ]
    }
  },
  "exclude": [
    "dist",
    "node_modules",
    "build",
    ".vscode",
    "coverage",
    ".npm",
    ".yarn"
  ]
}
```

##### & `index.js`

```js
const jam = require("flagtail-jam");

jam.load(); // default mode

// OR

jam.load({ 
  rootPath: process.cwd(), 
  configType: jam.ConfigType.JSCONFIG
}) // same with `jam.load()`

/**
 * ConfigType
 *  - JSCONFIG = set aliases from jsconfig.json (recommended in JavaScript)
 *  - TSCONFIG = set aliases from tsconfig.json (recommended in TypeScript)
 *  - PACKAGE  = set aliases from package.json  (to support migration)
 */  

// your code start: EXAMPLE
const encrypt = require("@/crypto/encrypt");
const decrypt = require("@/crypto/decrypt");
const math = require("@/utils/math");
```

<br><br>

### - TypeScript Configuration

#### & Structure

```
├── src
│   ├── index.ts
│   └── jslib
│       ├── crypto
│       │   ├── decrypt.ts
│       │   └── encrypt.ts
│       └── utils
│           └── math.ts
└── tsconfig.json
```
##### & `tsconfig.json`

```json
{
  "include": ["src/**/*.ts", "index.ts"],
  "compilerOptions": {
    "baseUrl": "./src/jslib",                                          // <---
    "paths": { "@/crypto/*": ["crypto/*"], "@/utils/*": ["utils/*"] }, // <---
    "target": "es5", 
    "module": "CommonJS",
    "rootDir": "./",
    "declaration": true,
    "outDir": "./build",
    "declarationDir": "./types",
  }
}
```

##### & `index.ts`

```js
import * as jam from "flagtail-jam";

const conf:typeof jam.ConfigType = jam.ConfigType;

const result:jam.JamSettingResult = jam.load({
    configType: conf.TSCONFIG,
}) 

// your code start: EXAMPLE
console.log(result);

import {add} from "@/utils/math";

console.log(add(10, 20));
```

<br><br>

### - Package Configuration

##### & `package.json`

 - same with [`module-alias`](https://github.com/ilearnio/module-alias) & [`better-module-alias`](https://github.com/Sawtaytoes/better-module-alias)

```json
{
  "_moduleAliases": {
    "@/crypto": "./jslib/crypto",
    "@/utils": "./jslib/utils"
  }
}
```

##### & `index.js`

```js
const jam = require("flagtail-jam");

jam.load({ 
  configType: jam.ConfigType.PACKAGE,
})

// your code start: EXAMPLE
const encrypt = require("@/crypto/encrypt");
const decrypt = require("@/crypto/decrypt");
const math = require("@/utils/math");
```


<br><br>

### - Options

#### * `rootPath`

you can give root path directly that has `jsconfig.json`, `tsconfig.json` or `tsconfig.json`.

```js
jam.load({ 
  rootPath: process.cwd(), 
}) 
```

#### * `configType` (will be ignored when the `aliasMap` property is given)

 - JSCONFIG: set aliases from jsconfig.json (recommended in JavaScript)
 - TSCONFIG: set aliases from tsconfig.json (recommended in TypeScript)
 - PACKAGE : set aliases from package.json  (to support migration)

```js
jam.load({ 
  configType: jam.ConfigType.TSCONFIG
}) 
```

#### * `aliasMap` (`aliasMap` takes precedence over `configType`.)

```js
const nodePath = require('path');

jam.load({ 
  aliasMap:{
      '@/crypto': nodePath.join('mock', 'crypto'),
      '@/utils': nodePath.join('mock', 'utils'),
  }
}) 
```

<br><br>

## # Using Jest

Unfortunately, `flagtail-jam` itself would not work from Jest due to a custom behavior of Jest's require. But you can use it's own aliasing mechanism instead. The configuration can be defined either in `package.json` or `jest.config.js`:

### - `package.json`

```json
"jest": {
  "moduleNameMapper": {
    "@/(.*)": "<rootDir>/mock/$1",
  },
}
```

### - `jest.config.js`

```js
module.exports = {
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/mock/$1",
  },
}
```
 - [Jest Configuration](https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring)

<br><br>

## # Migration

### - `_moduleDirectories` is not supported

##### & `package.json`

```json
{
  "_moduleAliases": {
    "@/crypto": "./jslib/crypto",
    "@/utils": "./jslib/utils"
  },
  "_moduleDirectories": ["my_custom_node_module"] 
}
```

<br><br>

## # License

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

<br><br>

## # Copyright

ß`flagtail-jam` is released into public domain by the copyright holder.

This README file was originally wrttin by [RHIE Min Hyung](https://github.com/rhie-coder) and is likewise released into the public domain.

THis project is maintained by [RHIE Min Hyung](https://github.com/rhie-coder).

<br><br>

### # Reference

this package takes inspiration from [`module-alias`](https://github.com/ilearnio/module-alias) & [`better-module-alias`](https://github.com/Sawtaytoes/better-module-alias)