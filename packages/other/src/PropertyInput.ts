import { Widget } from "@hpcc-js/common";
import { Input } from "@hpcc-js/form";

export class PropertyInput extends Widget {
    _types;
    constructor() {
        super();
        this._types = {
            "number"() {
                return new Input();
            },
            "boolean"() {
                return new Input();
            },
            "string"() {
                return new Input();
            },
            "set"() {
                return new Input();
            },
            "array"() {
                return new Input();
            },
            "object"() {
                return new Input();
            },
            "widget"() {
                return new Input();
            },
            "widgetArray"() {
                return new Input();
            },
            "propertyArray"() {
                return new Input();
            },
            "html-color"() {
                return new Input();
            },
            "proxy"() {
                return new Input();
            }
        };
    }
    enter(domNode, element) {
        super.enter(domNode, element);
    }
    update(domNode, element) {
        super.update(domNode, element);

    }
    exit(domNode, element) {
        // super.exit(domNode, element);

    }
}
PropertyInput.prototype._class += " other_PropertyInput";
