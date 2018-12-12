import { HTMLWidget, Platform, PropertyExt, Widget } from "@hpcc-js/common";
import { Input, Select } from "@hpcc-js/form";
import { FlexGrid } from "@hpcc-js/layout";
import { local as d3Local, select as d3Select, selectAll as d3SelectAll } from "d3-selection";
import { PropertyEditor2 } from "./PropertyEditor2";

import "../src/PropertyInput.css";

export class PropertyInput extends HTMLWidget {
    _change;
    _labelElement;
    _prevType;
    _inputWidget;
    constructor() {
        super();

        this._tag = "div";
    }

    change(callback) {
        this._change = callback;
        return this;
    }

    enter(domNode, element) {
        super.update(domNode, element);
        this._labelElement = element.append("span")
            .text(this.label())
            ;
        const type = this.property().type;
        const propMap = this.propertyMap();
        if (typeof propMap[type] !== "undefined") {
            this._inputWidget = propMap[type](this.widget(), this.property());
            if (typeof this._change === "function") {
                this._inputWidget.change = this._change;
            }
            this._inputWidget
                .target(domNode)
                .render()
                ;
        } else {
            console.error(`PropertyInput.propertyMap() doesn't have an entry for '${type}'`);
        }

    }
    update(domNode, element) {
        super.update(domNode, element);
        this._labelElement.text(this.label());
        this._labelElement = element.append("span")
            .text(this.label())
            ;
        const type = this.property().type;
        const propMap = this.propertyMap();
        if (this._prevType !== type) {
            this._prevType = type;
        } else if (typeof propMap[type] !== "undefined") {
            this._inputWidget = propMap[type](this.widget(), this.property());
            if (typeof this._change === "function") {
                this._inputWidget.change = this._change;
            }
            this._inputWidget
                .target(domNode)
                .render()
                ;
        } else {
            console.error(`PropertyInput.propertyMap() doesn't have an entry for '${type}'`);
        }
    }

    exit(domNode, element) {
        super.exit(domNode, element);
    }
}
PropertyInput.prototype._class += " other_PropertyInput";

export interface PropertyInput {
    propertyMap(): any;
    propertyMap(_: any): this;
    label(): string;
    label(_: string): this;
    property(): any;
    property(_: any): this;
    widget(): any;
    widget(_: any): this;
}

const typeObj = {
    "set"(widget, property, inputWidget?) {
        inputWidget = (inputWidget || new Select());
        return inputWidget
            .selectOptions(property.set)
            .value(widget[property.id]())
            ;
    },
    "html-color"(widget, property, inputWidget?) {
        inputWidget = (inputWidget || new Input());
        return inputWidget
            .value(widget[property.id]())
            ;
    },
    "boolean"(widget, property, inputWidget?) {
        inputWidget = (inputWidget || new Input());
        return inputWidget
            .value(widget[property.id]())
            ;
    },
    "number"(widget, property, inputWidget?) {
        inputWidget = (inputWidget || new Input());
        return inputWidget
            .value(widget[property.id]())
            ;
    },
    "string"(widget, property, inputWidget?) {
        inputWidget = (inputWidget || new Input());
        return inputWidget
            .value(widget[property.id]())
            ;
    },
    "array"(widget, property, inputWidget?) {
        inputWidget = (inputWidget || new Input());
        return inputWidget
            .value(widget[property.id]())
            ;
    },
    "object"(widget, property, inputWidget?) {
        inputWidget = (inputWidget || new Input());
        return inputWidget
            .value(widget[property.id]())
            ;
    },
    "widget"(widget, property, inputWidget?) {
        inputWidget = (inputWidget || new PropertyEditor2());
        const pe = inputWidget.widget(widget[property.id]());
        pe.value = function () {
            return this;
        };
        return pe;
    },
    "widgetArray"(widget, property, inputWidget?) {
        inputWidget = (inputWidget || new PropertyEditor2());
        const pe = inputWidget.widget(widget[property.id]()[0]);
        pe.value = function () {
            return this;
        };
        return pe;
    },
    "propertyArray"(widget, property, inputWidget?) {
        return new Input()
            .value(widget[property.id]())
            ;
    }
};

PropertyInput.prototype.publish("label", "", "string", "Label of the input");
PropertyInput.prototype.publish("propertyMap", typeObj, "object", "Maps property type to instantiated");

PropertyInput.prototype.publish("property", null, "object", "Property object via publishedProperties(true,true)");
PropertyInput.prototype.publish("widget", null, "widget", "Widget that the property belongs to");
PropertyInput.prototype.publish("inputWidget", null, "widget", "Input widget providing an interface for property manipulation");
