// Import des plugins Rollup nécessaires
import resolve from "@rollup/plugin-node-resolve"; // Pour résoudre les modules
import commonjs from "@rollup/plugin-commonjs"; // Pour supporter les modules CommonJS
import babel from "@rollup/plugin-babel"; // Pour transpiler le code avec Babel
import { terser } from "rollup-plugin-terser"; // Pour minifier le code

export default {
  input: "src/01-Presentation/content.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
    name: "MyExtension",
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
    }),
    terser(),
  ],
};
