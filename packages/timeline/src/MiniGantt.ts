import { ITooltip } from "@hpcc-js/api";
import { Axis } from "@hpcc-js/chart";
import { EntityCard, EntityPin, publish, SVGWidget, Utility } from "@hpcc-js/common";
import { extent as d3Extent } from "d3-array";
import { scaleBand as d3ScaleBand } from "d3-scale";
import { event as d3Event, local as d3Local, select as d3Select } from "d3-selection";
import { timeFormat as d3TimeFormat } from "d3-time-format";
import { zoom as d3Zoom, zoomIdentity as d3ZoomIdentity } from "d3-zoom";

import "../src/MiniGantt.css";

export class MiniGantt extends SVGWidget {
    protected tlAxis: Axis;
    protected brAxis: Axis;
    protected verticalBands;
    protected _zoom;
    protected gUpperContent;
    protected gUpperAxis;
    protected gMiddleContent;
    protected gLowerAxis;
    protected gLowerContent;
    private localCard = d3Local<EntityCard>();
    private localEntityPin = d3Local<EntityPin>();
    private tooltipFormatter: (date: Date) => string;

    protected rootExtent;
    protected _title_idx = 0;
    protected _startDate_idx = 1;
    protected _endDate_idx = 2;
    protected _icon_idx = 3;
    protected _color_idx = 4;

    constructor() {
        super();
        ITooltip.call(this);
        Utility.SimpleSelectionMixin.call(this);

        this._drawStartPos = "origin";
        this.tooltipHTML((d: any) => `<center>${d[this._title_idx]}</center><br>${this.tooltipFormatter(this.brAxis.parse(d[this._startDate_idx]))} -> ${this.tooltipFormatter(this.brAxis.parse(d[this._endDate_idx]))}`);

        this.tlAxis = new Axis()
            .type("time")
            ;
        this.brAxis = new Axis()
            .type("time")
            ;
        this.verticalBands = d3ScaleBand()
            .paddingOuter(0.2)
            .paddingInner(0.2)
            ;
    }

    isHorizontal(): boolean {
        return this.orientation() === "horizontal";
    }

    fullExtent() {
        const data = [...this.data().map(d => d[this._startDate_idx]), ...this.data().filter(d => !!d[this._endDate_idx]).map(d => d[this._endDate_idx])];
        return d3Extent(data);
    }

    extent() {
        if (this.rootExtent) {
            return [this.rootExtent[1], this.rootExtent[2]];
        }
        return this.fullExtent();
    }

    dataStartPos(d) {
        return this.brAxis.scalePos(d[this._startDate_idx]);
    }

    dataEndPos(d) {
        return this.brAxis.scalePos(d[this._endDate_idx]);
    }

    dataWidth(d) {
        return this.dataEndPos(d) - this.dataStartPos(d);
    }

    private transform;
    resetZoom() {
        //  Triggers a "zoomed" event ---
        this._zoom.transform(this.element(), d3ZoomIdentity.translate(0, this.isHorizontal() ? 0 : this.height()));
    }

    zoomed() {
        this.transform = d3Event.transform;
        this.render();
    }

    private background;
    enter(domNode, element) {
        super.enter(domNode, element);
        this._zoom = d3Zoom()
            .on("zoom", () => {
                this.zoomed();
            })
            ;

        this.background = element.append("rect")
            .attr("fill", "white")
            .attr("opacity", 0)
            .on("dblclick", () => {
                d3Event.stopPropagation();
                delete this.rootExtent;
                this.resetZoom();
            })
            ;
        this.gUpperContent = element.append("g").attr("class", "gUpperContent");
        this.gUpperAxis = element.append("g").attr("class", "gUpperAxis");
        this.gMiddleContent = element.append("g").attr("class", "gMiddleContent");
        this.gLowerAxis = element.append("g").attr("class", "gLowerAxis");
        this.gLowerContent = element.append("g").attr("class", "gLowerContent");
        this.tlAxis
            .target(this.gUpperAxis.node())
            .tickFormat(this.tickFormat())
            .guideTarget(this.gUpperAxis.append("g").node())
            .shrinkToFit("none")
            .overlapMode("stagger")
            .extend(0.1)
            ;
        this.brAxis
            .target(this.gLowerAxis.node())
            .tickFormat(this.tickFormat())
            .guideTarget(this.gLowerAxis.append("g").node())
            .shrinkToFit("none")
            .extend(0.1)
            ;

        element.call(this._zoom);
        this._selection.widgetElement(this.gMiddleContent);
    }

