import * as jam from "flagtail-jam";

const conf:typeof jam.ConfigType = jam.ConfigType;

const result:jam.JamSettingResult = jam.load({
    configType: conf.TSCONFIG,
}) 

console.log(result);

import {add} from "@/utils/math";

console.log(add(10, 20));