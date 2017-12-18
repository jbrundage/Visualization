
import { d3SelectionType, Widget } from "@hpcc-js/common";
import { DockPanel } from "@hpcc-js/phosphor";
import { compare } from "@hpcc-js/util";
import { JavaScriptAdapter } from "./javascriptadapter";
import { Element, ElementContainer } from "./model";

export class Dashboard extends DockPanel {
    private _ec: ElementContainer;

    constructor(ec: ElementContainer) {
        super();
        this._ec = ec;
        this._ec.on("vizStateChanged", this.vizStateChanged);
    }

    elementContainer(): ElementContainer {
        return this._ec;
    }

    javascript(): string {
        const ddlAdapter = new JavaScriptAdapter(this);
        return ddlAdapter.createJavaScript();
    }

    syncWidgets() {
        const previous = this.widgets();
        const diff = compare(previous, this._ec.elements().map(viz => viz.widget()));
        for (const w of diff.removed) {
            this.removeWidget(w);
        }
        for (const w of diff.added) {
            const element: Element = this._ec.element(w);
            this.addWidget(w, element.title(), "split-bottom");
        }
        for (const w of diff.unchanged) {
            const wa: any = this.getWidgetAdapter(w);
            wa.title.label = this._ec.element(w).title();
        }
    }

    update(domNode: HTMLElement, element: d3SelectionType) {
        this.syncWidgets();
        super.update(domNode, element);
    }

    //  Events  ---
    childActivation(w: Widget) {
        super.childActivation(w);
        this.vizActivation(this._ec.element(w));
    }

    vizActivation(viz: Element) {
    }

    vizStateChanged(viz: Element) {
    }
}
Dashboard.prototype._class += " dashboard_dashboard";