    private _prevIsHorizontal;
    update(domNode, element) {
        super.update(domNode, element);

        this._title_idx = this.titleColumn() !== null ? this.columns().indexOf(this.titleColumn()) : this._title_idx;
        this._startDate_idx = this.startDateColumn() !== null ? this.columns().indexOf(this.startDateColumn()) : this._startDate_idx;
        this._endDate_idx = this.endDateColumn() !== null ? this.columns().indexOf(this.endDateColumn()) : this._endDate_idx;
        this._icon_idx = this.iconColumn() !== null ? this.columns().indexOf(this.iconColumn()) : this._icon_idx;
        this._color_idx = this.colorColumn() !== null ? this.columns().indexOf(this.colorColumn()) : this._color_idx;

        if (this._prevIsHorizontal !== this.isHorizontal()) {
            this._prevIsHorizontal = this.isHorizontal();
            this.resetZoom();
            return;
        }

        this.tooltipFormatter = d3TimeFormat(this.tooltipTimeFormat());

        const width = this.width();
        const height = this.height();

        this.background
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            ;

        const extent = this.extent();
        this.tlAxis
            .x(width / 2)
            .orientation(this.isHorizontal() ? "top" : "left")
            .reverse(!this.isHorizontal())
            .timePattern(this.timePattern())    //  "%Y-%m-%dT%H:%M:%S.%LZ"
            .width(width - 1)
            .low(extent[0])
            .high(extent[1])
            .updateScale()
            ;

        this.brAxis
            .x(width / 2)
            .y(height / 2)
            .orientation(this.isHorizontal() ? "bottom" : "right")
            .reverse(!this.isHorizontal())
            .timePattern(this.timePattern())    //  "%Y-%m-%dT%H:%M:%S.%LZ"
            .width(width - 1)
            .height(height)
            .low(extent[0])
            .high(extent[1])
            .updateScale()
            ;

        if (this.transform) {
            let low;
            let hi;
            if (this.isHorizontal()) {
                low = this.tlAxis.parseInvert(this.tlAxis.invert(this.transform.invertX(0)));
                hi = this.tlAxis.parseInvert(this.tlAxis.invert(this.transform.invertX(width - 1)));
            } else {
                low = this.tlAxis.parseInvert(this.tlAxis.invert(- this.transform.invertY(0)));
                hi = this.tlAxis.parseInvert(this.tlAxis.invert(- this.transform.invertY(height - 1)));
            }
            this.tlAxis
                .low(low)
                .high(hi)
                .updateScale()
                ;
            this.brAxis
                .low(low)
                .high(hi)
                .updateScale()
                ;
        }

        const data = this.data().sort(this.isHorizontal() ? (l, r) => {
            const retVal = this.brAxis.scalePos(l[1]) - this.brAxis.scalePos(r[1]);
            if (retVal === 0) {
                return ("" + l[0]).localeCompare("" + r[0]);
            }
            return retVal;
        } : (l, r) => {
            return this.brAxis.scalePos(r[1]) - this.brAxis.scalePos(l[1]);
        });
        const events = data.filter(d => !d[this._endDate_idx]);
        const ranges = data.filter(d => !!d[this._endDate_idx]);

        this.brAxis
            .render()
            ;
        const brAxisBBox = this.brAxis.getBBox();

        const upperContentHeight = this.updateEntityPins(events);
        const upperAxisHeight = 28; // this.gUpperAxis.node().getBBox().height;
        const lowerHeight = height - upperContentHeight;
        console.log("upperHeight", upperContentHeight);

        if (events.length > 0 && ranges.length === 0) {
            // ONLY EVENTS
            this.gUpperAxis.attr("display", "none");
            this.gUpperContent.attr("transform", `translate(0, ${(height / 2)})`);
            this.gLowerAxis.attr("transform", `translate(0, -${(height / 2) - upperAxisHeight})`);
        } else if (events.length === 0 && ranges.length > 0) {
            // ONLY RANGES
            this.gUpperAxis.attr("display", "block");
            this.gUpperContent.attr("transform", `translate(0, ${upperContentHeight})`);
            this.gUpperAxis.attr("transform", `translate(0, ${upperContentHeight})`);
        } else {
            // BOTH
            this.gUpperAxis.attr("display", "block");
            this.gUpperContent.attr("transform", `translate(0, ${upperContentHeight})`);
            this.gUpperAxis.attr("transform", `translate(0, ${upperContentHeight})`);
            this.gMiddleContent.attr("transform", `translate(0, ${upperContentHeight})`);
        }

        this.tlAxis
            .render()
            ;
        const tlAxisBBox = this.tlAxis.getBBox();
        interface BucketInfo {
            endPos: number;
        }
        const bucketData: BucketInfo[] = [];
        const bucketIndex = {};
        for (const range of ranges) {
            for (let i = 0; i < bucketData.length; ++i) {
                const bucket = bucketData[i];
                if (bucket.endPos + this.overlapTolerence() <= this.dataStartPos(range)) {
                    bucketIndex[range] = i;
                    bucket.endPos = this.dataEndPos(range);
                    break;
                }
            }

            if (bucketIndex[range] === undefined) {
                bucketIndex[range] = bucketData.length;
                bucketData.push({
                    endPos: this.dataEndPos(range)
                });
            }
        }

        const vbLower = this.isHorizontal() ? 0 + tlAxisBBox.height : 0 + tlAxisBBox.width;
        const vbHigher = this.isHorizontal() ? lowerHeight - brAxisBBox.height : width - brAxisBBox.width;
        this.verticalBands
            .range([vbLower, vbHigher])
            .domain(bucketData.map((_d, i) => i))
            ;

        if (ranges.length > 0) {
            this.updateEventRanges(events, ranges, bucketIndex, lowerHeight, tlAxisBBox, brAxisBBox, width);
        }
    }

