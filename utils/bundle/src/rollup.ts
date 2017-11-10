import { bundle } from "./bundle";
import * as rollup from "rollup";
import { inOptions, outOptions } from "./bundle";
import * as program from "commander";

program.version("0.0.1")
    .option("-w, --watch", "Watch")
    .option("-i, --input <path>", "Input, defaults to ./lib-es6/index.js")
    .parse(process.argv);

program.input = program.input || "./lib-es6/index.js"

console.log(`Bundling:  ${program.input}`);

if (program.watch) {
    const watchOptions = {
        ...inOptions(program.input, false),
        output: outOptions(false)
    };
    const watcher = rollup.watch(watchOptions);

    watcher.on("event", event => {
        console.log(event.code);
    });
} else {
    Promise.all([
        bundle(program.input),
        bundle(program.input, true)
    ]).catch(console.log);
}
