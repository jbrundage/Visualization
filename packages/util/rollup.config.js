const definition = require("./package.json");
const name = definition.name.split("/").pop();
const dependencies = Object.keys(definition.dependencies);

export default {
    input: "lib/index",
    external: dependencies,
    output: {
        extend: true,
        file: `build/${name}.js`,
        format: "umd",
        globals: dependencies.reduce((p, v) => (p[v] = "d3", p), {}),
        name: "d3"
    }
};
