const postcss = require("rollup-plugin-postcss");
const definition = require("./package.json");
const name = definition.name.split("/").pop();
const other_libs = [
    "amcharts3/amcharts/amcharts",
    "amcharts3/amcharts/serial",
    "amcharts3/amcharts/funnel",
    "amcharts3/amcharts/radar",
    "amcharts3/amcharts/xy",
    "amcharts3/amcharts/gantt",
    "amcharts3/amcharts/gauge",
    "amcharts3/amcharts/pie"
];
const dependencies = Object.keys(definition.dependencies).concat(other_libs);

export default {
    input: "lib/index",
    external: dependencies,
    output: {
        file: `build/${name}.js`,
        format: "umd",
        globals: dependencies.reduce((p, v) => (p[v] = "unsupported", p), {}),
        name: `@hpcc-js/${name}`
    },
    plugins: [
        postcss({
            extensions: [".css"],
            extract: true
        })
    ]
};
