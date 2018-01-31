import { HTMLWidget } from "./HTMLWidget";
import { Widget } from "./Widget";

export class ProgressBar extends HTMLWidget {

    protected _wrapper;
    protected _bar;

    constructor() {
        super();
        this._tag = "div";
    }

    enter(domNode, element) {
        super.enter(domNode, element);
        this._wrapper = element.append("div").classed("progress-wrapper", true);
        this._bar = this._wrapper.append("div").classed("progress-bar", true);
    }

    update(domNode, element) {
        super.update(domNode, element);

    }

    exit(domNode, element) {
        super.exit(domNode, element);

    }
}
ProgressBar.prototype._class += " common_ProgressBar";
ProgressBar.prototype.implements(HTMLWidget.prototype);

export interface ProgressBar {
    show(): boolean;
    show(_: boolean): this;
    progress(): number;
    progress(_: number): this;
    color(): string;
    color(_: string): this;
    speed(): number;
    speed(_: number): this;
    targetWidget(): Widget;
    targetWidget(_: Widget): this;
}

ProgressBar.prototype.publish("show", false, "boolean", "show");
ProgressBar.prototype.publish("progress", 0, "number", "progress");
ProgressBar.prototype.publish("color", "#1a99d5", "html-color", "color");
ProgressBar.prototype.publish("speed", 5000, "number", "ms to half of remaining time");
ProgressBar.prototype.publish("targetWidget", null, "widget", "targetWidget");
