import { PropertyExt } from "@hpcc-js/common";
import { Activity, stringify } from "./activities/activity";
import { Databomb } from "./activities/databomb";
import { DSPicker } from "./activities/dspicker";
import { Filters } from "./activities/filter";
import { GroupBy } from "./activities/groupby";
import { Limit } from "./activities/limit";
import { LogicalFile } from "./activities/logicalfile";
import { Project } from "./activities/project";
import { RoxieRequest } from "./activities/roxie";
import { Sort } from "./activities/sort";
import { WUResult } from "./activities/wuresult";
import { Dashboard } from "./dashboard";
import { Element, ElementContainer } from "./model";

export class JavaScriptAdapter {
    private _dashboard: Dashboard;
    private _elementContainer: ElementContainer;
    private _dsDedup: { [key: string]: Activity } = {};

    constructor(dashboard: Dashboard) {
        this._dashboard = dashboard;
        this._elementContainer = dashboard.elementContainer();
    }

    createProps(prefix: string, pe: PropertyExt, postfix: string = ""): string[] {
        let retVal: string[] = [];
        for (const meta of pe.publishedProperties()) {
            if ((pe as any)[meta.id + "_exists"]()) {
                switch (meta.type) {
                    case "string":
                    case "set":
                        retVal.push(`${prefix}.${meta.id}("${(pe as any)[meta.id]()}")${postfix};`);
                        break;
                    case "number":
                    case "boolean":
                        retVal.push(`${prefix}.${meta.id}(${(pe as any)[meta.id]()})${postfix};`);
                        break;
                    case "widget":
                        retVal = retVal.concat(this.createProps(`${prefix}.${meta.id}()`, (pe as any)[meta.id]()));
                        break;
                    case "propertyArray":
                        if (meta.ext)
                            retVal.push(`XXX${prefix}.${meta.id}([${(pe as any)[meta.id]()}])${postfix};`);
                        break;
                    default:
                        break;
                }
            }
        }
        return retVal;
    }

    createProps2(pe: PropertyExt): { [key: string]: any } {
        const retVal: { [key: string]: any } = {};
        for (const meta of pe.publishedProperties()) {
            if ((pe as any)[meta.id + "_modified"]() && meta.id !== "fields") {
                retVal[meta.id] = (pe as any)[meta.id]();
            }
        }
        return retVal;
    }

    writeDSActivity(activity: DSPicker): string {
        const dsID = activity.id();
        const details = activity.details();
        if (details instanceof WUResult) {
            return `const ${dsID} = new WUResult().url("${details.url()}").wuid("${details.wuid()}").resultName("${details.resultName()}");`;
        } else if (details instanceof LogicalFile) {
            return `const ${dsID} = new LogicalFile().url("${details.url()}").logicalFile("${details.logicalFile()}");`;
        } else if (details instanceof RoxieRequest) {
            return `const ${dsID} = new RoxieService().url("${details.url()}").querySet("${details.querySet()}").queryID("${details.queryID()}").resultName("${details.resultName()}");`;
        } else if (details instanceof Databomb) {
            return `const ${dsID} = new Databomb().payload(${JSON.stringify(details.payload())});`;
        }

        return `const ${dsID} = TODO-writeDSActivity: ${details.classID()}`;
    }

    writeActivity(activity: Activity): string {
        if (activity instanceof GroupBy) {
            return `new GroupBy().fieldIDs(${JSON.stringify(activity.fieldIDs())}).aggregates(${stringify(activity.aggregates())})`;
        } else if (activity instanceof Sort) {
            return `new Sort().conditions(${stringify(activity.conditions())})`;
        } else if (activity instanceof Filters) {
            return `new Filters(ec).conditions(${stringify(activity.conditions())})`;
        } else if (activity instanceof Project) {
            return `new Project().transformations(${stringify(activity.transformations())})`;
        } else if (activity instanceof Limit) {
            return `new Limit().rows(${activity.rows()})`;
        }
        return `TODO-writeActivity: ${activity.classID()}`;
    }

    writeDatasource(element: Element): string[] {
        const dataSources: string[] = [];
        for (const activity of element.view().activities()) {
            if (activity.exists()) {
                if (activity instanceof DSPicker) {
                    if (!this._dsDedup[activity.hash()]) {
                        this._dsDedup[activity.hash()] = activity;
                        dataSources.push(this.writeDSActivity(activity));
                    }
                }
            }
        }
        return dataSources;
    }

    writeWidget(element: Element) {
        const chartPanel = element.widget();
        const props = this.createProps2(chartPanel.chart());
        const vizID = chartPanel.id();
        return `
const ${vizID} = new ChartPanel()
    .id("${vizID}")
    .title("${element.widget().title()}")
    .chartType("${element.widget().chartType()}")
    .chartTypeProperties(${stringify(props)})
    ;
`;
    }

    writeElement(element: Element) {
        const activities: string[] = [];
        for (const activity of element.view().activities()) {
            if (activity.exists()) {
                if (activity instanceof DSPicker) {
                    activities.push(this._dsDedup[activity.hash()].id());
                } else {
                    activities.push(this.writeActivity(activity));
                }
            }
        }
        const updates: string[] = [];
        for (const filteredViz of this._elementContainer.filteredBy(element)) {
            updates.push(`${filteredViz.id()}.refresh();`);
        }
        const vizID = element.widget().id();
        return `
const ${element.id()} = new Element(ec)
    .id("${element.id()}")
    .pipeline([
        ${activities.join(",\n        ")}
    ])
    .widget(${vizID})
    .on("selectionChanged", () => {
        ${updates.join("\n        ")}
    }, true)
    ;
ec.append(${element.id()});
`;
    }

    writeDatasources(): string[] {
        let retVal: string[] = [];
        for (const element of this._elementContainer.elements()) {
            retVal = retVal.concat(this.writeDatasource(element));
        }
        return retVal;
    }

    writeWidgets(): string {
        let retVal = "";
        for (const element of this._elementContainer.elements()) {
            retVal += this.writeWidget(element);
        }
        return retVal;
    }

    writeElements(): string {
        let retVal = "";
        for (const element of this._elementContainer.elements()) {
            retVal += this.writeElement(element);
        }
        return retVal;
    }

    createJavaScript(): string {
        return `
import { ChartPanel } from "@hpcc-js/composite";
import { Dashboard, Databomb, Element, ElementContainer, Filters, GroupBy, Limit, LogicalFile, Project, Sort, WUResult } from "@hpcc-js/marshaller";

//  Data Sources  ---
${this.writeDatasources().join("\n").trim()}

//  Visualization Widgets  ---
${this.writeWidgets().trim()}

//  Dashboard Elements  ---
const ec = new ElementContainer();

${this.writeElements().trim()}

ec.refresh();

//  Dashboard (optional) ---
const dashboard = new Dashboard(ec)
    .target("placeholder")
    .render(w => {
        (w as Dashboard).layout(${stringify(this._dashboard.layout())});
    })
    ;
`;
    }
}
