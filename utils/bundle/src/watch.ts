import * as rollup from "rollup";
import { inOptions, outOptions } from "./bundle";

const watchOptions = {
    ...inOptions(false),
    output: outOptions(false)
};
const watcher = rollup.watch(watchOptions);

watcher.on("event", event => {
    console.log(event.code);
});
