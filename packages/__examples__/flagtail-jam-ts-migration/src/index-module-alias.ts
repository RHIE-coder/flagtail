import moduleAlias from "module-alias"

moduleAlias(process.cwd()+"/package.json");

import {add} from "@/utils/math";

console.log(add(10, 20));
