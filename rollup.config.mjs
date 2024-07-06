import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { bannerInfo } from "./banner.cjs";
import babel from "@rollup/plugin-babel";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/dist.mjs",
      format: "es",
      banner: bannerInfo,
    },
    {
      file: "dist/dist.cjs",
      format: "commonjs",
      banner: bannerInfo,
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelrc: false,
      babelHelpers: "runtime",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "node 14.0",
            modules: false,
          },
        ],
      ],
      exclude: "node_modules/**",
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            corejs: 3,
          },
        ],
      ],
    }),
    terser(),
  ],
};
