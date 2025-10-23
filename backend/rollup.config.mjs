// rollup.config.mjs
import path from "node:path";
import { builtinModules, createRequire } from "node:module";
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

const isProd = process.env.NODE_ENV === "production";

export default {
  input: "index.ts",
  output: {
    file: "dist/server.cjs",
    format: "cjs",
    sourcemap: true,
  },
  external: [
    ...builtinModules,
    ...builtinModules.map((m) => `node:${m}`),
    ...Object.keys(pkg.dependencies || {}),
  ],
  plugins: [
    alias({ entries: [{ find: "@src", replacement: path.resolve("./src") }] }),
    nodeResolve({ preferBuiltins: true, exportConditions: ["node"] }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      compilerOptions: {
        module: "esnext",
        rootDir: ".",
        declaration: false,
      },
      include: ["**/*.ts", "**/*.tsx"],
    }),
    isProd && terser(),
  ],
};
