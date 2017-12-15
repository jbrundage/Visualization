import { PropertyExt } from "@hpcc-js/common";
import { Activity } from "./activities/activity";
import { DSPicker } from "./activities/dspicker";
import { Filters } from "./activities/filter";
import { GroupBy } from "./activities/groupby";
import { Limit } from "./activities/limit";
import { Sort } from "./activities/sort";
import { WUResult } from "./activities/wuresult";
import { Element, ElementContainer } from "./viz";

export class JavaScriptAdapter {
    private _dashboard: ElementContainer;

    constructor(dashboard: ElementContainer) {
        this._dashboard = dashboard;
    }

    dummy(viz: Element) {
        const dashboard = new ElementContainer();
        const viz0 = new Element(dashboard)
            .title(viz.title())
            ;
        viz0;
    }

    createDashboard() {
        const retVal = `const dashboard = new Dashboard();\n`;
        return retVal;
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

    writeActivity(activity: Activity): string {
        if (activity instanceof DSPicker) {
            activity = activity.details();
        }
        if (activity instanceof WUResult) {
            return activity.toJS();
        } else if (activity instanceof GroupBy) {
            return activity.toJS();
        } else if (activity instanceof Sort) {
            return activity.toJS();
        } else if (activity instanceof Limit) {
            return activity.toJS();
        } else if (activity instanceof Filters) {
            return activity.toJS();
        }
        return `new ${activity.classID()}()`;
    }

    writeVisualization(vizID: string, viz: Element) {
        const activities: string[] = [];
        for (const activity of viz.view().activities()) {
            if (activity.exists()) {
                activities.push(this.writeActivity(activity));
            }
        }
        const widget = `new ChartPanel().chartType("${viz.widget().chartType()}")`;
        return `
const ${vizID} = new Element(dashboard)
    .pipeline([
        ${activities.join(",\n        ")}
    ])
    .widget(${widget})
    ;
${vizID}.refresh();

visualizations.push(${ vizID});
`;
    }

    writeVisualizations() {
        let retVal = "";
        let vizID = 0;
        for (const viz of this._dashboard.visualizations()) {
            retVal += this.writeVisualization(`viz_${vizID++}`, viz);
        }
        return retVal;
    }

    createJavaScript(): string {
        return `
import { ChartPanel } from "@hpcc-js/composite";
import { Dashboard, Element, GroupBy, Limit, Sort, WUResult } from "@hpcc-js/marshaller";

const dashboard = new Dashboard()
    .target("placeholder")
    ;

const visualizations = [];
${this.writeVisualizations()}
dashboard
    .addVisualizations(visualizations)
    .render()
    ;
`;
    }
}
