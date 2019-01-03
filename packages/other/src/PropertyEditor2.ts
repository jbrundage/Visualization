import { JSONEditor } from "@hpcc-js/codemirror";
import { HTMLWidget, Palette } from "@hpcc-js/common";
import { ColorInput, Input, OnOff, Select } from "@hpcc-js/form";
import { Modal } from "@hpcc-js/layout";
import { select as d3Select } from "d3-selection";
import { PropertyGroup } from "./PropertyGroup";
// import { local as d3Local, select as d3Select, selectAll as d3SelectAll } from "d3-selection";
// import * as Persist from "./Persist";

import "../src/PropertyEditor2.css";

export class PropertyEditor2 extends HTMLWidget {

    _propertyTypes;
    _groupFilters;
    _groupOptions;
    _maxLabelWidth = 0;
    _cache = {};
    _peCache = {};
    _groupCache = {};
    constructor() {
        super();

        this._tag = "div";
        this._propertyTypes = {
            "number"(prop, propWidget?) {
                return (propWidget || new Input())
                    .label(prop.id)
                    .type(prop.type)
                    .value(this.widget()[prop.id]())
                    ;
            },
            "boolean"(prop, propWidget?) {
                return (propWidget || new OnOff())
                    .label(prop.id)
                    .onText("ON")
                    .offText("OFF")
                    .switchRadius(0)
                    .containerRadius(0)
                    .minWidth(60)
                    .value(this.widget()[prop.id]())
                    ;
            },
            "string"(prop, propWidget?) {
                return (propWidget || new Input())
                    .label(prop.id)
                    .type(prop.type)
                    .value(this.widget()[prop.id]())
                    .width(120)
                    ;
            },
            "set"(prop, propWidget?) {
                return (propWidget || new Select())
                    .label(prop.id)
                    .insertSelectOptions(prop.set)
                    .value(this.widget()[prop.id]())
                    ;
            },
            "array"(prop, propWidget?) {
                return (propWidget || new JSONEditor())
                    .label(prop.id)
                    .value(this.widget()[prop.id]())
                    ;
            },
            "object"(prop, propWidget?) {
                const val = this.widget()[prop.id]();
                const lineHeight = 20;
                let widgetHeight = lineHeight * 3;
                try {
                    const linebreaks = JSON.stringify(val, null, "\t").split("\n").length;
                    widgetHeight = linebreaks > 3 ? lineHeight * linebreaks : widgetHeight;
                } catch (e) {
                    console.error(e);
                }
                return (propWidget || new JSONEditor())
                    .label(prop.id)
                    .json(val)
                    .height(widgetHeight)
                    ;
            },
            "widget"(prop, propWidget?) {
                return (propWidget || new PropertyEditor2())
                    .label(prop.id)
                    .absolutePositioning(false)
                    .widget(this.widget()[prop.id]())
                    ;
            },
            "widgetArray"(prop, propWidget?) {
                const pg = (propWidget || new PropertyGroup());
                if (!this._peCache[pg.id()])this._peCache[pg.id()] = [];
                return pg
                    .label(prop.id)
                    .flatWrapper(true)
                    .widgets(
                        this.widget()[prop.id]().map((w, i) => {
                            if (propWidget && this._peCache[propWidget.id()][i]) {
                                return this._peCache[propWidget.id()][i];
                            } else {
                                const pe = new PropertyEditor2()
                                    .label(w.id())
                                    .disableGrouping(true)
                                    .absolutePositioning(false)
                                    .widget(w)
                                    ;
                                this._peCache[pg.id()][i] = pe;
                                return pe;
                            }
                        })
                    )
                    ;
            },
            "propertyArray"(prop, propWidget?) {
                const pg = (propWidget || new PropertyGroup());
                if (!this._peCache[pg.id()])this._peCache[pg.id()] = [];
                return pg
                    .label(prop.id)
                    .flatWrapper(true)
                    .widgets(
                        this.widget()[prop.id]().map((w, i) => {
                            if (propWidget && this._peCache[propWidget.id()][i]) {
                                return this._peCache[propWidget.id()][i];
                            } else {
                                const pe = new PropertyEditor2()
                                    .label(i)
                                    .disableGrouping(true)
                                    .disableLabels(true)
                                    .absolutePositioning(false)
                                    .widget(w)
                                    ;
                                this._peCache[pg.id()][i] = pe;
                                return pe;
                            }
                        })
                    )
                    ;
            },
            "html-color"(prop, propWidget?) {
                return (propWidget || new ColorInput())
                    .label(prop.id)
                    .value(this.widget()[prop.id]())
                    ;
            }
        };
        this._groupFilters = {
            // "Misc" is the default group if none of the others are a match for a given property
            "Axis"(prop) {
                return prop.id.toLowerCase().indexOf("axis") !== -1;
            },
            "Property Arrays"(prop) {
                return prop.type === "propertyArray";
            },
            "Widgets"(prop) {
                return prop.type === "widget" || prop.type === "widgetArray";
            },
            "Font & Color"(prop) {
                return prop.type === "html-color"
                    || prop.id.toLowerCase().indexOf("font") !== -1
                    || prop.id.toLowerCase().indexOf("color") !== -1
                    || prop.id.toLowerCase().indexOf("palette") !== -1
                    ;
            },
            "Tooltip"(prop) {
                return prop.id.toLowerCase().indexOf("tooltip") !== -1;
            }
        };
        this._groupOptions = {
            "Widgets"(propGroup) {
                return propGroup
                    .collapsibleProperties(true)
                    ;
            },
            "Property Arrays"(propGroup) {
                return propGroup
                    .disableLabels(true)
                    ;
            }
        };
    }

