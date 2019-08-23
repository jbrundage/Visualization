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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@hpcc-js/common", "marked", "prismjs", "./markdownPlugins/index.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var common_1 = require("@hpcc-js/common");
    var marked = require("marked");
    var prism = require("prismjs");
    var index_js_1 = require("./markdownPlugins/index.js");
    marked.setOptions({
        highlight: function (code, lang) {
            if (!prism.languages.hasOwnProperty(lang)) {
                // Default to markup if it's not in our extensions.
                lang = "markup";
            }
            return prism.highlight(code, prism.languages[lang], lang);
        }
    });
    var Markdown = /** @class */ (function (_super) {
        __extends(Markdown, _super);
        function Markdown() {
            var _this = _super.call(this) || this;
            _this._renderer = new marked.Renderer();
            _this._origCode = _this._renderer.code;
            _this._codeSamples = [];
            //  Heading override ---
            _this._renderer.heading = function (text, level) {
                var escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
                return "<h" + level + ">\n    <a name=\"" + escapedText + "\" class=\"anchor\" href=\"#" + escapedText + "\">\n        <span class=\"header-link\"></span>\n    </a>\n    " + text + "\n</h" + level + ">";
            };
            //  Code override ---
            _this._renderer.code = function (text, infostring, escaped) {
                var mdWidget = index_js_1.markdownWidget(infostring, text);
                if (mdWidget) {
                    return _this.renderPlaceholder(mdWidget);
                }
                return _this._origCode.call(_this._renderer, text, infostring, escaped);
            };
            return _this;
        }
        Markdown.prototype.renderPlaceholder = function (mdWidget) {
            this._codeSamples.push(mdWidget);
            return "<div id=\"placeholder" + mdWidget.id() + "\"></div>";
        };
        Markdown.prototype.enter = function (domNode, element) {
            _super.prototype.enter.call(this, domNode, element);
            element
                .style("overflow-x", "hidden")
                .style("overflow-y", "scroll")
                .style("padding", "8px");
        };
        Markdown.prototype.update = function (domNode, element) {
            _super.prototype.update.call(this, domNode, element);
            element.style("height", this.height() + "px");
            if (this._prevMarkdown !== this.markdown()) {
                this._prevMarkdown = this.markdown();
                this._codeSamples = [];
                element.html(marked(this.markdown(), { renderer: this._renderer }));
                this._codeSamples.forEach(function (cs) {
                    cs
                        .target("placeholder" + cs.id())
                        .render();
                });
            }
            else {
                this._codeSamples.forEach(function (cs) {
                    cs
                        .resize()
                        .lazyRender();
                });
            }
        };
        __decorate([
            common_1.publish("", "string")
        ], Markdown.prototype, "markdown", void 0);
        return Markdown;
    }(common_1.HTMLWidget));
    exports.Markdown = Markdown;
});
//# sourceMappingURL=markdown.js.map