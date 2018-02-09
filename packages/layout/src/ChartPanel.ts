import { publish, publishProxy, Utility, Widget } from "@hpcc-js/common";
import { Border2 } from "./Border2";
import { Legend } from "./Legend";
import { Button, IClickHandler, Item, Spacer, TitleBar, ToggleButton } from "./TitleBar";

export class ChartPanel extends Border2 implements IClickHandler {

    private _toggleLegend: ToggleButton = new ToggleButton(this, "fa-info").selected(false);
    private _buttonDownload: Button = new Button(this, "fa-download");

    private _titleBar = new TitleBar();

    private _legend = new Legend(this);

    @publishProxy("_titleBar", undefined, undefined, { reset: true })
    title: publish<this, string>;
    @publish(5000, "number", "progressHalflife")
    progressHalflife: { (): number; (_: number): ChartPanel; };
    @publish(1.2, "number", "progressDecay")
    progressDecay: { (): number; (_: number): ChartPanel; };
    @publish(2, "number", "progressSize")
    progressSize: { (): number; (_: number): ChartPanel; };
    @publish(50, "number", "progressBlurSize")
    progressBlurSize: { (): number; (_: number): ChartPanel; };
    @publish("#7bed9f", "string", "progressHexBlurColor")
    progressHexBlurColor: { (): string; (_: string): ChartPanel; };
    @publish(0.35, "number", "progressBlurOpacity")
    progressBlurOpacity: { (): number; (_: number): ChartPanel; };
    @publish("#2ed573", "string", "progressHexColor")
    progressHexColor: { (): string; (_: string): ChartPanel; };
    @publish(true, "boolean", "progressBarBlur")
    progressBarBlur: { (): boolean; (_: boolean): ChartPanel; };
    @publish(null, "widget", "Multi Chart")
    _widget: Widget;
    widget(): Widget;
    widget(_: Widget): this;
    widget(_?: Widget): Widget | this {
        if (!arguments.length) return this._widget;
        this._widget = _;

        const context = this;
        const tmpAny = this._widget as any;
        tmpAny.click = function () {
            context.click.apply(context, arguments);
        };
        tmpAny.dblclick = function () {
            context.dblclick.apply(context, arguments);
        };
        tmpAny.vertex_click = function () {
            context.vertex_click.apply(context, arguments);
        };
        tmpAny.vertex_dblclick = function () {
            context.vertex_dblclick.apply(context, arguments);
        };
        tmpAny.edge_click = function () {
            context.edge_click.apply(context, arguments);
        };
        tmpAny.edge_dblclick = function () {
            context.edge_dblclick.apply(context, arguments);
        };
        return this;
    }

    constructor() {
        super();
        this._tag = "div";
        this._titleBar.buttons([this._buttonDownload, new Spacer(this), this._toggleLegend]);
    }

    columns(): string[];
    columns(_: string[], asDefault?: boolean): this;
    columns(_?: string[], asDefault?: boolean): string[] | this {
        if (!arguments.length) return this._widget.columns();
        this._legend.columns(_, asDefault);
        return this;
    }

    data(_?) {
        if (!arguments.length) return this._widget.data();
        this._legend.data(_);
        return this;
    }

    downloadCSV() {
        Utility.downloadBlob("CSV", this._widget.export("CSV"));
        return this;
    }

    enter(domNode, element) {
        super.enter(domNode, element);

        this.top(this._titleBar);
        this.center(this._widget);
        this.right(this._legend);

        this._legend
            .targetWidget(this._widget)
            .orientation("vertical")
            .title("")
            .visible(false)
            ;
    }

    private _prevChartDataFamily;
    update(domNode, element) {
        this._widget
            .columns(this._legend.filteredColumns())
            .data(this._legend.filteredData())
            ;
        if (this._prevChartDataFamily !== "ND") { // this._widget.getChartDataFamily()) {
            this._prevChartDataFamily = "ND"; // this._widget.getChartDataFamily();
            switch (this._prevChartDataFamily) {
                case "any":
                    this._toggleLegend.selected(false);
                    this._legend.visible(false);
                    break;
            }
        }
        this._legend.dataFamily("ND"); // this._widget.getChartDataFamily());
        super.update(domNode, element);
    }

    exit(domNode, element) {
        super.exit(domNode, element);
    }

