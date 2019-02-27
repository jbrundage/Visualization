import { HTMLWidget } from "./HTMLWidget";

export class CanvasWidget extends HTMLWidget {
    _ctx: CanvasRenderingContext2D;
    constructor() {
        super();
        this._tag = "canvas";
    }

    enter(domNode, element) {
        super.enter(domNode, element);
        this._element.attr("width", this._size.width);
        this._element.attr("height", this._size.height);
        this._ctx = domNode.getContext("2d");
    }

    resize(size) {
        const retVal = super.resize(size);
        this._element.attr("width", this._size.width);
        this._element.attr("height", this._size.height);
        this._ctx = this._element.node().getContext("2d");
        return retVal;
    }

    click(d, c) {
        console.log(d);
    }
}
CanvasWidget.prototype._class += " common_CanvasWidget";
