var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@hpcc-js/common", "marked"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@hpcc-js/common");
    var marked = require("marked");
    var ClassMeta = /** @class */ (function (_super) {
        __extends(ClassMeta, _super);
        function ClassMeta() {
            return _super.call(this) || this;
        }
        ClassMeta.prototype.infostring = function () {
            return this.data()[0][0];
        };
        ClassMeta.prototype.text = function () {
            return this.data()[0][1];
        };
        ClassMeta.prototype.update = function (domNode, element) {
            _super.prototype.update.call(this, domNode, element);
            var json = JSON.parse(this.text());
            var md = [];
            if (json.source) {
                md.push("[source](" + json.source + ")");
            }
            element.html(marked(md.join("\n")));
        };
        return ClassMeta;
    }(common_1.HTMLWidget));
    exports.ClassMeta = ClassMeta;
});
//# sourceMappingURL=classMeta.js.map