import { HTMLWidget, publish, Widget } from "@hpcc-js/common";
import * as marked from "marked";
import * as prism from "prismjs";
import { markdownWidget } from "./markdownPlugins/index.js";

marked.setOptions({
    highlight(code, lang) {
        if (!prism.languages.hasOwnProperty(lang)) {
            // Default to markup if it's not in our extensions.
            lang = "markup";
        }

        return prism.highlight(code, prism.languages[lang], lang);
    }
});

export class Markdown extends HTMLWidget {

    private _renderer = new marked.Renderer();
    private _origCode = this._renderer.code;
    private _codeSamples: Widget[] = [];

    @publish("", "string")
    markdown: publish<this, string>;

    constructor() {
        super();

        //  Heading override ---
        this._renderer.heading = function (text, level) {
            const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
            return `\
<h${level}>
    <a name="${escapedText}" class="anchor" href="#${escapedText}">
        <span class="header-link"></span>
    </a>
    ${text}
</h${level}>`;
        };

        //  Code override ---
        this._renderer.code = (text: string, infostring: string, escaped: boolean) => {
            const mdWidget = markdownWidget(infostring, text);
            if (mdWidget) {
                return this.renderPlaceholder(mdWidget);
            }
            return this._origCode.call(this._renderer, text, infostring, escaped);
        };
    }

    renderPlaceholder(mdWidget: Widget): string {
        this._codeSamples.push(mdWidget);
        return `<div id="placeholder${mdWidget.id()}"></div>`;
    }

    enter(domNode, element) {
        super.enter(domNode, element);
        element
            .style("overflow-x", "hidden")
            .style("overflow-y", "scroll")
            .style("padding", "8px")
            ;
    }

    private _prevMarkdown;
    update(domNode, element) {
        super.update(domNode, element);
        element.style("height", `${this.height()}px`);
        if (this._prevMarkdown !== this.markdown()) {
            this._prevMarkdown = this.markdown();
            this._codeSamples = [];
            element.html(marked(this.markdown(), { renderer: this._renderer }));
            this._codeSamples.forEach(cs => {
                cs
                    .target(`placeholder${cs.id()}`)
                    .render()
                    ;
            });
        } else {
            this._codeSamples.forEach(cs => {
                cs
                    .resize()
                    .lazyRender()
                    ;
            });
        }
    }
}
