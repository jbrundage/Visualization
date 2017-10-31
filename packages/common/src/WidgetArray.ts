import { PropertyExt, publish } from "./PropertyExt";
import { Widget } from "./Widget";

export class WidgetArray extends PropertyExt {

    @publish(null, "widgetArray", "Widget Array")
    content: publish<this, Widget[]>;

    constructor() {
        super();
    }
}
WidgetArray.prototype._class += " common_WidgetArray";
