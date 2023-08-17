import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from '@rollup/plugin-terser';
// import typescript from "@rollup/plugin-typescript";
const input = ["build/src/index.js"];

export default [
    {
        input,
        plugins: [
            commonjs(),
            nodeResolve(),
            terser({
                compress: {
                    // 원하는 프로퍼티를 제거하는 설정 예시
                    // 예를 들어, 모듈에서 'defaultProperty' 프로퍼티를 제거하고 싶을 때
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    drop_console: true,
                    global_defs: {
                        // 'defaultProperty' 프로퍼티 사용을 제거
                        defaultProperty: undefined
                    }
                }
            })
            // typescript(),
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