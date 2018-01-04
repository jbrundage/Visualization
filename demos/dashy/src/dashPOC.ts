
import { ChartPanel } from "@hpcc-js/composite";
import { Dashboard, Databomb, Element, ElementContainer, Filters, Form, GroupBy, Limit, LogicalFile, Project, RoxieRequest, Sort, WUResult } from "@hpcc-js/marshaller";

//  Dashboard Element Container (Model)  ---
const ec = new ElementContainer();

//  Data Sources  ---
const ds_3 = new WUResult().url("http://52.51.90.23:8010").wuid("W20171220-053645").resultName("Result 1");

//  Visualization Widgets (View) ---
const viz_3 = new ChartPanel()
    .id("viz_3")
    .title("element_3")
    .chartType("BUBBLE")
    .chartTypeProperties({})
    ;

//  Dashboard Elements  (Controller) ---
const element_3 = new Element(ec)
    .id("element_3")
    .pipeline([
        ds_3,
        new GroupBy().fieldIDs(["gender"]).aggregates([{ fieldID: "rowCount", type: "count" }])
    ])
    .widget(viz_3)
    .on("selectionChanged", () => {

    }, true)
    ;
ec.append(element_3);

ec.refresh();

//  Dashboard (optional) ---
const dashboard = new Dashboard(ec)
    .target("placeholder")
    .render(w => {
        (w as Dashboard).layout({ main: { type: "tab-area", widgets: [{ __id: "viz_3" }], currentIndex: 0 } });
    })
    ;

export function init(target: string) {
    return dashboard;
}
