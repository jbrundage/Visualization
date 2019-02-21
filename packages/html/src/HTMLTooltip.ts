import { HTMLWidget } from "@hpcc-js/common";

type DirectionType = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
type PositionType = { x: number, y: number };
type DirectionalBBoxType = { [key in DirectionType]: PositionType; };

type Rectangle = {top: number, left: number, width: number, height: number};
export class HTMLTooltip extends HTMLWidget {
    _targetElement;
    _tooltipElement;
    _triggerElement;
    _arrowElement;
    _tooltipHTMLCallback = n => "<b>_tooltipHTMLCallback is undefined</b>";
    constructor() {
        super();
    }

    enter(domNode, element) {
        super.enter(domNode, element);
        this._tooltipElement = element.append("div")
            .classed("tooltip-div", true)
            .style("z-index", "10000")
            .style("position", "fixed")
            ;
        this._arrowElement = element.append("div")
            .classed("arrow-div", true)
            .style("z-index", "10000")
            .style("position", "fixed")
            ;
        this._targetElement = element;
    }
    update(domNode, element) {
        super.update(domNode, element);
    }

    show(data?) {
        const callback = this._tooltipHTMLCallback;
        this._tooltipElement
            .html(function() {
                return callback.call(this, data);
            })
            .style("background-color", this.tooltipColor())
            .style("color", this.fontColor())
            .style("width", this.tooltipWidth() + "px")
            .style("height", this.tooltipHeight() + "px")
            .style("opacity", 1)
            .style("padding", this.padding() + "px")
            .style("pointer-events", "none")
            ;
        this._arrowElement
            .style("opacity", 1)
            .style("pointer-events", "none")
            ;
        this.setTooltipPosition();
    }
    hide() {
        this._tooltipElement
            .style("opacity", 0)
            ;
        this._arrowElement
            .style("opacity", 0)
            ;
    }

    tooltipHTML(_) {
        this._tooltipHTMLCallback = _;
    }

    setTooltipPosition() {
        const bbox = this.getReferenceBBox();
        const direction = this.getDirection(bbox);
        const box = bbox[direction];
        this._tooltipElement
            .style("top",  box.y + "px")
            .style("left", box.x + "px")
            ;
        this.setArrowPosition(box, direction);
        return box;
    }

