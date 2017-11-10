import sourcemaps from "rollup-plugin-sourcemaps";
import postcss from "rollup-plugin-postcss";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from "rollup-plugin-commonjs";
const definition = require("./package.json");
const name = definition.name.split("/").pop();

export default {
    input: "lib/index",
    output: {
        file: `build/${name}.js`,
        format: "umd",
        name: `@hpcc-js/${name}`
    },
    external: [],
    sourceMap: true,
    plugins: [
        resolve(),
        commonjs(),
        sourcemaps(),
        postcss({
            extensions: [".css"],
            extract: true
        })
    ]
};
