import { HTMLTooltip } from "./HTMLTooltip";
import { StyledTable } from "./StyledTable";

export class BreakdownTable extends StyledTable {
    protected _table;
    protected _tbody;
    protected _tooltip;
    constructor() {
        super();
    }
    enter(domNode, element) {
        super.enter(domNode, element);
        this._tooltip = new HTMLTooltip()
            .target(domNode)
            .render()
            ;
        console.log("this.height()", this.height());
    }
    update(domNode, element) {
        const rowCount = this.calculateRowCount() ? this.getCalculatedRowCount() : this.rowCount();
        this._transformedData = this.breakdownData(rowCount);

        this._tooltip
            .tooltipHTML(data => {
                const rowHeight = this.fontSize();
                const widestLabel = Math.max(...data.map(row => this.textSize(row[0], "Verdana", this.fontSize()).width));
                const widestPerc = 30;
                const colCount = 2;
                const w = colCount * (widestLabel + widestPerc) + (this._tooltip.padding() * 2);
                const h = rowHeight * Math.ceil(data.length / colCount) + (this._tooltip.padding() * 2);
                this._tooltip.tooltipWidth(w);
                this._tooltip.tooltipHeight(h);
                const otherData = this.breakdownData(this.data().length).slice(this.rowCount());
                return `<div style="
                    width: 100%;
                    height: 100%;
                    font-size: ${this.fontSize()}px
                ">${
                    otherData.map(row => `<div style="
                        float:left;
                        width:${Math.floor(99 / colCount)}%;
                    ">${row[0]}: ${row[1]}</div>`
                    ).join("")
                }</div>`;
            })
            ;
        this.theadColumnStyles_default([
            {
                "color": this.thFirstColor(),
                "font-size": this.thFontSize() + "px",
                "font-weight": this.thFontWeight(),
                "text-align": this.labelAlignment(),
                "width": "auto",
                "padding": "0px"
            },
            {
                "width": "1%",
                "font-size": this.thFontSize() + "px",
                "font-weight": this.thFontWeight(),
                "text-align": this.percentageAlignment(),
                "padding": "0px"
            }
        ]);
        this.tbodyColumnStyles_default([
            {
                "color": this.topLabelColor(),
                "font-size": this.fontSize() + "px",
                "font-weight": "normal",
                "text-align": this.labelAlignment(),
                "width": "auto",
                "padding": "0px"
            },
            {
                "color": this.topPercentageColor(),
                "font-size": this.fontSize() + "px",
                "font-weight": "normal",
                "text-align": this.percentageAlignment(),
                "width": "1%",
                "padding": "0px"
            }
        ]);
        this.lastRowStyles_default([
            {
                "color": this.otherLabelColor(),
                "font-size": this.fontSize() + "px",
                "font-weight": this.otherLabelBold() ? "bold" : "normal",
                "text-align": this.labelAlignment(),
                "width": "auto",
                "padding": "0px"
            },
            {
                "color": this.otherLabelColor(),
                "font-size": this.fontSize() + "px",
                "font-weight": this.otherPercentageBold() ? "bold" : "normal",
                "text-align": this.percentageAlignment(),
                "width": "1%",
                "padding": "0px"
            }
        ]);

        super.update(domNode, element);

        const lastRow = element.select("tr:last-child");
        lastRow
            .on("mouseout.tooltip", d => {
                this._tooltip._triggerElement = lastRow;
                this._tooltip.hide.call(this._tooltip, this.data());
            })
            .on("mouseenter.tooltip", d => {
                this._tooltip._triggerElement = lastRow;
                this._tooltip.direction("n");
                this._tooltip.show.call(this._tooltip, this.data());
            })
            ;
    }
    breakdownData(limit: number) {
        const len = this.data().length;
        const sum = this.data().reduce((acc, row) => acc + row[1], 0);
        const data = [];
        let percSum = 0;
        this.data().sort((a, b) => a[1] > b[1] ? -1 : 1);
        this.data()
            .filter((_, i) => i < limit - 1)
            .forEach(row => {
                const perc = Math.ceil((row[1] / sum) * 100);
                percSum += perc;
                data.push([row[0], perc + "%"]);
            });
        if (limit < this.data().length) {
            const otherLabel = `${this.otherLabel()} (${len - data.length})`;
            const otherPercentage = (100 - percSum) + "%";
            data.push([otherLabel, otherPercentage]);
        }
        return data;
    }
    getCalculatedRowCount() {
        const theadRowHeight = this.columns().length > 0 ? this.thFontSize() + 5 : 0;
        console.log("theadRowHeight", theadRowHeight);
        const tbodyRowHeight = this.fontSize() + 5;
        console.log("tbodyRowHeight", tbodyRowHeight);
        const tbodyAvailableHeight = this.height() - theadRowHeight;
        console.log("tbodyAvailableHeight", tbodyAvailableHeight);
        const rowCount = Math.floor(tbodyAvailableHeight / tbodyRowHeight);
        console.log("rowCount", rowCount);
        return rowCount;
    }
    tooltip;
    tooltipHTML: (_) => string;
    tooltipFormat: (_) => string;
}
BreakdownTable.prototype._class += " html_BreakdownTable";

export interface BreakdownTable {
    calculateRowCount(): boolean;
    calculateRowCount(_: boolean): this;
    rowCount(): number;
    rowCount(_: number): this;
    fontSize(): number;
    fontSize(_: number): this;
    thFirstColor(): string;
    thFirstColor(_: string): this;
    thLastColor(): string;
    thLastColor(_: string): this;
    thFontSize(): number;
    thFontSize(_: number): this;
    thFontWeight(): string;
    thFontWeight(_: string): this;
    labelAlignment(): "left" | "center" | "right";
    labelAlignment(_: "left" | "center" | "right"): this;
    percentageAlignment(): "left" | "center" | "right";
    percentageAlignment(_: "left" | "center" | "right"): this;
    topLabelColor(): string;
    topLabelColor(_: string): this;
    topPercentageColor(): string;
    topPercentageColor(_: string): this;
    topPercentageBold(): boolean;
    topPercentageBold(_: boolean): this;
    otherLabel(): string;
    otherLabel(_: string): this;
    otherLabelColor(): string;
    otherLabelColor(_: string): this;
    otherLabelBold(): boolean;
    otherLabelBold(_: boolean): this;
    otherPercentageColor(): string;
    otherPercentageColor(_: string): this;
    otherPercentageBold(): boolean;
    otherPercentageBold(_: boolean): this;
}

BreakdownTable.prototype.publish("calculateRowCount", true, "boolean", "If true, rowCount will be calculated and its default will be overwritten");
BreakdownTable.prototype.publish("rowCount", 5, "number", "Number of total rows to display (including the 'other' row)", undefined, {disable: w => w.calculateRowCount()});
BreakdownTable.prototype.publish("fontSize", 14, "number", "Font size (pixels)");
BreakdownTable.prototype.publish("labelAlignment", "left", "set", "Alignment of the label column text", ["left", "center", "right"]);
BreakdownTable.prototype.publish("percentageAlignment", "center", "set", "Alignment of the percentage column text", ["left", "center", "right"]);
BreakdownTable.prototype.publish("topLabelColor", "#333", "html-color", "Color of displayed 'top' labels");
BreakdownTable.prototype.publish("topPercentageColor", "#1A99D5", "html-color", "Color of displayed 'top' percentages");
BreakdownTable.prototype.publish("topPercentageBold", true, "html-color", "If true, the 'top' percentages will be bold");
BreakdownTable.prototype.publish("otherLabel", "Other", "string", "Label text for the 'other' row");
BreakdownTable.prototype.publish("otherLabelColor", "#AAA", "html-color", "Color of the 'other' label");
BreakdownTable.prototype.publish("otherLabelBold", false, "html-color", "If true, the 'other' label will be bold");
BreakdownTable.prototype.publish("otherPercentageColor", "#AAA", "html-color", "Color of the 'other' percentage");
BreakdownTable.prototype.publish("otherPercentageBold", false, "html-color", "If true, the 'other' percentage will be bold");
BreakdownTable.prototype.publish("thFontWeight", "bold", "string", "Font weight for th elements");
BreakdownTable.prototype.publish("thFontSize", 26, "number", "Font size for th elements");
BreakdownTable.prototype.publish("thFirstColor", "#333", "html-color", "Text color of the first th element");
BreakdownTable.prototype.publish("thLastColor", "#333", "html-color", "Text color of the last th element");
