import { select as d3Select } from "d3-selection";
import { HTMLWidget } from "./HTMLWidget";

import "../src/TreeMenu.css";

export class TreeMenu extends HTMLWidget {
    protected _ul;
    protected _button;

    constructor() {
        super();
    }
    enter(domNode, element) {
        super.enter.apply(this, arguments);
        this.element()
            .style("height", "100%")
            .style("width", "100%")
            ;
        this._button = element.append("button")
            .classed("common_TreeMenu-button", true)
            .text(this.buttonLabel())
            ;
        this._ul = element.append("ul")
            .classed("common_TreeMenu-ul", true)
            ;

        if (this.data()) {
            this.fillUl(this.data().children, this._ul);
            this.initClicks();
        }
    }
    setPopoverModeClass() {
        this.element().classed("left-popover-mode", this.popoverMode() === "left");
        this.element().classed("right-popover-mode", this.popoverMode() === "right");
    }
    update(domNode, element) {
        super.update.apply(this, arguments);
        this.setPopoverModeClass();
        this._button
            .classed("common_TreeMenu-button", true)
            .text(this.buttonLabel())
            .style("float", this.popoverMode() === "left" ? "right" : "left")
            .on("click", function() {
                if (d3Select(this.nextSibling).style("display") === "none") {
                    const button_bbox = this.getBoundingClientRect();
                    const ul_bbox = this.nextSibling.getBoundingClientRect();
                    const _left = button_bbox.left - button_bbox.width + ul_bbox.width;
                    d3Select(this.nextSibling)
                    .style("display", "inline-block")
                    .style("left", _left + "px")
                    .style("top", (button_bbox.top) + "px")
                    ;
                } else {
                    d3Select(this.nextSibling).style("display", "none");
                }
            })
            ;
        if (this.data()) {
            this._ul.html("");
            this.fillUl(this.data().children, this._ul);
            this.initClicks();
        }
    }
    fillUl(tree_node_arr, ul) {
        if (tree_node_arr instanceof Array) {
            tree_node_arr.forEach(_tree_node => {
                const _li = ul.append("li").classed("common_TreeMenu-li", true);
                this.fillLi(_tree_node, _li);
            });
        }
    }
    fillLi(tree_node, li) {
        if (tree_node.label) {
            li.append("span")
            .classed("common_TreeMenu-span", true)
            .text(tree_node.label)
            ;
            if (tree_node.children) {
                li.classed("common_TreeMenu-parent", true);
                const _ul = li.append("ul").classed("common_TreeMenu-ul", true);
                this.fillUl(tree_node.children, _ul);
            }
        }
    }
    initClicks() {
        const context = this;
        this._ul.selectAll(".common_TreeMenu-li")
            .on("click", function() {
                context.liClick(this);
            })
            ;
    }
    liClick(elm) {
        const d3_elm = d3Select(elm);
        const is_already_expanded = d3_elm.classed("expanded");
        if (!is_already_expanded) {
            this.element().selectAll(".expanded").classed("expanded", false);
            this.expandParentsOf(elm);
            if (d3_elm.classed("common_TreeMenu-parent")) {
                // parent node clicked
                d3_elm.classed("expanded", true);

                if (this.popoverMode() === "left") {
                    this.moveElementLeftOfThis(d3_elm, d3_elm.select(".common_TreeMenu-ul"));
                } else {
                    this.moveElementRightOfThis(d3_elm, d3_elm.select(".common_TreeMenu-ul"));
                }
            } else {
                // leaf node clicked
                this.click(d3_elm);
            }
        }
    }
    expandParentsOf(elm) {
        let ancestor = d3Select(elm.parentNode);
        while (ancestor.classed("common_TreeMenu-li") || ancestor.classed("common_TreeMenu-ul")) {
            if (ancestor.classed("common_TreeMenu-li")) {
                ancestor.classed("expanded", true);
            }
            ancestor = d3Select(ancestor.node().parentNode);
        }
    }
    moveElementLeftOfThis(element1, element2, ignore_overflow?) {
        const source_bbox = element1.node().getBoundingClientRect();
        const target_bbox = element2.node().getBoundingClientRect();
        if (source_bbox.left + source_bbox.width + target_bbox.width <= window.innerWidth || ignore_overflow) {
            element2
                .style("left", (source_bbox.left + source_bbox.width) + "px")
                .style("top", (source_bbox.top) + "px")
                ;
        } else {
            this.moveElementRightOfThis(element1, element2, true);
        }
    }
    moveElementRightOfThis(element1, element2, ignore_overflow?) {
        const source_bbox = element1.node().getBoundingClientRect();
        const target_bbox = element2.node().getBoundingClientRect();
        if (source_bbox.left - target_bbox.width >= 0 || ignore_overflow) {
            element2
                .style("left", (source_bbox.left - target_bbox.width) + "px")
                .style("top", (source_bbox.top) + "px")
                ;
        } else {
            this.moveElementLeftOfThis(element1, element2, true);
        }
    }
    click(element) {
        console.log(`clicked leaf element: `, element.node());
    }
}
TreeMenu.prototype._class += " common_TreeMenu";

export interface TreeMenu {
    buttonLabel(): string;
    buttonLabel(_: string): this;
    buttonIcon(): string;
    buttonIcon(_: string): this;
    parentListIcon(): string;
    parentListIcon(_: string): this;
    listIcon(): string;
    listIcon(_: string): this;
    popoverMode(): string;
    popoverMode(_: string): this;
}

TreeMenu.prototype.publish("listIcon", "fa-arrow-right", "string");
TreeMenu.prototype.publish("parentListIcon", "fa-reddit", "string");
TreeMenu.prototype.publish("buttonIcon", "fa-user", "string");
TreeMenu.prototype.publish("buttonLabel", "Menu", "string");
TreeMenu.prototype.publish("popoverMode", "right", "set", "Controls which side the submenus expand towards", ["left", "right"]);
