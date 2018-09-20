import { HTMLWidget } from "@hpcc-js/common";

export class TextInput extends HTMLWidget {
    protected _input_element;

    constructor() {
        super();
    }
    enter(domNode, element) {
        super.enter.call(this, domNode, element);
        this._input_element = element.append("input");
    }
    update(domNode, element) {
        super.update.call(this, domNode, element);
        this._input_element.attr("type", this.type());
    }
    exit(domNode, element) {
        super.exit.call(this, domNode, element);
    }
}
TextInput.prototype._class += " form_FormInput";

export interface TextInput {
    label(): string;
    label(_: string): this;
    type(): string;
    type(_: string): this;
    fontSize(): number;
    fontSize(_: number): this;
    fontFamily(): string;
    fontFamily(_: string): this;
    minHeight(): number;
    minHeight(_: number): this;
    minWidth(): number;
    minWidth(_: number): this;

}
TextInput.prototype.publish("label", "Testing", "string");
TextInput.prototype.publish("type", "text", "set", "type", ["text", "checkbox", "number"]);
TextInput.prototype.publish("fontSize", 16, "number");
TextInput.prototype.publish("fontFamily", "Arial", "string");
