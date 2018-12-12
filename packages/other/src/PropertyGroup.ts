import { HTMLWidget, Platform, PropertyExt, Widget } from "@hpcc-js/common";
import { Input, Select } from "@hpcc-js/form";
import { FlexGrid } from "@hpcc-js/layout";
import { local as d3Local, select as d3Select, selectAll as d3SelectAll } from "d3-selection";
import * as Persist from "./Persist";

import "../src/PropertyGroup.css";

export class PropertyGroup extends HTMLWidget {

    constructor() {
        super();

        this._tag = "div";
    }

    enter(domNode, element) {
        super.enter(domNode, element);

    }
    update(domNode, element) {
        super.update(domNode, element);
        this.widgets().forEach(w => {
            if (!w.target()) {
                w.target(domNode);
            }
        });
    }

    exit(domNode, element) {
        super.exit(domNode, element);
    }
}
PropertyGroup.prototype._class += " other_PropertyGroup";

export interface PropertyGroup {
    widgets(): any;
    widgets(_: any): this;
}

PropertyGroup.prototype.publish("widgets", [], "widgetArray");
