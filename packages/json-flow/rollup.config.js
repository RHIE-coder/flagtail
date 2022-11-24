import commonjs from '@rollup/plugin-commonjs'
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { nodeResolve } from "@rollup/plugin-node-resolve";
const input = ["src/index.js"];

export default [
    {
        input,
        plugins: [
            getBabelOutputPlugin({ presets: ['@babel/preset-env'] }),
            commonjs(),
        ],
        output: [
            {
                dir: "dist/esm",
                format: "esm",
                exports: "named",
                sourcemap: true,
            }
        ]
    },
    {
        input,
        plugins: [
            getBabelOutputPlugin({ presets: ['@babel/preset-env'] }),
            commonjs(),
        ],
        output: [
            {
                file: "dist/json-flow.js",
                format: "esm",
                exports: "named",
                sourcemap: false,
            }
        ]
    },
    {
        input,
        plugins: [nodeResolve(), commonjs()],
        output: [
            {
                dir: "dist/cjs",
                format: "cjs",
                exports: "named",
                sourcemap: true,
            },
        ],
    },
];