import { HTMLWidget } from "@hpcc-js/common";
import { select as d3Select } from "d3-selection";

export class SimpleTable extends HTMLWidget {
    protected _table;
    protected _tbody;
    _transformedData;
    constructor() {
        super();
    }
    enter(domNode, element) {
        super.enter(domNode, element);

        this._table = element.append("table");
        this._tbody = this._table.append("tbody");
    }
    update(domNode, element) {
        super.update(domNode, element);
        this._table
            .style("width", this.autoWidth() ? "auto" : "100%")
            ;
        const trSelection = this._tbody.selectAll("tr").data(this._transformedData ? this._transformedData : this.data());
        trSelection.enter()
            .append("tr")
            .merge(trSelection)
            .each(function(d) {
                const tr = d3Select(this);
                const tdSelection = tr.selectAll("td").data(d);
                tdSelection.enter()
                    .append("td")
                    .each(function(n, i) {
                        d3Select(this)
                            .classed("col-" + i, true)
                            ;
                    })
                    .merge(tdSelection)
                    .text(_d => (_d).toString())
                    ;
                tdSelection.exit().remove();
            })
            ;
        trSelection.exit().remove();
    }
}
SimpleTable.prototype._class += " html_SimpleTable";

export interface SimpleTable {
    autoWidth(): boolean;
    autoWidth(_: boolean): this;
}
SimpleTable.prototype.publish("autoWidth", false, "boolean", "If true, table width will be set to 'auto'. If false, the width is set to '100%'");
