import commonjs from '@rollup/plugin-commonjs'
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';
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
    // ESM and CJS
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


// export default {
//     input: './src/index.js',
//     output: [
//         {
//             file: './build/bundle.cjs.js',
//             format: 'cjs',
//         }
//     ],
//     plugins: [
//         getBabelOutputPlugin({ presets: ['@babel/preset-env'] }),
//         // commonjs(),
//     ]
// }

// export default [
//     {
//         input: './src/index.js',
//         output: {
//             dir: './build/cjs',
//             format: 'cjs',
//             sourcemap: true,
//         },
//         plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })]
//     },
//     {
//         input: './src/index.js',
//         output: {
//             dir: './build',
//             file: 'bundle.es.js',
//             format: 'es',
//             sourcemap: true,
//         },
//         plugins: [
//             commonjs(),
//             babel({ babelHelpers: 'bundled' })
//         ],

//     }   
// ]

// {
//     input: 'src/index.js',
//     output: [
//         {
//             dir: './build/cjs',
//             format: 'cjs',
//             sourcemap: true,
//         },
//         {
//             dir: './build',
//             format: 'esm',
//             sourcemap: true,
//         },
//     ],
//     plugins: [commonjs()],
// };