    updateEntityPins(events) {
        let event_height = 0;
        const context = this;
        const entityPins = this.gUpperContent.selectAll(".entity_pin").data(events);
        const eventFontColor_idx = this.eventFontColorColumn() ? this.columns().indexOf(this.eventFontColorColumn()) : -1;
        const eventBorderColor_idx = this.eventBorderColorColumn() ? this.columns().indexOf(this.eventBorderColorColumn()) : -1;
        const eventBackgroundColor_idx = this.eventBackgroundColorColumn() ? this.columns().indexOf(this.eventBackgroundColorColumn()) : -1;
        entityPins.enter().append("g")
            .attr("class", "entity_pin")
            .on("mouseover", function (d) {
                d3Select(this).raise();
            })
            .each(function (d, i) {
                const entityPin = new EntityPin()
                    .target(this)
                    .icon("")
                    .iconOnlyShowOnHover(false)
                    .titleOnlyShowOnHover(true)
                    .descriptionOnlyShowOnHover(true)
                    .annotationOnlyShowOnHover(true)
                    .iconDiameter(18)
                    .iconPaddingPercent(1)
                    .titleFontSize(14)
                    .descriptionColor("#333")
                    .descriptionFontSize(15)
                    .iconColor(eventFontColor_idx === -1 ? "#333" : d[eventFontColor_idx])
                    .titleColor(eventFontColor_idx === -1 ? "#333" : d[eventFontColor_idx])
                    .descriptionColor(eventFontColor_idx === -1 ? "#333" : d[eventFontColor_idx])
                    .backgroundShape("pin")
                    .backgroundColorFill(eventFontColor_idx === -1 ? "#f8f8f8" : d[eventBackgroundColor_idx])
                    .backgroundColorStroke(eventFontColor_idx === -1 ? "#ccc" : d[eventBorderColor_idx])
                    .cornerRadius(5)
                    .arrowHeight(10)
                    .arrowWidth(16)
                    ;
                context.localEntityPin.set(this, entityPin);
            })
            .merge(entityPins)
            .each(function (d, i) {
                const entityPin = context.localEntityPin.get(this);
                if (d[context._title_idx] !== entityPin.title() && d[context._startDate_idx] !== entityPin.description()) {
                    const parsed_start_time = context.brAxis.parse(d[context._startDate_idx]);
                    const formatted_start_time = context.tooltipFormatter(parsed_start_time);
                    entityPin
                        .x(context.dataStartPos(d) - 0)
                        .y(0)
                        .icon(d[context._icon_idx])
                        .title(d[context._title_idx])
                        .description(formatted_start_time)
                        .animationFrameRender()
                        ;
                } else {
                    entityPin.move({ x: context.dataStartPos(d) - 0, y: 0 });
                }
                const calc_height = entityPin.calcHeight();
                if (event_height < calc_height) event_height = calc_height;
            })
            ;
        entityPins.exit()
            .each(function (d, i) {
                const entityPin = context.localEntityPin.get(this);
                entityPin.target(null);

            })
            .remove();
        return event_height;
    }

