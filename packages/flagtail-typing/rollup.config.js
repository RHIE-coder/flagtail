import commonjs from '@rollup/plugin-commonjs'
const input = ["src/index.js"];

export default [
    {
        input,
        plugins: [
            commonjs(),
        ],
        output: [
            {
                file: "dist/flagtail-type.js",
                format: "umd",
                name: "Typing",
            }
        ]
    },
];