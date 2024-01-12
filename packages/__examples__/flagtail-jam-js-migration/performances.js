const jam = require("flagtail-jam");

jam.load();

/*  
    original
*/
console.time("original load module / tries = 1")
require("./jslib/utils/math");
console.timeEnd("original load module / tries = 1")

console.time("original load module / tries = 2")
require("./jslib/utils/math");
console.timeEnd("original load module / tries = 2")

console.time("original load module / tries = 3")
require("./jslib/utils/math");
console.timeEnd("original load module / tries = 3")

console.time("original load module / tries = 4")
require("./jslib/utils/math");
console.timeEnd("original load module / tries = 4")

console.time("original load module / tries = 5")
require("./jslib/utils/math");
console.timeEnd("original load module / tries = 5")

console.time("original load module / tries = 6")
require("./jslib/utils/math");
console.timeEnd("original load module / tries = 6")

console.time("original load module / tries = 7")
require("./jslib/utils/math");
console.timeEnd("original load module / tries = 7")

/*  
    flagtail-jam
*/
console.time("jam load module / tries = 1")
require("@/utils/math");
console.timeEnd("jam load module / tries = 1")

console.time("jam load module / tries = 2")
require("@/utils/math");
console.timeEnd("jam load module / tries = 2")

console.time("jam load module / tries = 3")
require("@/utils/math");
console.timeEnd("jam load module / tries = 3")

console.time("jam load module / tries = 4")
require("@/utils/math");
console.timeEnd("jam load module / tries = 4")

console.time("jam load module / tries = 5")
require("@/utils/math");
console.timeEnd("jam load module / tries = 5")

console.time("jam load module / tries = 6")
require("@/utils/math");
console.timeEnd("jam load module / tries = 6")

console.time("jam load module / tries = 7")
require("@/utils/math");
console.timeEnd("jam load module / tries = 7")

/*  
    module-alias
*/
// const moduleAlias = require('module-alias');
// moduleAlias("./package.json")

// console.time("module-alias load module / tries = 1")
// require("@/utils/math");
// console.timeEnd("module-alias load module / tries = 1")

// console.time("module-alias load module / tries = 2")
// require("@/utils/math");
// console.timeEnd("module-alias load module / tries = 2")

// console.time("module-alias load module / tries = 3")
// require("@/utils/math");
// console.timeEnd("module-alias load module / tries = 3")

// console.time("module-alias load module / tries = 4")
// require("@/utils/math");
// console.timeEnd("module-alias load module / tries = 4")

// console.time("module-alias load module / tries = 5")
// require("@/utils/math");
// console.timeEnd("module-alias load module / tries = 5")

// console.time("module-alias load module / tries = 6")
// require("@/utils/math");
// console.timeEnd("module-alias load module / tries = 6")

// console.time("module-alias load module / tries = 7")
// require("@/utils/math");
// console.timeEnd("module-alias load module / tries = 7")

console.log(" ---- end ---- ");