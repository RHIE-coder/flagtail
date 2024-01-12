const jam = require("flagtail-jam")

const result = jam.load({
    configType: jam.ConfigType.PACKAGE,
});


const math = require("@/utils/math");
console.log(math.add(10, 20));
console.log(result);