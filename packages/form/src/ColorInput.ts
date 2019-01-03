import { IInput } from "@hpcc-js/api";
import { HTMLWidget } from "@hpcc-js/common";
import { color as d3Color } from "d3-color";

import "../src/Input.css";

export class ColorInput extends HTMLWidget {
    _inputElement = [];

    constructor() {
        super();
        IInput.call(this);

        this._tag = "div";
    }

    enter(domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);

        const context = this;

        this._inputElement[0] = element.append("input").attr("type", "text");
        this._inputElement[0].classed("color-text", true);
        this._inputElement[1] = element.append("input").attr("type", "color");
        this._inputElement[0].classed("color-input", true);

        this._inputElement.forEach(function (e, idx) {
            e.on("click", function (w) {
                w.click(w);
            });
            e.on("blur", function (w) {
                w.blur(w);
            });
            e.on("change", function (w) {
                if (idx === 0) {
                    context._inputElement[1].property("value", d3Color(context._inputElement[0].property("value")).hex());
                    context.value(context._inputElement[0].property("value"));
                } else {
                    context._inputElement[0].property("value", context._inputElement[1].property("value"));
                    context.value(d3Color(context._inputElement[1].property("value")).hex());
                }
                w.change(w, true);
            });
        });
    }

    update(domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);

        const context = this;
        this._inputElement.forEach(function (e) {
            e.attr("name", context.name());
        });
        this._inputElement[0].attr("type", "text");
        this._inputElement[1].attr("type", "color");
        this._inputElement[0].style("width", this.textWidth() + "px");
        this._inputElement[1].style("width", this.colorWidth() + "px");
        this._inputElement[0].property("value", this.value());
        this._inputElement[1].property("value", d3Color(this.value()).hex());

        const bbox = this._inputElement[0].node().getBoundingClientRect();
        this._inputElement[1].style("position", "relative");
        this._inputElement[1].style("top", "-1px");
        this._inputElement[1].style("height", (bbox.height - 4) + "px");

    }

    //  IInput  ---
    name: { (): string; (_: string): ColorInput };
    name_exists: () => boolean;
    label: { (): string; (_: string): ColorInput };
    label_exists: () => boolean;
    value: { (): any; (_: any): ColorInput };
    value_exists: () => boolean;
    validate: { (): string; (_: string): ColorInput };
    validate_exists: () => boolean;
}
ColorInput.prototype._class += " form_ColorInput";
ColorInput.prototype.implements(IInput.prototype);

export interface ColorInput {
    textWidth(): number;
    textWidth(_: number): this;
    colorWidth(): number;
    colorWidth(_: number): this;
}
ColorInput.prototype.publish("textWidth", 60, "number", "Width of text input (pixels)");
ColorInput.prototype.publish("colorWidth", 60, "number", "Width of color input (pixels)");
