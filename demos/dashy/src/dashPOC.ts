
import { ChartPanel } from "@hpcc-js/composite";
import { Dashboard, Databomb, Element, ElementContainer, Filters, GroupBy, Limit, LogicalFile, Project, RoxieRequest, Sort, WUResult } from "@hpcc-js/marshaller";

//  Dashboard Element Container (Model)  ---
const ec = new ElementContainer();

//  Data Sources  ---
const ds_3 = new WUResult().url("http://52.51.90.23:8010").wuid("W20171220-053645").resultName("Result 1").samples(1).sampleSize(100000);
const ds_6 = new RoxieRequest(ec).url("http://52.51.90.23:8010").querySet("roxie").queryID("peopleaccounts").resultName("Accounts").requestFields([{ source: "element_5", remoteFieldID: "personid", localFieldID: "personid" }]);

//  Visualization Widgets (View) ---
const viz_3 = new ChartPanel()
    .id("viz_3")
    .title("People Count")
    .chartType("CHORO_USSTATES")
    .chartTypeProperties({ projection: "AlbersUsaPr" })
    ;

const viz_4 = new ChartPanel()
    .id("viz_4")
    .title("By Gender")
    .chartType("BUBBLE")
    .chartTypeProperties({})
    ;

const viz_5 = new ChartPanel()
    .id("viz_5")
    .title("Customers")
    .chartType("TABLE")
    .chartTypeProperties({})
    ;

const viz_6 = new ChartPanel()
    .id("viz_6")
    .title("Account Summary")
    .chartType("LINE")
    .chartTypeProperties({})
    ;

//  Dashboard Elements  (Controller) ---
const element_3 = new Element(ec)
    .id("element_3")
    .pipeline([
        ds_3,
        new GroupBy().fieldIDs(["state"]).aggregates([{ label: "Row Count", type: "count" }])
    ])
    .widget(viz_3)
    .on("selectionChanged", () => {
        element_5.refresh();
    }, true)
    ;
ec.append(element_3);

const element_4 = new Element(ec)
    .id("element_4")
    .pipeline([
        ds_3,
        new GroupBy().fieldIDs(["gender"]).aggregates([{ label: "Row Count", type: "count" }]),
        new Sort().conditions([{ fieldID: "gender", descending: true }])
    ])
    .widget(viz_4)
    .on("selectionChanged", () => {
        element_5.refresh();
    }, true)
    ;
ec.append(element_4);

const element_5 = new Element(ec)
    .id("element_5")
    .pipeline([
        ds_3,
        new Filters(ec).conditions([{ viewID: "element_3", nullable: false, mappings: [{ remoteFieldID: "state", localFieldID: "state", condition: "==" }] }, { viewID: "element_4", nullable: true, mappings: [{ remoteFieldID: "gender", localFieldID: "gender", condition: "==" }] }]),
        new Sort().conditions([{ fieldID: "lastname", descending: false }, { fieldID: "firstname", descending: false }])
    ])
    .widget(viz_5)
    .on("selectionChanged", () => {
        element_6.refresh();
    }, true)
    ;
ec.append(element_5);

const element_6 = new Element(ec)
    .id("element_6")
    .pipeline([
        ds_6,
        new GroupBy().fieldIDs(["account"]).aggregates([{ label: "Balance", type: "sum", fieldID: "balance" }, { label: "Credit", type: "sum", fieldID: "highcredit" }]),
        new Sort().conditions([{ fieldID: "Credit", descending: true }])
    ])
    .widget(viz_6)
    .on("selectionChanged", () => {

    }, true)
    ;
ec.append(element_6);

ec.refresh();

//  Dashboard (optional) ---
const dashboard = new Dashboard(ec)
    .target("placeholder")
    .render(w => {
        (w as Dashboard).layout({ main: { type: "split-area", orientation: "vertical", children: [{ type: "split-area", orientation: "horizontal", children: [{ type: "tab-area", widgets: [{ __id: "viz_3" }], currentIndex: 0 }, { type: "tab-area", widgets: [{ __id: "viz_4" }], currentIndex: 0 }], sizes: [0.5, 0.5] }, { type: "tab-area", widgets: [{ __id: "viz_5" }], currentIndex: 0 }, { type: "tab-area", widgets: [{ __id: "viz_6" }], currentIndex: 0 }], sizes: [0.27343749999999994, 0.35705140147067554, 0.3695110985293245] } });
    })
    ;

export function init(target: string) {
    return dashboard;
}