    // IClickHandler  ---
    titleBarClick(src: Item, d, idx: number, groups): void {
        switch (src) {
            case this._buttonDownload:
                this.downloadCSV();
                break;
            case this._toggleLegend:
                if (this._toggleLegend.selected()) {
                    this._legend.visible(true);
                } else {
                    this._legend.visible(false);
                }
                this.render();
                break;
        }
    }

    startMyProgress() {
        this.startProgress(this.target());
    }
    finishMyProgress() {
        this.updateProgress(this.target(), 1000, 100);
    }
    exitMyProgress() {
        this.exitProgress(this.target());
    }
    startThatProgress(elm) {
        this.startProgress(elm);
    }
    finishThatProgress(elm) {
        this.updateProgress(elm, 1000, 100);
    }
    finishProgress(elm) {
        var halflife = this.progressHalflife();
        elm.progress_stopped = false;
        this.updateProgress(elm, halflife, 3);
    }
    startProgress(elm) {
        var halflife = this.progressHalflife();
        elm.progress_stopped = false;
        this.updateProgress(elm, halflife, 10);
    }
    exitProgress(elm) {
        elm.progress_stopped = true;
        var element = document.getElementById('hpccjs-progress-style-for-' + elm.id);
        if (element) element.parentNode.removeChild(element);
    }
    updateProgress(elm, halflife, perc) {
        var percLimit = 95;
        halflife *= this.progressDecay();
        var bar_size = this.progressSize();
        var bar_color = this.progressHexColor();
        perc = perc ? perc : 10;
        var _id = elm.id;
        var _style_id = 'hpccjs-progress-style-for-' + _id;
        if (!!elm.progress_stopped) {
            return;
        }
        var context = this;
        var _style = document.getElementById(_style_id);
        if (_style) {
            _style.innerHTML = _styles();
        } else {
            _style = document.createElement("style");
            _style.id = _style_id;
            _style.innerHTML = _styles();
            elm.insertBefore(_style, elm.firstChild);
        }
        if (perc < percLimit) {
            setTimeout(function () {
                var _remaining = 100 - perc;
                context.updateProgress(elm, halflife, perc + (_remaining / 2));
            }, perc === 10 ? 100 : halflife);
        } else if (perc === 100) {
            setTimeout(function () {
                context.exitProgress(elm);
            }, halflife);
        }
        function _styles() {
            const blur_opacity = context.progressBlurOpacity();
            const blur_opacity_hex = blur_opacity * 255 >= 16 ? parseInt(blur_opacity * 255).toString(16).slice(-2) : '00';
            const blur_color = context.progressHexBlurColor() ? context.progressHexBlurColor() : bar_color;
            const blur_size = context.progressBlurSize();
            const blur_fx = context.progressBarBlur() ? `background: radial-gradient(ellipse at 50% 50%, ${blur_color}${blur_opacity_hex}, ${blur_color}00, #00000000 ${blur_size}px);` : '';
            return `
                #${_id}::before{
                    content:" ";display:block;position:absolute;
                    height:${bar_size}px;width:${perc}%;
                    left:0;top:0;
                    background-color: ${bar_color};
                    transition: width ${(halflife / 1000)}s;
                }
                #${_id}::after{
                    content:" ";display:block;position:absolute;
                    height:${blur_size}px;width:${blur_size * 2}px;
                    left:calc(${perc}% - ${blur_size}px);
                    top:${-((blur_size / 2) - (bar_size / 2))}px;
                    background-color: ${bar_color};
                    transition: left ${(halflife / 1000)}s;
                    transform: rotate(1deg) translate(-${blur_size / 2.5}px,0px) scale(1.5,0.5);
                    ${blur_fx}
                }
            `;
        }
    }

    //  Event Handlers  ---
    //  Events  ---
    click(row, column, selected) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column + ", " + selected);
    }

    dblclick(row, column, selected) {
        console.log("Double click:  " + JSON.stringify(row) + ", " + column + ", " + selected);
    }

    vertex_click(row, col, sel, more) {
        if (more && more.vertex) {
            console.log("Vertex click: " + more.vertex.id());
        }
    }

    vertex_dblclick(row, col, sel, more) {
        if (more && more.vertex) {
            console.log("Vertex double click: " + more.vertex.id());
        }
    }

    edge_click(row, col, sel, more) {
        if (more && more.edge) {
            console.log("Edge click: " + more.edge.id());
        }
    }

    edge_dblclick(row, col, sel, more) {
        if (more && more.edge) {
            console.log("Edge double click: " + more.edge.id());
        }
    }
}
ChartPanel.prototype._class += " layout_ChartPanel";
