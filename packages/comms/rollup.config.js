import alias from 'rollup-plugin-alias';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
const definition = require("./package.json");
const name = definition.name.split("/").pop();
const node_libs = ["child_process", "fs", "os", "path", "semver"];
const dependencies = Object.keys(definition.dependencies).concat(node_libs);

export default {
    input: "lib/index.browser",
    external: dependencies,
    output: {
        extend: true,
        file: `build/${name}.js`,
        format: "umd",
        globals: {
            "@hpcc-js/util": "@hpcc-js/util",
            "tslib": "tslib"
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
            "tslib": "./node_modules/@hpcc-js/util/build/util"
        }),
    ]
};
