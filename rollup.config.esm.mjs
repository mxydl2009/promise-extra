// 压缩代码，删除注释
import terser from "@rollup/plugin-terser";
// 解析第三方模块
import { nodeResolve } from "@rollup/plugin-node-resolve";
// 解析CommonJS规范的代码
import commonjs from "@rollup/plugin-commonjs";
// 模块banner信息
import { bannerInfo } from "./banner.cjs";
// babel插件，转译代码
import babel from "@rollup/plugin-babel";

export default {
  input: "src/index.js",
  output: {
    file: "dist/dist.mjs",
    format: "es",
    banner: bannerInfo,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelrc: false,
      // build library with rollup, use runtime option
      babelHelpers: "runtime",
      exclude: "node_modules/**",
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            corejs: 3,
          },
        ],
      ],
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "> 0.25%, not dead",
            // 不转换ESM
            modules: false,
          },
        ],
      ],
    }),
    terser(),
  ],
};