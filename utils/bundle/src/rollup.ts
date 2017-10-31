import { bundle } from "./bundle";

Promise.all([
    bundle(),
    bundle(true)
]).catch(console.log);
