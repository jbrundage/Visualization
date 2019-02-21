import { StyledTable } from "./StyledTable";

export class StatsTable extends StyledTable {
    update(domNode, element) {
        this.tbodyColumnStyles_default([
            {
                "font-weight": "bold",
                "width": "auto"
            },
            {
                "width": "1%",
                "text-align": "right"
            },
            {
                width: "1%"
            }
        ]);
        this.lastRowStyles_default({
            "font-weight": "bold"
        });
        super.update(domNode, element);
    }
}
StatsTable.prototype._class += " html_StatsTable";

export interface StatsTable {
    labelColor(): string;
    labelColor(_: string): this;
    primaryValueColor(): string;
    primaryValueColor(_: string): this;
    secondaryValueColor(): string;
    secondaryValueColor(_: string): this;
}
StatsTable.prototype.publish("labelColor", "#333", "html-color", "Color of the text in the first column");
StatsTable.prototype.publish("primaryValueColor", "#333", "html-color", "Color of the text in the second column");
StatsTable.prototype.publish("secondaryValueColor", "#333", "html-color", "Color of the text in the third column");
StatsTable.prototype.publish("thirdColumnWidth", "40px", "string");
