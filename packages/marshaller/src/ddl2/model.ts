import { PropertyExt, publish, publishProxy, Widget } from "@hpcc-js/common";
import { ChartPanel } from "@hpcc-js/composite";
import { find } from "@hpcc-js/util";
import { Activity } from "./activities/activity";
import { HipiePipeline } from "./activities/hipiepipeline";
import { DDL2, DDLAdapter } from "./ddl";
import { DDLImport } from "./ddlimport";

export class State extends PropertyExt {

    constructor() {
        super();
        this.selection([]);
    }

    removeInvalid(data: object[]) {
        const newSelection: object[] = [];
        for (const selRow of this.selection()) {
            if (find(data, (row: { [key: string]: any }, index): boolean => {
                for (const column in selRow) {
                    if (selRow[column] !== row[column]) {
                        return false;
                    }
                }
                return true;
            })) {
                newSelection.push(selRow);
            }
        }
        this.selection(newSelection);
    }
}
State.prototype._class += " State";
export interface State {
    selection(): Array<{ [key: string]: any }>;
    selection(_: Array<{ [key: string]: any }>): this;
}
State.prototype.publish("selection", [], "array", "State");

let vizID = 0;
export class Element extends PropertyExt {
    private _elementContainer: ElementContainer;
    private _chartPanel: ChartPanel = new ChartPanel();

    @publishProxy("_chartPanel")
    title: publish<this, string>;
    @publish(null, "widget", "Data View")
    view: publish<this, HipiePipeline>;
    @publish(null, "widget", "Visualization")
    _widget: ChartPanel;
    widget(): ChartPanel;
    widget(_: ChartPanel): this;
    widget(_?: ChartPanel): ChartPanel | this {
        if (!arguments.length) return this._widget;
        this._widget = _;
        this._widget
            .on("click", (row: object, col: string, sel: boolean) => {
                this.state().selection(sel ? [row] : []);
            })
            ;
        return this;
    }
    @publish(null, "widget", "State")
    state: publish<this, State>;

    constructor(ec: ElementContainer) {
        super();
        this._elementContainer = ec;
        vizID++;
        this._id = `element_${vizID}`;
        const view = new HipiePipeline(ec, `pipeline_${vizID}`);
        this.view(view);
        this._chartPanel
            .id(`viz_${vizID}`)
            .title(this.id())
            .chartType("TABLE")
            ;
        this.widget(this._chartPanel);
        this.state(new State());
    }

    id(): string;
    id(_: string): this;
    id(_?: string): string | this {
        const retVal = super.id.apply(this, arguments);
        if (arguments.length) {
            this._chartPanel.id(_);
        }
        return retVal;
    }

    pipeline(activities: Activity[]): this {
        this.view().activities(activities);
        return this;
    }

    dataProps(): PropertyExt {
        return this.view();
    }

    vizProps(): Widget {
        return this.widget();
    }

    stateProps(): PropertyExt {
        return this.state();
    }

    async refresh() {
        const view = this.view();
        await view.refreshMeta();
        const columns = view.outFields().map(field => field.label);
        const data = await view.fetch();
        const mappedData = data.map(row => {
            const retVal = [];
            for (const column of columns) {
                retVal.push(row[column]);
            }
            return retVal;
        });
        this.widget()
            .columns(columns)
            .data(mappedData)
            .lazyRender()
            ;
        this.state().removeInvalid(data);
    }

    //  Events  ---
    selectionChanged() {
        const promises: Array<Promise<void>> = [];
        for (const filteredViz of this._elementContainer.filteredBy(this)) {
            promises.push(filteredViz.refresh());
        }
        Promise.all(promises).then(() => {
            this._elementContainer.vizStateChanged(this);
        });
    }

    monitor(func: (id: string, newVal: any, oldVal: any, source: PropertyExt) => void): { remove: () => void; } {
        return this.view().monitor(func);
    }
}
Element.prototype._class += " Viz";

export interface IPersist {
    ddl: DDL2.Schema;
    layout: any;
}

export class ElementContainer extends PropertyExt {
    private _elements: Element[] = [];
    private _nullElement = new Element(this);

    clear() {
        this._elements = [];
    }

    elements() {
        return [...this._elements];
    }

    element(w: string | PropertyExt): Element {
        let retVal: Element[];
        if (typeof w === "string") {
            retVal = this._elements.filter(viz => viz.id() === w);
        } else {
            retVal = this._elements.filter(v => v.vizProps() === w);
        }
        if (retVal.length) {
            return retVal[0];
        }
        return this._nullElement;
    }

    elementIDs() {
        return this._elements.map(viz => viz.id());
    }

    append(element: Element): this {
        this._elements.push(element);
        element.state().monitorProperty("selection", () => {
            element.selectionChanged();
        });
        return this;
    }

    filteredBy(viz: Element): Element[] {
        return this._elements.filter(otherViz => {
            const filterIDs = otherViz.view().updatedBy();
            return filterIDs.indexOf(viz.id()) >= 0;
        });
    }

    views(): HipiePipeline[] {
        return this._elements.map(viz => viz.view());
    }

    view(id: string): HipiePipeline | undefined {
        return this.views().filter(view => view.id() === id)[0];
    }

    ddl(): DDL2.Schema;
    ddl(_: DDL2.Schema): this;
    ddl(_?: DDL2.Schema): DDL2.Schema | this {
        const ddlAdapter = new DDLAdapter(this);
        if (!arguments.length) return ddlAdapter.write();
        this.clear();
        ddlAdapter.read(_);
        return this;
    }

    importV1DDL(url: string, ddlObj: any) {
        const ddl = new DDLImport(this, url, ddlObj);
        ddl;
    }

    async refresh(): Promise<this> {
        await Promise.all(this.elements().map(viz => viz.refresh()));
        return this;
    }

    //  Events  ---
    vizStateChanged(viz: Element) {
    }
}
ElementContainer.prototype._class += " dashboard_ElementContainer";
