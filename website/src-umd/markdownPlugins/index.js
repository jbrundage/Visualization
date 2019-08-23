(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./classMeta.js", "./publishedProperties.js", "./sample.js", "./source.js", "./sourceSample.js", "./sourceSampleTabbed.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var classMeta_js_1 = require("./classMeta.js");
    var publishedProperties_js_1 = require("./publishedProperties.js");
    var sample_js_1 = require("./sample.js");
    var source_js_1 = require("./source.js");
    var sourceSample_js_1 = require("./sourceSample.js");
    var sourceSampleTabbed_js_1 = require("./sourceSampleTabbed.js");
    function markdownWidget(infostring, text) {
        var data = [[infostring, text]];
        switch (infostring) {
            case "meta":
                return new classMeta_js_1.ClassMeta().data(data);
            case "sample":
                return new sample_js_1.Sample().data(data);
            case "sample-code-tabbed":
                return new sourceSampleTabbed_js_1.SourceSampleTabbed().data(data);
            case "sample-code-split":
            case "sample-code":
                return new sourceSample_js_1.SourceSample().data(data);
            case "javascript":
                return new source_js_1.Source("text/javascript").data(data);
        }
        if (infostring.indexOf("@hpcc-js") === 0) {
            return new publishedProperties_js_1.PublishedProperties().data(data);
        }
        return undefined;
    }
    exports.markdownWidget = markdownWidget;
});
//# sourceMappingURL=index.js.map