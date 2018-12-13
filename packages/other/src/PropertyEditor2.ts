import { HTMLWidget } from "@hpcc-js/common";
// import { local as d3Local, select as d3Select, selectAll as d3SelectAll } from "d3-selection";
// import * as Persist from "./Persist";

import "../src/PropertyEditor2.css";

export class PropertyEditor2 extends HTMLWidget {

    constructor() {
        super();

        this._tag = "div";
    }

    enter(domNode, element) {
        super.enter(domNode, element);
    }
    update(domNode, element) {
        super.update(domNode, element);
    }
}
PropertyEditor2.prototype._class += " other_PropertyEditor2";

PropertyEditor2.prototype.publish("widget", null, "widget", "Widget", null, { tags: ["Basic"], render: false });
