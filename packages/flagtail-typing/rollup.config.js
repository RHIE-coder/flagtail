import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from "@rollup/plugin-node-resolve"
const input = ["build/src/index.js"];

export default [
    {
        input,
        plugins: [
            commonjs(),
            nodeResolve(),
        ],
        output: [
            {
                file: "./dist/flagtail-type.js",
                format: "umd",
                name: "Typing",
                exports: "named",
            }
        ]
    },
];