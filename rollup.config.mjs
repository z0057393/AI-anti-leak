// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const plugins = [
  resolve(),
  commonjs(),
  babel({
    babelHelpers: "bundled",
    presets: ["@babel/preset-env"],
  }),
  terser(),
];

export default [
  {
    input: "src/01-Presentation/content.js",
    output: {
      file: "dist/bundle-content.js",
      format: "iife",
      name: "Content",
    },
    plugins,
  },
  {
    input: "src/01-Presentation/Popup/popup.js",
    output: {
      file: "dist/bundle-popup.js",
      format: "iife",
      name: "Popup",
    },
    plugins,
  },
];
