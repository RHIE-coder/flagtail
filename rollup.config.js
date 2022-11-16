import commonjs from '@rollup/plugin-commonjs'
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';

export default {
    input: './src/index.js',
    output: [
        {
            file: './build/bundle.es5.js',
            format: 'es',
        }
    ],
    plugins: [
        commonjs(),
        getBabelOutputPlugin({ presets: ['@babel/preset-env'] }),
    ]
}

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