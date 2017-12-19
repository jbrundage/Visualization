
import { ChartPanel } from "@hpcc-js/composite";
import { Dashboard, Databomb, Element, ElementContainer, Filters, GroupBy, Limit, LogicalFile, Project, RoxieRequest, Sort, WUResult } from "@hpcc-js/marshaller";

//  Dashboard Element Container (Model)  ---
const ec = new ElementContainer();

//  Data Sources  ---
const ds_3 = new WUResult().url("http://192.168.3.22:8010").wuid("W20170424-070701").resultName("Result 1");
const ds_4 = new RoxieRequest(ec).url("http://192.168.3.22:8010").querySet("roxie").queryID("peopleaccounts.2").resultName("Accounts").requestFields([{ source: "element_3", remoteFieldID: "personid", localFieldID: "personid" }]);

//  Visualization Widgets (View) ---
const viz_3 = new ChartPanel()
    .id("viz_3")
    .title("element_3")
    .chartType("TABLE")
    .chartTypeProperties({})
    ;

const viz_4 = new ChartPanel()
    .id("viz_4")
    .title("element_4")
    .chartType("TABLE")
    .chartTypeProperties({})
    ;

//  Dashboard Elements  (Controllers) ---
const element_3 = new Element(ec)
    .id("element_3")
    .pipeline([
        ds_3
    ])
    .widget(viz_3)
    .on("selectionChanged", () => {
        element_4.refresh();
    }, true)
    ;
ec.append(element_3);

const element_4 = new Element(ec)
    .id("element_4")
    .pipeline([
        ds_4
    ])
    .widget(viz_4)
    .on("selectionChanged", () => {

    }, true)
    ;
ec.append(element_4);

ec.refresh();

//  Dashboard (optional) ---
const dashboard = new Dashboard(ec)
    .target("placeholder")
    .render(w => {
        (w as Dashboard).layout({ main: { type: "split-area", orientation: "vertical", children: [{ type: "tab-area", widgets: [{ __id: "viz_3" }], currentIndex: 0 }, { type: "tab-area", widgets: [{ __id: "viz_4" }], currentIndex: 0 }], sizes: [0.6180469715698393, 0.3819530284301607] } });
    })
    ;

export function init(target: string) {
    return dashboard;
}
