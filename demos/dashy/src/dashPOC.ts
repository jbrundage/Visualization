
import { Table } from "@hpcc-js/dgrid";
import { ChartPanel } from "@hpcc-js/layout";
import { Dashboard, Databomb, Element, ElementContainer, Filters, Form, GroupBy, Limit, LogicalFile, Project, RoxieRequest, Sort, WUResult } from "@hpcc-js/marshaller";

//  Dashboard Element Container (Model)  ---
const ec = new ElementContainer();

//  Data Sources  ---
const ds_10 = new RoxieRequest(ec)
    .url("http://10.241.100.157:8010")
    .querySet("roxie")
    .queryID("batchr3dspsvcqa_mbs_govbissimplepotentialunknownbyzip.Ins77379_Service_55782458")
    .resultName("View_Zip")
    .requestFields([])
    ;

//  Visualization Widgets (View) ---
const viz_10 = new ChartPanel()
    .id("viz_10")
    .title("Zip")
    .widget(new Table())
    ;

const viz_11 = new ChartPanel()
    .id("viz_11")
    .title("Map")
    .widget(new Table())
    ;

const viz_12 = new ChartPanel()
    .id("viz_12")
    .title("Details")
    .widget(new Table())
    ;

//  Dashboard Elements  (Controller) ---
const element_10 = new Element(ec)
    .id("element_10")
    .pipeline([
        ds_10,
        new Project().transformations([{ fieldID: "physicaladdresszip", type: "=", param1: "physicaladdresszip", param2: undefined }, { fieldID: "base_count", type: "=", param1: "base_count", param2: undefined }])
    ])
    .chartPanel(viz_10)
    .on("selectionChanged", () => {
        element_12.refresh();
    }, true)
    ;
ec.append(element_10);

const element_11 = new Element(ec)
    .id("element_11")
    .pipeline([
        ds_10,
        new Filters(ec).conditions([{ viewID: "element_12", mappings: [{ remoteFieldID: "proxassociationproxentitylocation", localFieldID: "proxassociationproxentitylocation", condition: "==", nullable: false }] }]),
        new Project().transformations([{ fieldID: "physicaladdresslatitude", type: "=", param1: "physicaladdresslatitude", param2: undefined }, { fieldID: "physicaladdresslongitude", type: "=", param1: "physicaladdresslongitude", param2: undefined }, { fieldID: "proxassociationproxentitylocation", type: "=", param1: "proxassociationproxentitylocation", param2: undefined }, { fieldID: "legal_name", type: "=", param1: "legal_name", param2: undefined }, { fieldID: "mappininfo", type: "=", param1: "mappininfo", param2: undefined }])
    ])
    .chartPanel(viz_11)
    .on("selectionChanged", () => {

    }, true)
    ;
ec.append(element_11);

const element_12 = new Element(ec)
    .id("element_12")
    .pipeline([
        ds_10,
        new Filters(ec).conditions([{ viewID: "element_10", mappings: [{ remoteFieldID: "physicaladdresszip", localFieldID: "physicaladdresszip", condition: "==", nullable: false }] }]),
        new Project().transformations([{ fieldID: "legal_name", type: "=", param1: "legal_name", param2: undefined }, { fieldID: "dba_name", type: "=", param1: "dba_name", param2: undefined }, { fieldID: "physicaladdresscleanedaddress", type: "=", param1: "physicaladdresscleanedaddress", param2: undefined }, { fieldID: "physicaladdressvanitycity", type: "=", param1: "physicaladdressvanitycity", param2: undefined }, { fieldID: "physicaladdresszip", type: "=", param1: "physicaladdresszip", param2: undefined }, { fieldID: "bestselephone", type: "=", param1: "bestselephone", param2: undefined }, { fieldID: "bestproxphone", type: "=", param1: "bestproxphone", param2: undefined }, { fieldID: "bipattributeshierarchysize", type: "=", param1: "bipattributeshierarchysize", param2: undefined }, { fieldID: "bestselesicdescription", type: "=", param1: "bestselesicdescription", param2: undefined }, { fieldID: "bestselenaicsdescription", type: "=", param1: "bestselenaicsdescription", param2: undefined }, { fieldID: "biscorporatestatus", type: "=", param1: "biscorporatestatus", param2: undefined }, { fieldID: "ultentitycontextuid", type: "=", param1: "ultentitycontextuid", param2: undefined }, { fieldID: "proxassociationproxentitylocation", type: "=", param1: "proxassociationproxentitylocation", param2: undefined }])
    ])
    .chartPanel(viz_12)
    .on("selectionChanged", () => {
        element_11.refresh();
    }, true)
    ;
ec.append(element_12);

ec.refresh();

//  Dashboard (optional) ---
const dashboard = new Dashboard(ec)
    .target("placeholder")
    .render(w => {
        (w as Dashboard).layout({ main: { type: "split-area", orientation: "vertical", children: [{ type: "tab-area", widgets: [{ __id: "viz_10" }], currentIndex: 0 }, { type: "tab-area", widgets: [{ __id: "viz_11" }], currentIndex: 0 }, { type: "tab-area", widgets: [{ __id: "viz_12" }], currentIndex: 0 }], sizes: [0.3819820590666497, 0.23606491250318956, 0.38195302843016066] } });
    })
    ;

export function init(target: string) {
    return dashboard;
}
