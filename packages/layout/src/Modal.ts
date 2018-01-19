import { d3SelectionType, HTMLWidget, publish, publishProxy, Widget } from "@hpcc-js/common";

import "../src/Modal.css";

export class Modal extends HTMLWidget {

    private _widget: Widget;

    private _relativeTarget: HTMLElement;

    private _fade: d3SelectionType;
    private _modal: d3SelectionType;
    private _modalHeader: d3SelectionType;
    private _modalBody: d3SelectionType;

    constructor() {
        super();
        this._tag = "div";
    }

    closeModal() {
        this.exit();
    }

    getRelativeTarget() {
        let relativeTarget;
        if (this.relativeTargetId()) {
            relativeTarget = document.getElementById(this.relativeTargetId());
            if (relativeTarget) {
                return relativeTarget;
            }
        }
        if (!relativeTarget) {
            relativeTarget = this.locateAncestor("layout_Grid");
            if (relativeTarget && relativeTarget.element) {
                return relativeTarget.element().node();
            }
        }
        return document.body;
    }

    setModalSizeLimits() {
        if (this.minHeight() || this.minWidth()) {
            this._modal
                .style("min-height", this.minHeight())
                .style("min-width", this.minWidth())
                .style("max-height", this.maxHeight())
                .style("max-width", this.maxWidth())
                ;
        }
    }

    setFadePosition(rect) {
        this._fade.node().style.top = rect.top + "px";
        this._fade.node().style.left = rect.left + "px";
        this._fade.node().style.width = rect.width + "px";
        this._fade.node().style.height = rect.height + "px";
    }

    setModalPosition(rect) {
        const _node = this._modal.node();
        const contentRect = _node.getBoundingClientRect();
        _node.style.position = "fixed";
        _node.style.top = (rect.top + (rect.height / 2) - (contentRect.height / 2)) + "px";
        _node.style.left = (rect.left + (rect.width / 2) - (contentRect.width / 2)) + "px";
        _node.style.width = contentRect.width + "px";
        _node.style.height = contentRect.height + "px";
        if (this.minHeight() || this.minWidth()) {
            _node.style["min-height"] = this.minHeight();
            _node.style["min-width"] = this.minWidth();
        }
    }

    enter(domNode, element) {
        super.enter(domNode, element);
        const context = this;
        this._fade = element.append("div")
            .classed("layout_Modal-fade", true)
            .classed("layout_Modal-fadeClickable", this.enableClickFadeToClose())
            .classed("layout_Modal-fade-hidden", !this.showFade())
            ;
        const _pad = parseInt(this.headerPadding());
        this._modal = element.append("div").classed("layout_Modal-content", true);
        this._modalHeader = this._modal.append("div")
            .classed("layout_Modal-header", true)
            .style("padding", this.headerPadding())
            .style("color", this.titleFontColor())
            .style("font-size", this.titleFontSize())
            ;
        this._modalBody = this._modal.append("div")
            .classed("layout_Modal-body", true)
            ;
        this._modalBody.node().style.padding = this.bodyPadding();

        this._modalHeader.append("div").classed("layout_Modal-title", true).text(this.title());

        this._modalHeaderAnnotations = this._modalHeader.append("div").classed("layout_Modal-annotations", true);
        this._modalHeaderCloseButton = this._modalHeaderAnnotations.append("div").classed("layout_Modal-closeButton", true).html("<i class=\"fa fa-close\"></i>");

        const _anno_bbox = this._modalHeaderAnnotations.node().getBoundingClientRect();
        this._modalHeaderAnnotations.node().style.right = _pad - (_anno_bbox.width / 2) + "px";
        this._modalHeaderAnnotations.node().style.top = _pad - (_anno_bbox.height / 2) + "px";
        this._modalHeaderCloseButton.on("click", function () {
            context.closeModal();
        });
        this._fade.on("click", n => {
            if (this.enableClickFadeToClose()) {
                this.closeModal();
            }
        });

        this._widget.target(this._modalBody.node()).resize().render();
        this.setModalSizeLimits();
    }

    update(domNode, element) {
        super.update(domNode, element);

        this._fade.classed("layout_Modal-fade-hidden", !this.showFade());
        this._relativeTarget = this.getRelativeTarget();

        this.setModalSizeLimits();

        this._widget.render(n => {
            const rect = this._relativeTarget.getBoundingClientRect();
            this.setFadePosition(rect);
            this.setModalPosition(rect);
        });
    }
}

Modal.prototype._class += " layout_Modal";

Modal.prototype.publishProxy("html", "_html");

Modal.prototype.publish("title", null, "string", "title");
Modal.prototype.publish("titleFontSize", "18px", "string", "titleFontSize");
Modal.prototype.publish("titleFontColor", "#ffffff", "html-color", "titleFontColor");
Modal.prototype.publish("relativeTargetId", null, "string", "relativeTargetId");

Modal.prototype.publish("headerPadding", "15px", "string", "headerPadding");
Modal.prototype.publish("bodyPadding", "15px", "string", "bodyPadding");

Modal.prototype.publish("show", true, "boolean", "show");
Modal.prototype.publish("showFade", true, "boolean", "showFade");
Modal.prototype.publish("enableClickFadeToClose", true, "boolean", "enableClickFadeToClose");

Modal.prototype.publish("minWidth", "400px", "string", "minWidth");
Modal.prototype.publish("minHeight", "400px", "string", "minHeight");
Modal.prototype.publish("maxWidth", "800px", "string", "maxWidth");
Modal.prototype.publish("maxHeight", "800px", "string", "maxHeight");