    updateEventRanges(events, ranges, bucketIndex, eventRangeHeight, tlAxisBBox, brAxisBBox, width) {
        const context = this;
        const _textSize = super.textSize;
        const lines = this.gMiddleContent.selectAll(".line").data(events, d => {
            return d[context._title_idx];
        });
        lines.enter().append("line")
            .attr("class", "line")
            .merge(lines)
            .attr(this.isHorizontal() ? "x1" : "y1", d => this.dataStartPos(d) - 0)
            .attr(this.isHorizontal() ? "x2" : "y2", d => this.dataStartPos(d) - 0)
            .attr(this.isHorizontal() ? "y1" : "x1", this.isHorizontal() ? tlAxisBBox.height : tlAxisBBox.width)
            .attr(this.isHorizontal() ? "y2" : "x2", this.isHorizontal() ? eventRangeHeight - brAxisBBox.height : width - brAxisBBox.width)
            ;
        lines.exit().remove();
        const buckets = this.gMiddleContent.selectAll(".buckets").data(ranges, d => d[context._title_idx]);
        buckets.enter().append("g")
            .attr("class", "buckets")
            .call(this._selection.enter.bind(this._selection))
            .each(function (d) {
                const entityCard = new EntityCard()
                    .target(this)
                    .iconDiameter(28)
                    .iconPaddingPercent(0)
                    .title("SomeTitle")
                    .titleFontSize(28)
                    .titleColor(context.rangeFontColor())
                    .descriptionColor(context.rangeFontColor())
                    .iconColor(context.rangeFontColor())
                    .backgroundShape("rect")
                    .backgroundColorFill(d[context._color_idx])
                    .backgroundColorStroke("#333")
                    ;
                context.localCard.set(this, entityCard);
                context.enterEntityCard(entityCard, d);
            })
            .on("click", function (d) {
                context.click(context.rowToObj(d), "range", context._selection.selected(this));
            }, false)
            .on("dblclick", function (d) {
                context.rootExtent = d;
                context.resetZoom();
                context.dblclick(context.rowToObj(d), "range", context._selection.selected(this));
            }, true)
            .on("mouseout.tooltip", this.tooltip.hide)
            .on("mousemove.tooltip", this.tooltip.show)
            .merge(buckets)
            .attr("transform", d => context.isHorizontal() ?
                `translate(${this.dataStartPos(d)}, ${this.verticalBands(bucketIndex[d])}) ` :
                `translate(${this.verticalBands(bucketIndex[d])}, ${this.dataStartPos(d)}) `)
            .each(function (d) {
                const textBox = context.localCard.get(this);
                const x = context.dataWidth(d) / 2;
                const y = context.verticalBands.bandwidth() / 2;
                const cardWidth = Math.max(context.dataWidth(d), 2);
                const cardHeight = Math.max(context.verticalBands.bandwidth(), 2);
                const fontHeightRatio = 0.618;
                const paddingRatio = ((1 - fontHeightRatio) / 2);
                const paddingSize = paddingRatio * cardHeight;
                const fontSize = cardHeight * fontHeightRatio;
                const iconSize = fontSize;
                const titleSize = _textSize(d[context._title_idx], "Verdana", fontSize);
                const tooWide = titleSize.width + iconSize + (paddingSize * 2) > cardWidth;
                const wayTooWide = iconSize + (paddingSize * 2) > cardWidth;
                textBox
                    .pos(context.isHorizontal() ? { x, y } : { x: y, y: x })
                    .fixedHeight(context.isHorizontal() ? cardHeight : cardWidth)
                    .fixedWidth(context.isHorizontal() ? cardWidth : cardHeight)
                    .icon(wayTooWide ? "" : d[context._icon_idx])
                    .title(tooWide ? "" : d[context._title_idx])
                    .padding(paddingSize)
                    .iconDiameter(iconSize)
                    .titleFontSize(fontSize)
                    ;
                context.updateEntityCard(textBox, d[context._icon_idx]);
                textBox
                    .render()
                    ;
            });
        buckets.exit().remove();
    }

