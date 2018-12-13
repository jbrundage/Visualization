import { Input } from "@hpcc-js/form";

export class PropertyInput {
    constructor() {
        super();
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

export interface PropertyInput {
    padding(): number;
    padding(_: number): this;
}
PropertyInput.prototype.publish("padding", 8, "number", "padding");
