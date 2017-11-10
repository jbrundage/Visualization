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
        globals: dependencies.reduce((p, v) => (p[v] = "d3", p), {}),
        name: "d3"
    }
};
