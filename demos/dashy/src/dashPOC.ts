
import { ChartPanel } from "@hpcc-js/composite";
import { Dashboard, Databomb, Element, ElementContainer, Filters, GroupBy, Limit, LogicalFile, Project, Sort, WUResult } from "@hpcc-js/marshaller";

//  Data Sources  ---
const ds_3 = new LogicalFile().url("http://192.168.3.22:8010").logicalFile("progguide::exampledata::peopleaccts");
const ds_4 = new WUResult().url("http://192.168.3.22:8010").wuid("W20170424-070701").resultName("Result 1");

//  Visualization Widgets  ---
const viz_3 = new ChartPanel()
    .id("viz_3")
    .title("element_3")
    .chartType("COLUMN")
    .chartTypeProperties({ orientation: "vertical" })
    ;

const viz_4 = new ChartPanel()
    .id("viz_4")
    .title("element_4")
    .chartType("BUBBLE")
    .chartTypeProperties({ paletteID: "Dark2" })
    ;

const viz_5 = new ChartPanel()
    .id("viz_5")
    .title("element_5")
    .chartType("TABLE")
    .chartTypeProperties({})
    ;

//  Dashboard Elements  ---
const ec = new ElementContainer();

const element_3 = new Element(ec)
    .id("element_3")
    .pipeline([
        ds_3,
        new GroupBy().fieldIDs(["state"]).aggregates([{ label: "max Zip", type: "max", fieldID: "zip" }]),
        new Sort().conditions([{ fieldID: "max Zip", descending: true }])
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
        ds_4,
        new GroupBy().fieldIDs(["gender"]).aggregates([{ label: "Row Count", type: "count" }]),
        new Sort().conditions([{ fieldID: "Row Count", descending: false }])
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
        ds_4,
        new Filters(ec).conditions([{ viewID: "element_3", nullable: false, mappings: [{ remoteFieldID: "state", localFieldID: "state", condition: "==" }] }, { viewID: "element_4", nullable: true, mappings: [{ remoteFieldID: "gender", localFieldID: "gender", condition: "==" }] }])
    ])
    .widget(viz_5)
    .on("selectionChanged", () => {

    }, true)
    ;
ec.append(element_5);

ec.refresh();

//  Dashboard (optional) ---
const dashboard = new Dashboard(ec)
    .target("placeholder")
    .render(w => {
        (w as Dashboard).layout({ main: { type: "split-area", orientation: "vertical", children: [{ type: "split-area", orientation: "horizontal", children: [{ type: "tab-area", widgets: [{ __id: "viz_3" }], currentIndex: 0 }, { type: "tab-area", widgets: [{ __id: "viz_4" }], currentIndex: 0 }], sizes: [0.5, 0.5] }, { type: "tab-area", widgets: [{ __id: "viz_5" }], currentIndex: 0 }], sizes: [0.6180469715698393, 0.3819530284301607] } });
    })
    ;

export function init(target: string) {
    return dashboard;
}
