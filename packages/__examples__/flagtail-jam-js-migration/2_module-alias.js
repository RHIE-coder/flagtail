const moduleAlias = require("module-alias")
moduleAlias(__dirname + '/package.json')
const math = require("utils/math");
// const math2 = require("@utils/math"); // ERROR: duplicate, so jam does not support _moduleDirectories
console.log(math.add(10, 20));