    enter(domNode, element) {
        super.enter(domNode, element);
    }
    labelWidthCalc(property) {
        const labelWidth = this.textSize(property.id, "Verdana", 12, true).width;
        if (labelWidth > this._maxLabelWidth) {
            this._maxLabelWidth = labelWidth;
        }
    }
    update(domNode, element) {
        super.update(domNode, element);
        if (this.widget() === null)return;
        const context = this;
        // GOAL: Make sure every property is accurately reflecting its latest settings
        // Solution:
        //     Step 1: Add cached instances of new IInput widgets
        //     Step 2: Update each IInput widget with its latest settings
        //     Step 3: Set change event listeners
        //     Step 4: Test for ext exceptions (ex: property.ext.disable(widget))
        //     Step 5: Assign each data row to a PropertyGroup
        //     Step 6: Set group options
        //     Step 7: Render
        //     Step 8: Placement

        this._cache = // Step 1
            this.widget().publishedProperties(true, true).reduce((ret, property) => {
            const propertyWidget = this.getPropertyWidget(property, this._cache[property.id]); // Step 2
            this.setChangeListener(property, propertyWidget); // Step 3
            this.applyExt(property, propertyWidget); // Step 4

            const propertyGroupName = this.getPropertyGroupName(property);
            const groupWidget = this.getPropertyGroupWidget(propertyGroupName);
            this.labelWidthCalc(property);
            this.setGroupOptions(propertyGroupName, groupWidget); // Step 6
            this.assignWidgetToPropertyGroup(propertyWidget, groupWidget); // Step 5

            ret[property.id] = propertyWidget;
            this._groupCache[propertyGroupName] = groupWidget;
            return ret;
        }, {});

        const groupArr = Object.keys(this._groupCache);
        groupArr.sort((a, b) => {
            return this._groupCache[a].widgets().length > this._groupCache[b].widgets().length ? -1 : 1;
        });
        const bbox = domNode.getBoundingClientRect();
        let renderCount = 0;
        const maxRender = groupArr.length;
        const groupHeightArr = [];
        const groupHeightIdxArr = [];
        groupArr
            .forEach((n, i) => {
                this._groupCache[n].render(function(widget) { // Step 7
                    const w = context.columnWidth() - 15;
                    const bbox2 = widget.element().node().getBoundingClientRect();
                    widget.element()
                        .select(".parent-collapser")
                        .style("width", w + "px")
                        ;
                    if (context.absolutePositioning()) {
                        groupHeightArr.push(bbox2.height);
                        groupHeightIdxArr.push(i);
                        renderCount++;
                        if (renderCount === maxRender && bbox.width > context.columnWidth()) {
                            context.applyColumnStrategy(groupArr, groupHeightIdxArr, groupHeightArr, bbox); // Step 8
                        }
                    }
                });
            })
            ;
    }
    applyColumnStrategy(groupArr, groupHeightIdxArr, groupHeightArr, bbox) {
        const context = this;
        const p = this.gutter();
        let colSize = this.columnWidth();
        let colCount = Math.floor((bbox.width - p) / (colSize + p));
        colCount = colCount ? colCount : 1;
        if (this.stretchColumns()) {
            const excessWidth = (bbox.width - p) - (colCount * (colSize + p));
            colSize += excessWidth / colCount;
        }
        const columnSums = Array(colCount).fill(0);
        const columnIdxArr = Array(colCount).fill(1).map(n => []);
        groupHeightArr.forEach((h, i) => {
            let columnSum = columnSums[0];
            let columnIdx = 0;
            columnSums.forEach((sum, idx) => {
                if (columnSum > sum) {
                    columnSum = sum;
                    columnIdx = idx;
                }
            });
            columnSums[columnIdx] = columnSum + h;
            columnIdxArr[columnIdx].push(i);
        });
        const elements = groupHeightIdxArr.map(i => {
            return this._groupCache[groupArr[i]].element();
        });
        const newHeights = groupHeightIdxArr.map(i => {
            return this._groupCache[groupArr[i]].element().node().firstChild.getBoundingClientRect().height;
        });
        console.log("groupHeightArr", groupHeightArr);
        console.log("newHeights", newHeights);
        columnIdxArr.forEach((idxArr, colIdx) => {
            let sum = p;
            idxArr.forEach((idx) => {
                const x1 = (p * (1 + colIdx)) + (colIdx * colSize);
                const y1 = sum;
                const h = newHeights[idx];
                elements[idx]
                    .style("position", "absolute")
                    .style("left", x1 + "px")
                    .style("top", y1 + "px")
                    .style("width", colSize + "px")
                    .style("height", h + "px")
                    .selectAll(".parent-collapser")
                    .style("width", null)
                    .selectAll(".collapser")
                    .on("click", function() {
                        let parent = this.parentNode;
                        let count = 0;
                        while (parent !== null && !d3Select(parent).classed("parent-collapser") && count < 30) {
                            parent = parent.parentNode;
                            count++;
                        }
                        d3Select(parent)
                            .classed("collapsed", !d3Select(parent).classed("collapsed"))
                            ;
                        context.render();
                    })
                    ;
                sum += h + p;
            });
        });
    }
    assignWidgetToPropertyGroup(propertyWidget, groupWidget) {
        if (groupWidget.widgets().indexOf(propertyWidget) === -1) {
            groupWidget.widgets(groupWidget.widgets().concat([propertyWidget]));
        }
    }
    setGroupOptions(groupName, groupWidget) {
        if (typeof this._groupOptions[groupName] === "function") {
            this._groupOptions[groupName](groupWidget);
        }
        if (this.disableGrouping()) {
            groupWidget.flatWrapper(true);
        }
    }
    setChangeListener(property, propertyWidget) {
        const context = this;
        propertyWidget.change = function(w, complete: boolean) {
            const widget = context.widget()[property.id](w.value());
            if (widget.render) {
                widget.render();
            }
            context.render();
        };
    }
    applyExt(property, propertyWidget) {
        if (property.ext && typeof property.ext.disable === "function") {
            const isDisabled = property.ext.disable(this.widget());
            propertyWidget.disable(isDisabled);
        }
    }
    getPropertyWidget(prop, widget?) {
        return this._propertyTypes[prop.type].call(this, prop, widget);
    }
    getPropertyGroupWidget(propertyGroupName) {
        const gw = (this._groupCache[propertyGroupName] || new PropertyGroup());
        if (gw.target() === null) {
            gw.target(this.element().node());
        }
        return gw
            .label(propertyGroupName)
            .labelWidth(this._maxLabelWidth)
            ;
    }
    getPropertyGroupName(property) {
        let ret = "Misc";
        Object.keys(this._groupFilters).forEach((groupName) => {
            if (this._groupFilters[groupName](property)) {
                ret = groupName;
            }
        });
        return ret;
    }
}
PropertyEditor2.prototype._class += " other_PropertyEditor2";

