import * as jam from "flagtail-jam";

const result:jam.JamSettingResult = jam.load({
    rootPath: process.cwd(),
    configType: jam.ConfigType.TSCONFIG,
}) 

console.log(result);

import {add} from "@/utils/math";

console.log(add(10, 20));

import Module from 'module';

console.log(Module)