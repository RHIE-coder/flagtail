# `jsconfig-alias-mapper`

Register custom module paths using jsconfig JSON file in NodeJS

## # Usage

### - Installation

```sh
npm i @flagtail/jsconfig-alias-mapper 
```

<br><br>

### - `jsconfig.json`

```json
{
  "compilerOptions": {
    "module": "commonJS",
    "target": "ES2015",
    "baseUrl": "./",
    "paths": {
      "@/*": [
          "src/*"
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

the important key is `paths`

```json
...
...
...
    "paths": {
      "@/*": [
          "src/*"
      ]
    }
...
...
...
```

`baseURL` is irrelevant with this module

`jsconfig.json` just indicates that directory is the root of a JavaScript Project to VS Code Editor.

#### * Reference

 - [jsconfig.json](https://code.visualstudio.com/docs/languages/jsconfig)
 - [VS Code Editor](https://code.visualstudio.com/)

<br><br>

### - `app.js`

```js
const path = require('path')

require('@flagtail/jsconfig-alias-mapper')()

const myModule = require('@/utils/something');
```

<hr><br><br><br><br><br>

## # Options

### - `rootPath`

you can give root path directly that has `jsconfig.json`.

```js
const path = require('path')

require('@flagtail/jsconfig-alias-mapper')({
    rootPath: path.join(__dirname, '..'),
})

const myModule = require('@/utils/something');
```

<br><br>

### - `alias`

you don't need to scan the `jsconfig.json`. and give aliases to resolve modules directly.

not recommend to remove the `jsconfig.json` even if you don't need it, because of IDE hint functions.

```js
require('@flagtail/jsconfig-alias-mapper')({
    alias : {
      '@/*': '../src/*'
    }
})

const myModule = require('@/utils/something');
```

<hr><br><br><br><br><br>

## # Using Jest

Unfortunately, `@flagtail/jsconfig-alias-mapper` itself would not work from Jest due to a custom behavior of Jest's require. But you can use it's own aliasing mechanism instead. The configuration can be defined either in `package.json` or `jest.config.js`:

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

#### * Reference

[Jest Configuration](https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring)

<hr><br><br><br><br><br>

## # License

[MIT](./LICENSE)

### * Reference

this package takes inspiration from [`module-alias`](https://github.com/ilearnio/module-alias) & [`better-module-alias`](https://github.com/Sawtaytoes/better-module-alias)