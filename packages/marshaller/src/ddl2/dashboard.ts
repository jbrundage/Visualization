
import { d3SelectionType } from "@hpcc-js/common";
import { DockPanel } from "@hpcc-js/phosphor";
import { compare } from "@hpcc-js/util";
import { ElementContainer } from "./viz";

export class Dashboard extends DockPanel {
    private _elements: ElementContainer = new ElementContainer();

    syncWidgets() {
        const previous = this.widgets();
        const diff = compare(previous, this._elements.visualizations().map(viz => viz.widget()));
        for (const w of diff.removed) {
            this.removeWidget(w);
        }
        for (const w of diff.added) {
            this.addWidget(w, this._elements.visualization(w).title(), "split-bottom");
        }
        for (const w of diff.unchanged) {
            const wa: any = this.getWidgetAdapter(w);
            wa.title.label = this._elements.visualization(w).title();
        }
    }

    update(domNode: HTMLElement, element: d3SelectionType) {
        this.syncWidgets();
        super.update(domNode, element);
    }
}
Dashboard.prototype._class += " dashboard_dashboard";
