
import { Select } from "@hpcc-js/other";
import { Table } from "@hpcc-js/dgrid";
import { GMapPin } from "@hpcc-js/map";
import { ChartPanel } from "@hpcc-js/layout";
import { Dashboard, Databomb, Element, ElementContainer, Filters, Form, GroupBy, HipieRequest, Limit, LogicalFile, Project, RoxieRequest, Sort, WUResult } from "@hpcc-js/marshaller";

//  Dashboard Element Container (Model)  ---
const ec = new ElementContainer();

//  Data Sources  ---
const ds__pe285 = new HipieRequest(ec)
    .url("http://10.241.100.157:8010")
    .querySet("roxie")
    .queryID("batchr3dspsvcqa_mbs_govbissimplepotentialunknownbycity.Ins3828032_Service_55782458")
    .resultName("View_City")
    .requestFields([])
    ;
const ds__pe286 = new HipieRequest(ec)
    .url("http://10.241.100.157:8010")
    .querySet("roxie")
    .queryID("batchr3dspsvcqa_mbs_govbissimplepotentialunknownbycity.Ins3828032_Service_55782458")
    .resultName("View_Detail")
    .requestFields([{ source: "City", remoteFieldID: "physicaladdressvanitycity", localFieldID: "physicaladdressvanitycity" }])
    ;
const ds__pe287 = new HipieRequest(ec)
    .url("http://10.241.100.157:8010")
    .querySet("roxie")
    .queryID("batchr3dspsvcqa_mbs_govbissimplepotentialunknownbycity.Ins3828032_Service_55782458")
    .resultName("View_Map")
    .requestFields([{ source: "Detail", remoteFieldID: "proxassociationproxentitylocation", localFieldID: "proxassociationproxentitylocation" }])
    ;

//  Visualization Widgets (View) ---
const cp_City = new ChartPanel()
    .id("City")
    .title("City")
    .widget(new Select()
        .label("City")
        .valueColumn("rowcount")
        .textColumn("physicaladdressvanitycity")
        .sort("ascending")
    )
    ;

const cp_Detail = new ChartPanel()
    .id("Detail")
    .title("Details")
    .widget(new Table()
        .pagination(false)
    )
    ;

const cp_Map = new ChartPanel()
    .id("Map")
    .title("Map")
    .widget(new GMapPin()
        .centerLat(53.567854972876)
        .centerLong(-115.7061743125)
        .zoom(4)
        .autoScale(true)
        .mapTypeControl(true)
        .streetViewControl(true)
        .streetView(false)
        .googleMapStyles([])
        .latitudeColumn("physicaladdresslatitude")
        .longtitudeColumn("physicaladdresslongitude")
    )
    ;

//  Dashboard Elements  (Controller) ---
const elem_City = new Element(ec)
    .id("City")
    .pipeline([
        ds__pe285,
        new Project().trim(true).transformations([{ fieldID: "physicaladdressvanitycity", type: "=", param1: "physicaladdressvanitycity", param2: undefined }, { fieldID: "rowcount", type: "=", param1: "base_count", param2: undefined }])
    ])
    .chartPanel(cp_City)
    .on("selectionChanged", () => {
        elem_Detail.refresh();
    }, true)
    ;
ec.append(elem_City);

const elem_Detail = new Element(ec)
    .id("Detail")
    .pipeline([
        ds__pe286,
        new Project().trim(true).transformations([{ fieldID: "Business Name", type: "=", param1: "legal_name", param2: undefined }, { fieldID: "Doing Business As", type: "=", param1: "dba_name", param2: undefined }, { fieldID: "Address", type: "=", param1: "physicaladdresscleanedaddress", param2: undefined }, { fieldID: "City", type: "=", param1: "physicaladdressvanitycity", param2: undefined }, { fieldID: "Zip", type: "=", param1: "physicaladdresszip", param2: undefined }, { fieldID: "Business Phone", type: "=", param1: "bestselephone", param2: undefined }, { fieldID: "Alt. Business Phone", type: "=", param1: "bestproxphone", param2: undefined }, { fieldID: "Score", type: "=", param1: "bipattributeshierarchysize", param2: undefined }, { fieldID: "SIC", type: "=", param1: "bestselesicdescription", param2: undefined }, { fieldID: "NAICS", type: "=", param1: "bestselenaicsdescription", param2: undefined }, { fieldID: "Corporate Status", type: "=", param1: "biscorporatestatus", param2: undefined }, { fieldID: "BIS ID", type: "=", param1: "ultentitycontextuid", param2: undefined }, { fieldID: "Prox Entity Location", type: "=", param1: "proxassociationproxentitylocation", param2: undefined }])
    ])
    .chartPanel(cp_Detail)
    .on("selectionChanged", () => {
        elem_Map.refresh();
    }, true)
    ;
ec.append(elem_Detail);

const elem_Map = new Element(ec)
    .id("Map")
    .pipeline([
        ds__pe287,
        new Project().trim(true).transformations([{ fieldID: "physicaladdresslatitude", type: "=", param1: "physicaladdresslatitude", param2: undefined }, { fieldID: "physicaladdresslongitude", type: "=", param1: "physicaladdresslongitude", param2: undefined }, { fieldID: "legal_name", type: "=", param1: "legal_name", param2: undefined }, { fieldID: "proxentitycontextuid", type: "=", param1: "proxentitycontextuid", param2: undefined }, { fieldID: "proxassociationproxentitylocation", type: "=", param1: "proxassociationproxentitylocation", param2: undefined }, { fieldID: "mappininfo", type: "=", param1: "mappininfo", param2: undefined }])
    ])
    .chartPanel(cp_Map)
    .on("selectionChanged", () => {

    }, true)
    ;
ec.append(elem_Map);

ec.refresh();

//  Dashboard (optional) ---
const dashboard = new Dashboard(ec)
    .target("placeholder")
    .render(w => {
        (w as Dashboard).layout({ main: { type: "split-area", orientation: "vertical", children: [{ type: "tab-area", widgets: [{ __id: "City" }], currentIndex: 0 }, { type: "tab-area", widgets: [{ __id: "Detail" }], currentIndex: 0 }, { type: "tab-area", widgets: [{ __id: "Map" }], currentIndex: 0 }], sizes: [0.3819820590666497, 0.2360649125031896, 0.3819530284301607] } });
    })
    ;

//  Boilerplate  ---
import { Connection, hookSend, IOptions, ResponseType, SendFunc, serializeRequest } from "@hpcc-js/comms";

export function doHook() {
    const origSend = hookSend((opts: IOptions, action: string, request: any, responseType: ResponseType): Promise<any> => {
        if (opts.baseUrl === "https://webmiscdev.risk.regn.net") {
            return origSend(opts, action, request, responseType);
        }
        let newUrl = "";
        if (opts.baseUrl.split("").reverse()[0] === "/" || action[0] === "/") {
            newUrl = btoa(`${opts.baseUrl}${action}?${serializeRequest(request)}`);
        } else {
            newUrl = btoa(`${opts.baseUrl}/${action}?${serializeRequest(request)}`);
        }
        const connection = new Connection({ baseUrl: "https://webmiscdev.risk.regn.net", type: "get" });
        return connection.send("brundajx/DASH2/demos/dashy/bis_proxy.php", { encoded: newUrl }, responseType).then(response => {
            return response;
        }).catch(e => {
            throw e;
        });
    });
}
doHook();

export function init(target: string) {
    return dashboard;
}
