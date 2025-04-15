// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";

const plugins = [
  resolve(),
  commonjs(),
  babel({
    babelHelpers: "bundled",
    presets: ["@babel/preset-env"],
  }),
  terser(),
];

const copyAssets = copy({
  targets: [
    { src: "manifest.json", dest: "dist" },
    { src: "src/01-Presentation/Popup/popup.html", dest: "dist" },
  ],
  copyOnce: true,
});

export default [
  {
    input: "src/01-Presentation/content.js",
    output: {
      file: "dist/bundle-content.js",
      format: "iife",
      name: "Content",
      sourcemap: false,
    },
    plugins: [...plugins, copyAssets],
  },
  {
    input: "src/01-Presentation/Popup/popup.js",
    output: {
      file: "dist/bundle-popup.js",
      format: "iife",
      name: "Popup",
      sourcemap: false,
    },
    plugins,
  },
];
