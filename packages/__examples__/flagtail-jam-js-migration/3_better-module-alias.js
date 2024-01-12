const moduleAlias = require("better-module-alias")
moduleAlias(__dirname);

const math = require("@/utils/math");
console.log(math.add(10, 20));