import { CanvasWidget, Palette } from "@hpcc-js/common";

export class HeatSquares extends CanvasWidget {
    _maxLabelWidth: number;
    _calculatedFontSize: number;
    _squareW: number;
    _squareH: number;
    _xLabels: string[] = [];
    _yLabels: string[] = [];
    _x0: number;
    _y0: number;
    _palette;
    _min: number | undefined;
    _max: number | undefined;
    constructor() {
        super();
    }
    enter(domNode, element) {
        super.enter(domNode, element);
        this.resize(this._size);
    }
    update(domNode, element) {
        super.update(domNode, element);
        this._min = undefined;
        this._max = undefined;
        this._palette = Palette.rainbow(this.paletteID());
        this._maxLabelWidth = Math.max(...this.data().map(row => {
            if (typeof this._min === "undefined" || this._min > row[2]) this._min = row[2];
            if (typeof this._max === "undefined" || this._max > row[2]) this._max = row[2];
            return this.textSize(
                row[0],
                this.fontFamily(),
                this.fontSize()
            ).width;
        }));

        this._xLabels = [];
        this._yLabels = [];
        this.data().forEach(row => {
            if (this._xLabels.indexOf(row[0]) === -1) this._xLabels.push(row[0]);
            if (this._yLabels.indexOf(row[1]) === -1) this._yLabels.push(row[1]);
        });

        this._calculatedFontSize = this.fontSize();
        this.setDimensions(this._maxLabelWidth);

        this.drawLabels();
        this.drawSquares();
    }
    drawLabels() {
        this._ctx.textBaseline = "middle";
        this._ctx.textAlign = "right";
        this._ctx.font = `${this._calculatedFontSize}px ${this.fontFamily()}`;
        this._yLabels.forEach((yLabel, yi) => {
            const x = this._x0 - this.gutter();
            const y = this._y0 + ((yi + 0.5) * (this.gutter() + this._squareH));
            this._ctx.fillText(yLabel, x, y);
        });
        this._ctx.textAlign = "left";
        this._ctx.textBaseline = "top";
        this._xLabels.forEach((xLabel, xi) => {
            const x = this._x0 + ((xi) * (this.gutter() + this._squareW));
            const y = this._y0 - this.gutter();
            this._ctx.save();
            this._ctx.translate(x, y);
            this._ctx.rotate(-Math.PI / 2);
            this._ctx.fillText(xLabel, 0, 0);
            this._ctx.restore();
        });
    }
    drawSquares() {
        this._xLabels.forEach((xLabel, xi) => {
            this._yLabels.forEach((yLabel, yi) => {
                const x = this._x0 + ((this._squareW + this.gutter()) * xi);
                const y = this._y0 + ((this._squareH + this.gutter()) * yi);
                this._ctx.fillStyle = this._palette(this.getValue(xLabel, yLabel), this._min, this._max);
                this._ctx.fillRect(x, y, this._squareW, this._squareH);
            });
        });
    }
    getValue(xLabel: string, yLabel: string) {
        let val = 0;
        this.data()
            .filter(row => row[0] === xLabel)
            .filter(row => row[1] === yLabel)
            .forEach(row => {
                val = row[2]; // TODO: find a more efficient way to retrieve the values
            });
        return val;
    }
    setDimensions(maxLabelWidth, depth: number = 0) {
        const w = this.width();
        const h = this.height();

        const rawW = Math.floor(w - (this.gutter() * 3) - maxLabelWidth);
        const rawH = Math.floor(h - (this.gutter() * 3) - maxLabelWidth);

        const x0 = Math.ceil((this.gutter() * 2) + maxLabelWidth);
        const y0 = Math.ceil((this.gutter() * 2) + maxLabelWidth);

        const squareW = Math.floor(rawW / this._xLabels.length);
        const squareH = Math.floor(rawH / this._yLabels.length);
        if (this._calculatedFontSize > squareH) {
            if (depth === 0) {
                this._calculatedFontSize = 4;
                this.setDimensions(this.calcMaxLabelWidth(), depth + 1);
            } else {
                this._calculatedFontSize = this._calculatedFontSize - 1;
            }
        } else {
            this._x0 = x0;
            this._y0 = y0;
            this._squareH = squareH;
            this._squareW = squareW;
            this._maxLabelWidth = maxLabelWidth;
            if (this._calculatedFontSize + 1 <= this.fontSize()) {
                this._calculatedFontSize = this._calculatedFontSize + 1;
                this.setDimensions(this.calcMaxLabelWidth(), depth + 1);
            }
        }
    }
    calcMaxLabelWidth() {
        let max = 0;
        this._yLabels.forEach((yLabel, yi) => {
            const w = this.textSize(yLabel, this.fontFamily(), this._calculatedFontSize).width;
            if (max < w) {
                max = w;
            }
        });
        return max;
    }
}
HeatSquares.prototype._class += " chart_HeatSquares";

export interface HeatSquares {
    paletteID(): string;
    paletteID(_: string): this;
    fontFamily(): string;
    fontFamily(_: string): this;
    fontSize(): number;
    fontSize(_: number): this;
    gutter(): number;
    gutter(_: number): this;
}
HeatSquares.prototype.publish("fontSize", 20, "number", "Label font-size (fony-size may be smaller than specified depending on available space)");
HeatSquares.prototype.publish("fontFamily", "Verdana", "string", "Label font-family");
HeatSquares.prototype.publish("gutter", 1, "number", "Space between squares (pixels)");
HeatSquares.prototype.publish("paletteID", "default", "set", "Color palette for this widget", ["", ...Palette.rainbow("default").switch()], { optional: true });
