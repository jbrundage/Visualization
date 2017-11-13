import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
const definition = require("./package.json");
const name = definition.name.split("/").pop();

export default {
    input: "lib/index",
    output: {
        extend: true,
        file: `build/${name}.js`,
        format: "umd",
        name: definition.name
    },
    plugins: [
        nodeResolve({
        }),
        commonjs({
        })
    ]
};
