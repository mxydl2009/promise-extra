import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/dist.mjs",
      format: "es",
    },
    {
      file: "dist/dist.js",
      format: "commonjs",
    },
  ],
  plugins: [terser()],
};
