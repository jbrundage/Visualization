import { HTMLWidget } from "@hpcc-js/common";
import { local as d3Local, select as d3Select, selectAll as d3SelectAll } from "d3-selection";
// import * as Persist from "./Persist";

import { Modal } from "../../layout/types";
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
        this.element()
            .append("fieldset")
            .classed(`${this.id()}-list-wrapper`, true)
            .append("legend")
            ;
    }
    update(domNode, element) {
        super.update(domNode, element);
        let selection;
        const context = this;
        const rowClass = `${this.id()}-data-row`;
        const labelClass = `${this.id()}-data-label`;
        const wrapperClass = `${this.id()}-list-wrapper`;
        const rowWrapperClass = `${this.id()}-row-wrapper`;
        const wrapperElement = this.element().select("." + wrapperClass);
        wrapperElement
            .classed("parent-collapser", true)
            .classed("flat-wrapper", this.flatWrapper())
            .select("legend")
            .text(this.label())
            ;
        switch (this.containerMode()) {
            case "table":
                let table = wrapperElement.select("table");
                if (this._prevContainerMode !== this.containerMode()) {
                    wrapperElement.html("");
                    wrapperElement.append("legend")
                        .classed("collapser", true)
                        .classed(labelClass, true)
                        .text(this.label())
                        ;
                    table = wrapperElement
                        .append("table")
                        ;
                    table.append("tbody")
                        .classed(rowWrapperClass, true)
                        ;
                }
                selection = wrapperElement
                    .select(`.${rowWrapperClass}`)
                    .selectAll(`.${rowClass}`)
                    .data(this.widgets(), w => w.id())
                    ;
                const enterSelection = selection.enter()
                    .append("tr")
                    .classed(rowClass, true)
                    ;
                enterSelection.append("th")
                    .classed("property-label", true)
                    .style("display", this.disableLabels() ? "none" : null)
                    ;
                enterSelection.append("td");
                enterSelection
                    .merge(selection)
                    .each(function(d) {
                        this.children[0].style.width = context.labelWidth() + "px";
                        this.children[1].style.width = "auto";
                        this.children[0].innerText = d.label();
                        if (!d.target()) {
                            d.target(this.children[1]);
                        }
                        d.render();
                    })
                    ;
                break;
            case "fieldset":
                if (this._prevContainerMode !== this.containerMode()) {
                    wrapperElement.html("");
                    wrapperElement.append("legend")
                        .classed(labelClass, true)
                        .text(this.label())
                        ;
                }
                selection = wrapperElement
                    .selectAll(`.${rowClass}`)
                    .data(this.widgets(), w => w.id())
                    ;
                const enterSelection2 = selection.enter()
                    .append("fieldset")
                    .classed(rowClass, true)
                    .classed("self-collapser", this.collapsibleProperties())
                    ;
                const legend = enterSelection2
                    .append("legend")
                    .text(d => d.label())
                    .style("display", this.disableLabels() ? "none" : null)
                    .on("click", function() {
                        const m = new Modal().;
                    })
                    ;
                if (this.collapsibleProperties()) {
                    legend
                        .on("click", function() {
                            const elm = d3Select(this.parentNode);
                            elm.classed("collapsed", !elm.classed("collapsed"));
                        })
                        ;
                }
                enterSelection2
                    .merge(selection)
                    .each(function(d) {
                        if (!d.target()) {
                            d.target(this);
                        }
                        d.render();
                    })
                    ;
                break;
        }
        this.element()
            .select(`.${labelClass}`)
            .text(this.label())
            .classed("collapser", true)
            ;
        this._prevContainerMode = this.containerMode();
    }
}
PropertyGroup.prototype._class += " other_PropertyGroup";

export interface PropertyGroup {
    widgets(): any;
    widgets(_: any): this;
    containerMode(): string;
    containerMode(_: string): this;
    label(): string;
    label(_: string): this;
    labelWidth(): number;
    labelWidth(_: number): this;
    collapsibleProperties(): boolean;
    collapsibleProperties(_: boolean): this;
    flatWrapper(): boolean;
    flatWrapper(_: boolean): this;
    collapsed(): boolean;
    collapsed(_: boolean): this;
    disableLabels(): boolean;
    disableLabels(_: boolean): this;

}

PropertyGroup.prototype.publish("disableLabels", false, "boolean");
PropertyGroup.prototype.publish("collapsed", true, "boolean");
PropertyGroup.prototype.publish("flatWrapper", false, "boolean", "If true, the wrapping element will have no label, padding or margin.");
PropertyGroup.prototype.publish("label", "", "string", "Label for this group of inputs");
PropertyGroup.prototype.publish("labelWidth", 30, "number", "Width of property labels in this group (pixels)");
PropertyGroup.prototype.publish("widgets", [], "widgetArray", "Input widget array", null, { tags: ["Basic"], render: false });
PropertyGroup.prototype.publish("containerMode", "table", "set", "Strategy for laying out the elements", ["table", "fieldset"]);
PropertyGroup.prototype.publish("collapsibleProperties", false, "boolean", "If true, individual properties can be collapsed");