    getDirection(bbox: DirectionalBBoxType): DirectionType {
        const directions: DirectionType[] = Object.keys(bbox) as DirectionType[];

        const defaultDirection = this.direction();
        directions.sort((a, b) => a === defaultDirection ? -1 : 1);
        const windowRect = {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
        for (let i = 0; i < directions.length; i++) {
            const tooltipRect = {
                top: bbox[directions[i]].y,
                left: bbox[directions[i]].x,
                width: this.tooltipWidth(),
                height: this.tooltipHeight()
            };
            if (this.rectFits(tooltipRect, windowRect)) {
                return directions[i];
            }
        }
        console.error(`Tooltip doesn't fit in the window for any of the directions. Defaulting to '${this.direction()}'`);
        console.error("window rect:", windowRect);
        console.error("tooltip rect:", {
            top: bbox[this.direction()].y,
            left: bbox[this.direction()].x,
            width: this.tooltipWidth(),
            height: this.tooltipHeight()
        });
        return this.direction();
    }

    rectFits(innerRect: Rectangle, outerRect: Rectangle): boolean {
        return (
            innerRect.top >= outerRect.top &&
            innerRect.left >= outerRect.left &&
            innerRect.width + innerRect.left <= outerRect.width + outerRect.left &&
            innerRect.height + innerRect.top <= outerRect.height + outerRect.top
        );
    }

    setArrowPosition(box, direction) {
        let top;
        let left;
        let visibleBorderStyle = "border-top-color";
        this._arrowElement
            .style("border", `${this.arrowHeight()}px solid ${this.tooltipColor()}`)
            .style("border-top-color",  "transparent")
            .style("border-right-color",  "transparent")
            .style("border-bottom-color",  "transparent")
            .style("border-left-color",  "transparent")
            ;
        switch (direction) {
            case "n":
                top = box.y + this.tooltipHeight() + (this.padding() * 2);
                left = box.x + (this.tooltipWidth() / 2) - (this.arrowWidth() / 2) + this.padding();
                visibleBorderStyle = "border-top-color";
                this._arrowElement
                    .style("border-top-width", `${this.arrowHeight()}px`)
                    .style("border-bottom-width", "0px")
                    .style("border-left-width", `${this.arrowWidth() / 2}px`)
                    .style("border-right-width", `${this.arrowWidth() / 2}px`)
                    ;
                break;
            case "s":
                top = box.y - this.arrowHeight();
                left = box.x + this.padding() + (this.tooltipWidth() / 2) - (this.arrowWidth() / 2);
                visibleBorderStyle = "border-bottom-color";
                this._arrowElement
                    .style("border-top-width", "0px")
                    .style("border-bottom-width", `${this.arrowHeight()}px`)
                    .style("border-left-width", `${this.arrowWidth() / 2}px`)
                    .style("border-right-width", `${this.arrowWidth() / 2}px`)
                    ;
                break;
            case "e":
                top = box.y + (this.tooltipHeight() / 2) + this.padding() - (this.arrowWidth() / 2);
                left = box.x - this.arrowHeight();
                visibleBorderStyle = "border-right-color";
                this._arrowElement
                    .style("border-top-width", `${this.arrowWidth() / 2}px`)
                    .style("border-bottom-width", `${this.arrowWidth() / 2}px`)
                    .style("border-left-width", "0px")
                    .style("border-right-width", `${this.arrowHeight()}px`)
                    ;
                break;
            case "w":
                top = box.y + (this.tooltipHeight() / 2) - (this.arrowWidth() / 2) + this.padding();
                left = box.x + this.tooltipWidth() + (this.padding() * 2);
                visibleBorderStyle = "border-left-color";
                this._arrowElement
                    .style("border-top-width", `${this.arrowWidth() / 2}px`)
                    .style("border-bottom-width", `${this.arrowWidth() / 2}px`)
                    .style("border-left-width", `${this.arrowHeight()}px`)
                    .style("border-right-width", "0px")
                    ;
                break;
        }
        if (typeof top !== "undefined" && typeof left !== "undefined") {
            this._arrowElement
                .style("top",  top + "px")
                .style("left", left + "px")
                .style(visibleBorderStyle, this.tooltipColor())
                .style("opacity", 1)
                ;
        } else {
            this._arrowElement
                .style("opacity", 0)
                ;
        }
        return box;
    }

    debugDirections() {
        const bbox: DirectionalBBoxType = this.getReferenceBBox();
        const directions: DirectionType[] = Object.keys(bbox) as DirectionType[];
        let count = 0;
        setInterval(n => {
            this.direction(directions[count % directions.length]);
            console.group(this.direction());
            console.log("count", count);
            const box = this.setTooltipPosition();
            console.log("box", box);
            console.groupEnd();
            count++;
        }, 3000);
    }

    getReferenceNode() {
        if (!this._triggerElement) {
            const element = this._targetElement;
            return element.node().parentNode.parentNode;
        }
        return this._triggerElement.node();
    }

    getReferenceBBox() {
        const node = this.getReferenceNode();
        const rect = node.getBoundingClientRect();
        const wholeW = this.tooltipWidth();
        const wholeH = this.tooltipHeight();
        const halfW = wholeW / 2;
        const halfH = wholeH / 2;
        const arrowH = this.arrowHeight();
        const p = this.padding();
        const p2 = p * 2;
        const bbox = {
            n: {
                x: rect.left + (rect.width / 2) - halfW - p,
                y: rect.top - wholeH - arrowH - p2
            },
            e: {
                x: rect.left + rect.width + arrowH,
                y: rect.top + (rect.height / 2) - halfH - p
            },
            s: {
                x: rect.left + (rect.width / 2) - halfW - p,
                y: rect.top + rect.height + arrowH
            },
            w: {
                x: rect.left - wholeW - arrowH - p2,
                y: rect.top + (rect.height / 2) - halfH - p
            },
            nw: {
                x: rect.left - wholeW - p2,
                y: rect.top - wholeH - p2
            },
            ne: {
                x: rect.left + rect.width,
                y: rect.top - wholeH - p2
            },
            se: {
                x: rect.left + rect.width,
                y: rect.top + rect.height
            },
            sw: {
                x: rect.left - wholeW - p2,
                y: rect.top + rect.height
            }
        };
        return bbox;
    }
}
HTMLTooltip.prototype._class += " html_HTMLTooltip";

export interface HTMLTooltip {
    padding(): number;
    padding(_: number): this;
    direction(): DirectionType;
    direction(_: DirectionType): this;
    arrowHeight(): number;
    arrowHeight(_: number): this;
    arrowWidth(): number;
    arrowWidth(_: number): this;
    fontColor(): string;
    fontColor(_: string): this;
    tooltipColor(): string;
    tooltipColor(_: string): this;
    tooltipWidth(): number;
    tooltipWidth(_: number): this;
    tooltipHeight(): number;
    tooltipHeight(_: number): this;
}
HTMLTooltip.prototype.publish("direction", "n", "set", "Direction in which to display the tooltip", ["n", "s", "e", "w", "ne", "nw", "se", "sw"]);
HTMLTooltip.prototype.publish("padding", 8, "number", "Padding (pixels)");
HTMLTooltip.prototype.publish("arrowWidth", 16, "number", "Width (or height depending on direction) of the tooltip arrow (pixels)");
HTMLTooltip.prototype.publish("arrowHeight", 8, "number", "Height (or width depending on direction) of the tooltip arrow (pixels)");
HTMLTooltip.prototype.publish("fontColor", "#FFF", "html-color", "The default font color for text in the tooltip");
HTMLTooltip.prototype.publish("tooltipColor", "#000000EE", "html-color", "Background color of the tooltip");
HTMLTooltip.prototype.publish("tooltipWidth", 200, "number", "Width of the tooltip (not including arrow) (pixels)");
HTMLTooltip.prototype.publish("tooltipHeight", 200, "number", "Height of the tooltip (not including arrow) (pixels)");
