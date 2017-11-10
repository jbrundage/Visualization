const postcss = require("rollup-plugin-postcss");
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
        globals: dependencies.reduce((p, v) => (p[v] = "unsupported", p), {}),
        name: "@hpcc-js/api"
    },
    plugins: [
        postcss({
            extensions: [".css"],
            extract: true
        })
    ]
};
