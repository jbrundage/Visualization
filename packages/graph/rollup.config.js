import alias from 'rollup-plugin-alias';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from "rollup-plugin-postcss";
const definition = require("./package.json");
const name = definition.name.split("/").pop();
const other_libs = [];
const dependencies = Object.keys(definition.dependencies).concat(other_libs);

export default {
    input: "lib/index",
    external: dependencies,
    output: {
        file: `build/${name}.js`,
        format: "umd",
        globals: {
            "@hpcc-js/common": "@hpcc-js/common",
            "@hpcc-js/api": "@hpcc-js/api",
            "d3-drag": "@hpcc-js/common",
            "d3-selection": "@hpcc-js/common",
            "tslib": "@hpcc-js/util"
        },
        name: definition.name
    },
    plugins: [
        nodeResolve({
            preferBuiltins: true
        }),
        commonjs({
        }),
        alias({
        }),
        postcss({
            extensions: [".css"]
        })
    ]
};
