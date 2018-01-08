import { ClassMeta, PropertyExt } from "@hpcc-js/common";
import { Activity, stringify } from "./activities/activity";
import { Databomb, Form } from "./activities/databomb";
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

export function createProps(pe: PropertyExt): { [key: string]: any } {
    const retVal: { [key: string]: any } = {};
    for (const meta of pe.publishedProperties()) {
        if ((pe as any)[meta.id + "_modified"]() && meta.id !== "fields") {
            retVal[meta.id] = (pe as any)[meta.id]();
        }
    }
    return retVal;
}

interface WidgetMeta extends ClassMeta {
    js: string;
}

function joinWithPrefix(arr: string[], joinStr: string, postFix: string = ""): string {
    return arr.length ? `${joinStr}${arr.join(joinStr)}${postFix}` : "";
}

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
                            retVal.push(`${prefix}.${meta.id}([${(pe as any)[meta.id]()}])${postfix};`);
                        break;
                    default:
                        break;
                }
            }
        }
        return retVal;
    }

    writeDSActivity(activity: DSPicker): string {
        const dsID = activity.id();
        const details = activity.details();
        if (details instanceof WUResult) {
            return `
const ${dsID} = new WUResult()
    .url("${details.url()}")
    .wuid("${details.wuid()}")
    .resultName("${details.resultName()}")
    ;
`.trim();
        } else if (details instanceof LogicalFile) {
            return `
const ${dsID} = new LogicalFile()
    .url("${details.url()}")
    .logicalFile("${details.logicalFile()}")
    ;
`.trim();
        } else if (details instanceof RoxieRequest) {
            return `
const ${dsID} = new RoxieRequest(ec)
    .url("${details.url()}")
    .querySet("${details.querySet()}")
    .queryID("${details.queryID()}")
    .resultName("${details.resultName()}")
    .requestFields(${stringify(details.requestFields())})
    ;
`.trim();
        } else if (details instanceof Databomb) {
            return `
const ${dsID} = new Databomb()
    .payload(${stringify(details.payload())})
    ;
`.trim();
        } else if (details instanceof Form) {
            return `
const ${dsID} = new Form()
    .payload(${JSON.stringify(details.payload())})
    ;
`.trim();
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

    private writeWidgetProps(pe: PropertyExt): string[] {
        const retVal: string[] = [];
        for (const meta of pe.publishedProperties()) {
            if ((pe as any)[meta.id + "_modified"]() && meta.id !== "fields") {
                retVal.push(`.${meta.id}(${JSON.stringify((pe as any)[meta.id]())})`);
            }
        }
        return retVal;
    }

    private writeWidget(element: Element): WidgetMeta {
        const multiChartPanel = element.multiChartPanel();
        const chart = multiChartPanel.chart();
        const meta = chart.classMeta();
        const props = this.writeWidgetProps(chart);
        const vizID = multiChartPanel.id();
        return {
            ...chart.classMeta(),
            js: `
const ${vizID} = new ChartPanel()
    .id("${vizID}")
    .title("${element.chartPanel().title()}")
    .widget(new ${meta.className}()${joinWithPrefix(props, "\n        ", "\n    ")})
    ;
`.trim()
        };
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
        const vizID = element.chartPanel().id();
        return `
const ${element.id()} = new Element(ec)
    .id("${element.id()}")
    .pipeline([
        ${activities.join(",\n        ")}
    ])
    .chartPanel(${vizID})
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

    writeWidgets(): { widgetImports: string, widgetDefs: string } {
        const widgetImport: { [moduleID: string]: { [classID: string]: boolean } } = {};
        const jsDef: string[] = [];
        for (const element of this._elementContainer.elements()) {
            const widgetMeta = this.writeWidget(element);
            if (!widgetImport[widgetMeta.moduleName]) {
                widgetImport[widgetMeta.moduleName] = {};
            }
            widgetImport[widgetMeta.moduleName][widgetMeta.className] = true;
            jsDef.push(widgetMeta.js);
        }
        const importJS: string[] = [];
        for (const moduleID in widgetImport) {
            const classIDs: string[] = [];
            for (const classID in widgetImport[moduleID]) {
                classIDs.push(classID);
            }
            classIDs.sort();
            importJS.push(`import { ${classIDs.join(", ")} } from "${moduleID}";`);
        }
        return {
            widgetImports: importJS.join("\n"),
            widgetDefs: jsDef.join("\n\n")
        };
    }

    writeElements(): string {
        let retVal = "";
        for (const element of this._elementContainer.elements()) {
            retVal += this.writeElement(element);
        }
        return retVal;
    }

    createJavaScript(): string {
        const widgets = this.writeWidgets();

        return `
${widgets.widgetImports}
import { ChartPanel } from "@hpcc-js/layout";
import { Dashboard, Databomb, Element, ElementContainer, Filters, Form, GroupBy, Limit, LogicalFile, Project, RoxieRequest, Sort, WUResult } from "@hpcc-js/marshaller";

//  Dashboard Element Container (Model)  ---
const ec = new ElementContainer();

//  Data Sources  ---
${this.writeDatasources().join("\n").trim()}

//  Visualization Widgets (View) ---
${widgets.widgetDefs}

//  Dashboard Elements  (Controller) ---
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
