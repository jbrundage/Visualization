import { HTMLWidget } from "@hpcc-js/common";
import { ColorInput, Input, OnOff, Select, Slider, TextArea } from "@hpcc-js/form";
import { select as d3Select } from "d3-selection";

import "../src/InputGroup.css";

export class InputGroup extends HTMLWidget {
    protected _label_element;
    protected _content_element;
    protected _prototypes;
    protected _widgets = [];

    constructor() {
        super();
        this._prototypes = { ColorInput, Input, OnOff, Select, Slider, TextArea, InputGroup };
    }
    enter(domNode, element) {
        super.enter.call(this, domNode, element);

        domNode.parentElement.style.height = "100%";
        domNode.parentElement.style.width = "100%";

        this._label_element = element.append("span").classed("InputGroup-label", true);
        this._content_element = element.append("div").classed("InputGroup-content", true);
    }
    update(domNode, element) {
        super.update.call(this, domNode, element);
        const context = this;
        const items = this._content_element.selectAll(".InputGroup-item").data(this.data(), d => JSON.stringify(d));
        items
            .enter()
            .append("div").classed("InputGroup-item", true)
            .each(function (d) {
                const _item_element = d3Select(this);
                const _item_label_element = _item_element.append("div").classed("InputGroup-item-label", true);
                const _item_content_element = _item_element.append("div").classed("InputGroup-item-content", true);
                _item_label_element.text(d[0]);
                console.log("d[1]", d[1]);
                const _widget = new context._prototypes[d[1]]().target(_item_content_element.node());
                if (d[2]) {
                    Object.keys(d[2]).forEach(param_name => {
                        _widget[param_name](d[2][param_name]);
                    });
                }
                const _change = _widget.change;
                _widget.change = function () {
                    context.change.apply(_widget, arguments);
                    _change.apply(_widget, arguments);
                };
                _widget.render();
            })
            .merge(items)
            .attr("opacity", 1)
            ;
    }
    exit(domNode, element) {
        super.exit.call(this, domNode, element);
    }
    change() {
        console.log(this.id());
    }
}
InputGroup.prototype._class += " form_InputGroup";

export interface InputGroup {
    label(): string;
    label(_: string): this;
    fontSize(): number;
    fontSize(_: number): this;
    fontFamily(): string;
    fontFamily(_: string): this;
    widgets(): any;
    widgets(_: any): this;

}
InputGroup.prototype.publish("label", "Testing", "string");
InputGroup.prototype.publish("fontSize", 16, "number");
InputGroup.prototype.publish("fontFamily", "Arial", "string");
InputGroup.prototype.publish("widgets", [], "widgetArray");