    //  Events  ---
    click(row, col, sel) {
    }

    dblclick(row, col, sel) {
    }

    enterEntityCard(textbox: EntityCard, d) {
    }

    updateEntityCard(textbox: EntityCard, d) {
    }

    //  ITooltip  ---
    tooltip;
    tooltipHTML: (_) => string;
    tooltipFormat: (_) => string;

    //  SimpleSelectionMixin
    _selection;
}
MiniGantt.prototype._class += " timeline_MiniGantt";
MiniGantt.prototype.implements(ITooltip.prototype);
MiniGantt.prototype.mixin(Utility.SimpleSelectionMixin);

export interface MiniGantt {
    timePattern(): string;
    timePattern(_: string): this;
    tickFormat(): string;
    tickFormat(_: string): this;
    tooltipTimeFormat(): string;
    tooltipTimeFormat(_: string): this;
    overlapTolerence(): number;
    overlapTolerence(_: number): this;
    orientation(): string;
    orientation(_: string): this;
    rangeFontColor(): string;
    rangeFontColor(_: string): this;
    titleColumn(): string;
    titleColumn(_: string): this;
    startDateColumn(): string;
    startDateColumn(_: string): this;
    endDateColumn(): string;
    endDateColumn(_: string): this;
    iconColumn(): string;
    iconColumn(_: string): this;
    colorColumn(): string;
    colorColumn(_: string): this;
    eventFontColorColumn(): string;
    eventFontColorColumn(_: string): this;
    eventBorderColorColumn(): string;
    eventBorderColorColumn(_: string): this;
    eventBackgroundColorColumn(): string;
    eventBackgroundColorColumn(_: string): this;
}

MiniGantt.prototype.publish("timePattern", "%Y-%m-%d", "string", "timePattern");
MiniGantt.prototype.publish("tickFormat", "%Y-%m-%d", "string", "tickFormat");
MiniGantt.prototype.publish("tooltipTimeFormat", "%Y-%m-%d", "string", "tooltipTimeFormat");
MiniGantt.prototype.publish("overlapTolerence", 2, "number", "overlapTolerence");
MiniGantt.prototype.publish("orientation", "horizontal", "set", "orientation", ["horizontal", "vertical"]);
MiniGantt.prototype.publish("rangeFontColor", "#ecf0f1", "html-color", "rangeFontColor");
MiniGantt.prototype.publish("titleColumn", null, "string", "titleColumn");
MiniGantt.prototype.publish("startDateColumn", null, "string", "startDateColumn");
MiniGantt.prototype.publish("endDateColumn", null, "string", "endDateColumn");
MiniGantt.prototype.publish("iconColumn", null, "string", "iconColumn");
MiniGantt.prototype.publish("colorColumn", null, "string", "colorColumn");
MiniGantt.prototype.publish("eventFontColorColumn", null, "string", "eventFontColorColumn");
MiniGantt.prototype.publish("eventBorderColorColumn", null, "string", "eventBorderColorColumn");
MiniGantt.prototype.publish("eventBackgroundColorColumn", null, "string", "eventBackgroundColorColumn");
