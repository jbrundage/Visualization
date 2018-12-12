import { HTMLWidget, Platform, PropertyExt, Widget } from "@hpcc-js/common";
import { FlexGrid } from "@hpcc-js/layout";
import { local as d3Local, select as d3Select, selectAll as d3SelectAll } from "d3-selection";
import * as Persist from "./Persist";
import { PropertyGroup } from "./PropertyGroup";
import { PropertyInput } from "./PropertyInput";

import "../src/PropertyEditor2.css";

export class PropertyEditor2 extends HTMLWidget {
    _widgetOrig;
    _parentPropertyEditor2;
    _show_settings: boolean;
    _selectedItems;
    __meta_sorting;
    _watch;
    private _childPE = d3Local<PropertyEditor2>();

    constructor() {
        super();
        this._parentPropertyEditor2 = null;

        this._tag = "div";
        this._show_settings = false;
        // const methods = Object.getOwnPropertyNames(this.__proto__).filter(n => {
        //     return n !== "constructor" && typeof this[n] === "function";
        // });
        // console.log("methods", methods);
        // methods.forEach((n) => {
        //     const orig = this[n];
        //     this[n] = function () {
        //         console.group(`start ${n}`);
        //         const ret = orig.apply(this, arguments);
        //         console.groupEnd();
        //         return ret;
        //     };
        // });
    }

    enter(domNode, element) {
        super.enter(domNode, element);
        element
            .style("height", "100%")
            .style("width", "100%")
            .style("overflow-y", "scroll")
            ;
    }
    update(domNode, element) {
        super.update(domNode, element);

        const w = this.widget();
        if (!w) return;

        const groupMap = this.propertyGroupMap();
        let groups = Object.keys(groupMap);

        const properties = w.publishedProperties(true, true);
        groups = groups.filter(key => {
            const groupProps = properties.filter(property => {
                return groupMap[key](property);
            });
            return groupProps.length;
        });
        const groupDivs = element.selectAll(`#${this.id()} > .pe-widget-div`)
            .data(groups)
            ;
        const context = this;
        groupDivs.enter()
            .append("div")
            .classed("pe-widget-div", true)
            .each(function (groupName) {
                console.log("arguments", arguments);
                const div = d3Select(this).append("div")
                    .classed("pe-property-group", true)
                    .style("height", "100%")
                    .style("width", "100%")
                    ;
                new PropertyGroup()
                    .target(div.node())
                    .widgets(
                        properties.filter(property => {
                            return groupMap[groupName](property);
                        }).map(property => {
                            return new PropertyInput()
                                .label(property.id)
                                .widget(w)
                                .property(property)
                                .change((inputWidget) => {
                                    w[property.id](inputWidget.value())
                                        .render(_ => {
                                            context.render();
                                        })
                                        ;
                                })
                                ;
                        })
                    )
                    .render()
                    ;
            })
            .merge(groupDivs)
            .each(function () {

            })
            ;
    }

    exit(domNode, element) {
        super.exit(domNode, element);
    }
}
PropertyEditor2.prototype._class += " other_PropertyEditor2";

export interface PropertyEditor2 {
    widget(): any;
    widget(_: any): this;
    propertyGroupMap(): string;
    propertyGroupMap(_: string): this;
}
const groupMap = {
    boolean(property) {
        return property.type === "boolean";
    },
    colors(property) {
        return property.type === "html-color";
    },
    numbers(property) {
        return property.type === "number";
    },
    all(property) {
        return true;
    }
};
PropertyEditor2.prototype.publish("widget", null, "widget", "Widget", null, { tags: ["Basic"], render: false });
PropertyEditor2.prototype.publish("propertyGroupMap", groupMap, "object", "Contains logic for mapping property to group");