export interface PropertyEditor2 {
    widget(): any;
    widget(_: any): this;
    label(): string;
    label(_: string): this;
    disableGrouping(): boolean;
    disableGrouping(_: boolean): this;
    columnWidth(): number;
    columnWidth(_: number): this;
    gutter(): number;
    gutter(_: number): this;
    stretchColumns(): boolean;
    stretchColumns(_: boolean): this;
    absolutePositioning(): boolean;
    absolutePositioning(_: boolean): this;
    show_settings(): boolean;
    show_settings(_: boolean): this;
    disableLabels(): boolean;
    disableLabels(_: boolean): this;

}

PropertyEditor2.prototype.publish("disableLabels", false, "boolean");
PropertyEditor2.prototype.publish("show_settings", false, "boolean");
PropertyEditor2.prototype.publish("gutter", 8, "number", "Space between property groups and property editor padding (pixels)");
PropertyEditor2.prototype.publish("stretchColumns", true, "boolean", "If true, stretch the property groups to fit the available width");
PropertyEditor2.prototype.publish("disableGrouping", false, "boolean", "If true, grouping will be disabled");
PropertyEditor2.prototype.publish("absolutePositioning", true, "boolean", "If true, property groups will use absolute positioning");
PropertyEditor2.prototype.publish("label", "", "string", "Label for this property editor");
PropertyEditor2.prototype.publish("columnWidth", 330, "number", "Horizontal space to be provided for property editor columns (pixels)");
PropertyEditor2.prototype.publish("widget", null, "widget", "Widget", null, { tags: ["Basic"], render: false });
