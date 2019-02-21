import { SimpleTable } from "./SimpleTable";

export class StyledTable extends SimpleTable {
    constructor() {
        super();
    }
    update(domNode, element) {
        super.update(domNode, element);

        this.theadColumnStyles().forEach((styleObj, i) => {
            const columnSelection = element.selectAll(".th-" + i);
            Object.keys(styleObj).forEach(styleName => {
                columnSelection.style(styleName, styleObj[styleName]);
            });
        });
        this.tbodyColumnStyles().forEach((styleObj, i) => {
            const columnSelection = element.selectAll(".col-" + i);
            Object.keys(styleObj).forEach(styleName => {
                columnSelection.style(styleName, styleObj[styleName]);
            });
        });
        const styleObj = this.lastRowStyles();
        const lastRowSelection = element.selectAll("tbody > tr:last-child");
        Object.keys(styleObj).forEach(styleName => {
            lastRowSelection.style(styleName, styleObj[styleName]);
        });
    }
}
StyledTable.prototype._class += " html_StyledTable";

export interface StyledTable {
    tbodyColumnStyles(): any;
    tbodyColumnStyles(_: any): this;
    tbodyColumnStyles_default(_: any): this;
    tbodyColumnStyles_exists(): boolean;
    theadColumnStyles(): any;
    theadColumnStyles(_: any): this;
    theadColumnStyles_default(_: any): this;
    theadColumnStyles_exists(): boolean;
    lastRowStyles(): any;
    lastRowStyles(_: any): this;
    lastRowStyles_default(_: any): this;
    lastRowStyles_exists(): boolean;
}

StyledTable.prototype.publish("theadColumnStyles", [], "array", 'Array of objects containing styles for the thead columns (ex: [{"color":"red"},{"color":"blue"}])');
StyledTable.prototype.publish("tbodyColumnStyles", [], "array", 'Array of objects containing styles for the tbody columns (ex: [{"color":"red"},{"color":"blue"}])');
StyledTable.prototype.publish("lastRowStyles", [], "array", 'Objects containing styles for the last row (ex: {"color":"red"})');
