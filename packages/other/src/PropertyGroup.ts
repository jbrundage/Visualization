import { HTMLWidget } from "@hpcc-js/common";
import { local as d3Local, select as d3Select, selectAll as d3SelectAll } from "d3-selection";
// import * as Persist from "./Persist";

import "../src/PropertyGroup.css";

export class PropertyGroup extends HTMLWidget {

    _prevContainerMode;
    _containerElement;
    constructor() {
        super();

        this._tag = "div";
    }

    enter(domNode, element) {
        super.enter(domNode, element);
    }
    update(domNode, element) {
        super.update(domNode, element);
        let selection;
        const rowClass = `${this.id()}-data-row`;
        const wrapperClass = `${this.id()}-data-wrapper`;
        switch (this.containerMode()) {
            case "table":
                if (this._prevContainerMode !== this.containerMode()) {
                    this.element().html("");
                    this.element()
                        .append("table")
                        .append("tbody")
                        .classed(wrapperClass, true)
                        ;
                }
                selection = this.element()
                    .select(`.${wrapperClass}`)
                    .selectAll(`.${rowClass}`)
                    .data(this.widgets(), w => w.id())
                    ;
                selection.enter()
                    .append("tr")
                    .classed(rowClass, true)
                    ;
                return selection;
            case "fieldset":
                if (this._prevContainerMode !== this.containerMode()) {
                    this.element().html("");
                    this.element()
                        .append("fieldset")
                        .classed(wrapperClass, true)
                        ;
                }
                selection = this.element()
                    .select(`.${wrapperClass}`)
                    .selectAll(`.${rowClass}`)
                    .data(this.widgets(), w => w.id())
                    ;
                const enterSelection = selection.enter()
                    .append("fieldset")
                    .classed(rowClass, true)
                    ;
                enterSelection
                    .append("legend")
                    .text("Test")
                    ;
                enterSelection
                    .append("div")
                    .each(function() {

                    })
                    ;
                return selection;

        }

        this._prevContainerMode = this.containerMode();
    }
}
PropertyGroup.prototype._class += " other_PropertyGroup";

export interface PropertyGroup {
    widgets(): any;
    widgets(_: any): this;
    containerMode(): string;
    containerMode(_: string): this;
}

PropertyGroup.prototype.publish("widgets", null, "widgetArray", "Input widget array", null, { tags: ["Basic"], render: false });

PropertyGroup.prototype.publish("containerMode", "table", "set", "Strategy for laying out the elements", ["table", "fieldset"]);
