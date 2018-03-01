import { publish, publishProxy } from "@hpcc-js/common";
import { ChartPanel } from "./ChartPanel";
// import { Button, Spacer, TitleBar, ToggleButton } from "./TitleBar";

import "../src/ResponsivePanel.css";
export class ResponsivePanel extends ChartPanel {

    constructor() {
        super();
        this._tag = "div";
    }

    @publishProxy("_titleBar", "titleIcon")
    _titleIcon: publish<this, string>;
    @publishProxy("_titleBar", "titleIconFont")
    _titleIconFont: publish<this, string>;
    @publishProxy("_titleBar", "title")
    title: publish<this, string>;
    @publishProxy("_titleBar", "titleFont")
    _titleFont: publish<this, string>;
    @publish([[50, 50], [200, 200]], "array", "resolutionArray")
    resolutionArray: publish<this, string>;

    enter(domNode, element) {
        super.enter(domNode, element);
    }

    update(domNode, element) {
        super.update(domNode, element);
        console.log(this._size);
        const resolution_arr = this.resolutionArray();
        if ("undefined" !== typeof resolution_arr[1]) {
            const tinyRes = resolution_arr[0];
            const smallRes = resolution_arr[1];
            this._titleBar.titleIcon(this._titleIcon());
            // this._titleBar.element().node().parentElement.style.height = "44px";
            if (this._size.width < tinyRes[0] || this._size.height < tinyRes[1]) {
                this.apply_tiny_resolution();
            } else if (this._size.width < smallRes[0] || this._size.height < smallRes[1]) {
                this.apply_small_resolution();
            } else {
                this.apply_regular_resolution();
            }
        } else {
            this.apply_regular_resolution();
        }
    }
    apply_tiny_resolution() {
        console.log("applying tiny resolution");
    }
    apply_small_resolution() {
        console.log("applying small resolution");
    }
    apply_regular_resolution() {
        console.log("applying regular resolution");
    }
    exit(domNode, element) {
        super.exit(domNode, element);
    }

    click(row, column, selected) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column + ", " + selected);
    }

    dblclick(row, column, selected) {
        console.log("Double click:  " + JSON.stringify(row) + ", " + column + ", " + selected);
    }

    vertex_click(row, col, sel, more) {
        if (more && more.vertex) {
            console.log("Vertex click: " + more.vertex.id());
        }
    }

    vertex_dblclick(row, col, sel, more) {
        if (more && more.vertex) {
            console.log("Vertex double click: " + more.vertex.id());
        }
    }

    edge_click(row, col, sel, more) {
        if (more && more.edge) {
            console.log("Edge click: " + more.edge.id());
        }
    }

    edge_dblclick(row, col, sel, more) {
        if (more && more.edge) {
            console.log("Edge double click: " + more.edge.id());
        }
    }
}
ResponsivePanel.prototype._class += " layout_ChartPanel";
