"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/SVGWidget", "../common/Icon", "../common/TextBox", "css!./VertexC"], factory);
    } else {
        root.graph_VertexC = factory(root.d3, root.common_SVGWidget, root.common_Icon, root.common_TextBox);
    }
}(this, function (d3, SVGWidget, Icon, TextBox) {
    function VertexC() {
        SVGWidget.call(this);

        this.poly_arr = [];

        this._icon = new Icon();
        this._textBox = new TextBox();
        this._annotationWidgets = {};
    }
    VertexC.prototype = Object.create(SVGWidget.prototype);
    VertexC.prototype.constructor = VertexC;
    VertexC.prototype._class += " graph_VertexC";

    VertexC.prototype.publishProxy("faChar", "_icon");
    VertexC.prototype.publishProxy("imageUrl", "_icon");
    VertexC.prototype.publishProxy("icon_shape_diameter", "_icon", "diameter");
    VertexC.prototype.publishProxy("icon_shape_colorFill", "_icon", "shape_colorFill");
    VertexC.prototype.publishProxy("icon_shape_colorStroke", "_icon", "shape_colorStroke");
    VertexC.prototype.publishProxy("icon_image_colorFill", "_icon", "image_colorFill");
    VertexC.prototype.publish("centroid", false, "boolean", "Centroid Vertex");

    VertexC.prototype.publishProxy("text", "_textBox");
    VertexC.prototype.publishProxy("anchor", "_textBox");
    VertexC.prototype.publishProxy("textbox_shape_colorStroke", "_textBox", "shape_colorStroke");
    VertexC.prototype.publishProxy("textbox_shape_colorFill", "_textBox", "shape_colorFill");
    VertexC.prototype.publishProxy("textbox_text_colorFill", "_textBox", "text_colorFill");

    VertexC.prototype.publish("iconAnchor", "start", "set", "Icon Anchor Position", ["", "start", "middle", "end"], { tags: ["Basic"] });

    VertexC.prototype.publish("tooltip", "", "string", "Tooltip", null, { tags: ["Private"] });
    VertexC.prototype.publish("iconTooltip", "", "string", "iconTooltip", null, { tags: ["Private"] });

    VertexC.prototype.publish("annotationDiameter", 14, "number", "Annotation Diameter", null, { tags: ["Private"] });
    VertexC.prototype.publish("annotationSpacing", 3, "number", "Annotation Spacing", null, { tags: ["Private"] });
    VertexC.prototype.publish("annotationIcons", [], "array", "Annotations", null, { tags: ["Private"] });

    VertexC.prototype.drawOriginalLayout = function (ctx, canvas) {

    };
    VertexC.prototype.drawCenteredLayout = function (ctx, canvas) {

    };
    VertexC.prototype.drawKeyLayout = function (ctx, canvas) {
        var context = this;
        var x = this.x();
        var y = this.y();
        var x_offset = 0;
        var y_offset = 0;
        var mult = 1;
        var label_font_family = 'Arial';
        var icon_font_family = 'FontAwesome';
        var icon_font_size = label_font_size * 2;
        var label_font_size = 12 * mult;
        var icon_font_size = label_font_size * 2;
        var pr = label_font_size / 4;
        var icon_y_offset = pr;
        var label_w = 0;
        var label_h = label_font_size + (pr * 2);
        var icon_h = label_h * 2;
        var annotations_h = label_h;
        var center_x = 0;
        var center_x_offset = 0;
        this.min_x = x;
        this.max_x = x;
        this.min_y = y;
        this.max_y = y;
        //debugger;
        ctx.textBaseline = 'top';

        draw_label(this.text());
        draw_icon(this.faChar());
        draw_annotations();
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.strokeStyle = '#ff0000';
        // ctx.strokeRect(this.x(),this.y(),2,2);
        // ctx.closePath();

        this.size({
            height: this.max_y - this.min_y,
            width: this.max_x - this.min_x,
        });

        function draw_icon(txt) {
            /*
                icon_shape_diameter
                icon_shape_colorFill
                icon_shape_colorStroke
                icon_image_colorFill
            */
            var poly_info_obj = {
                vertex: this,
                tooltip: context.iconTooltip() 
            };
            var icon_w = icon_h;
            var _x = x - icon_w;
            var _y = y - icon_h / 2;
            ctx.font = icon_font_size + 'px ' + icon_font_family;
            ctx.beginPath();
            ctx.font = icon_font_size + 'px ' + icon_font_family;
            ctx.rect(_x - center_x_offset, _y, icon_w, icon_h);
            context.poly_arr.push([_x - center_x_offset, _y, icon_w, icon_h, poly_info_obj]);
            ctx.strokeStyle = context.icon_shape_colorStroke() ? context.icon_shape_colorStroke() : "#777";
            ctx.stroke();
            ctx.fillStyle = context.icon_shape_colorFill() ? context.icon_shape_colorFill() : "#fff";
            ctx.fill();
            ctx.fillStyle = context.icon_image_colorFill() ? context.icon_image_colorFill() : "#fff";
            ctx.textAlign = 'center';
            ctx.fillText(txt, _x + (icon_w / 2) - center_x_offset, _y + pr + icon_y_offset);
            ctx.closePath();
            context.update_x_minmax(_x);
            context.update_x_minmax(_x + icon_w);
            context.update_y_minmax(_y);
            context.update_y_minmax(_y + icon_h);
        }
        function draw_label(txt) {
            /*
                textbox_shape_colorStroke
                textbox_shape_colorFill
                textbox_text_colorFill
            */
            var poly_info_obj = {
                vertex: this,
                tooltip: context.tooltip()
            };
            var _x = x;
            var _y = y - icon_h / 2;
            ctx.beginPath();
            ctx.strokeStyle = context.textbox_shape_colorStroke() ? context.textbox_shape_colorStroke() : "#777";
            ctx.font = label_font_size + 'px ' + label_font_family;
            label_w = ctx.measureText(txt).width;
            center_x = x - icon_h + ((icon_h+label_w)/2);
            center_x_offset = center_x - x;
            ctx.rect(_x - center_x_offset, _y, label_w + (pr * 2), label_h);
            context.poly_arr.push([_x - center_x_offset, _y, label_w + (pr * 2), label_h, poly_info_obj]);
            ctx.fillStyle = context.textbox_shape_colorFill() ? context.textbox_shape_colorFill() : "#fff";
            ctx.fill();
            ctx.fillStyle = context.textbox_text_colorFill() ? context.textbox_text_colorFill() : "#000";
            ctx.textAlign = 'left';
            ctx.fillText(txt, _x + pr - center_x_offset, _y + pr);
            ctx.stroke();
            ctx.closePath();
            context.update_x_minmax(_x);
            context.update_x_minmax(_x + label_w + (pr * 2));
            context.update_y_minmax(_y);
            context.update_y_minmax(_y + label_h);
        }
        function draw_annotations() {
            var _x = x + label_w + (pr * 2) - annotations_h;
            var _y = y;
            var _anno_width_sum = 0;
            ctx.textAlign = 'left';
            ctx.font = label_font_size + 'px ' + label_font_family;
            context.annotationIcons().forEach(function (anno_obj) {
                var poly_info_obj = {
                    vertex: this,
                    tooltip: anno_obj.tooltip,
                    direction: "down"
                };
                ctx.beginPath();
                ctx.strokeStyle = "#777";
                ctx.rect(_x - _anno_width_sum - center_x_offset, _y, annotations_h, annotations_h);
                context.poly_arr.push([_x - _anno_width_sum - center_x_offset, _y, annotations_h, annotations_h, poly_info_obj]);
                ctx.stroke();
                ctx.fillStyle = anno_obj.shape_colorFill ? anno_obj.shape_colorFill : "#fff";
                ctx.fill();
                ctx.fillStyle = anno_obj.image_colorFill ? anno_obj.image_colorFill : "#000";
                ctx.fillText(anno_obj.faChar, _x - _anno_width_sum + pr - center_x_offset, _y + pr);
                ctx.closePath();
                _anno_width_sum += annotations_h;
            });
        }
    };

    VertexC.prototype.drawSelf = function (ctx, canvas) {
        this.poly_arr = [];
        this.drawKeyLayout(ctx, canvas);
    };

    VertexC.prototype.getHoveredPolygons = function (x,y) {
        // debugger;
        return this.poly_arr.filter(n=>{
            var in_x_bounds = x > n[0] && x < n[0] + n[2];
            var in_y_bounds = y > n[1] && y < n[1] + n[3];
            return in_x_bounds && in_y_bounds;
        })
    };

    VertexC.prototype.update_x_minmax = function (_x) {
        if (this.min_x > _x) this.min_x = _x;
        if (this.max_x < _x) this.max_x = _x;
    }
    VertexC.prototype.update_y_minmax = function (_y) {
        if (this.min_y > _y) this.min_y = _y;
        if (this.max_y < _y) this.max_y = _y;
    }

    VertexC.prototype.getBBox = function () {
        // console.log(this.size());
        return this.size();
    };

    //  Render  ---
    VertexC.prototype.enter = function (domNode, element) {
        SVGWidget.prototype.enter.apply(this, arguments);
        this._icon
            .target(domNode)
            .render()
            ;
        this._textBox
            .target(domNode)
            .render()
            ;
    };

    VertexC.prototype.update = function (domNode, element) {
        SVGWidget.prototype.update.apply(this, arguments);
        element.classed("centroid", this.centroid());
        element.style("filter", this.centroid() ? "url(#" + this._graphID + "_glow)" : null);
        this._icon
            .tooltip(this.tooltip())
            .render()
            ;
        var iconClientSize = this._icon.getBBox(true);
        this._textBox
            .tooltip(this.tooltip())
            .render()
            ;
        var bbox = this._textBox.getBBox(true);
        switch (this.iconAnchor()) {
            case 'start':
                this._icon
                    .move({
                        x: -(bbox.width / 2) + (iconClientSize.width / 3),
                        y: -(bbox.height / 2) - (iconClientSize.height / 3)
                    });
                break;
            case 'middle':
                this._icon
                    .move({
                        x: 0,
                        y: -(bbox.height / 2) - (iconClientSize.height / 3)
                    });
                break;
            case 'end':
                this._icon
                    .move({
                        x: (bbox.width / 2) - (iconClientSize.width / 3),
                        y: -(bbox.height / 2) - (iconClientSize.height / 3)
                    });
                break;
        }

        var context = this;
        var annotations = element.selectAll(".annotation").data(this.annotationIcons());
        annotations.enter().append("g")
            .attr("class", "annotation")
            .each(function (d, idx) {
                context._annotationWidgets[idx] = new Icon()
                    .target(this)
                    .shape("square")
                    ;
            })
            ;
        var xOffset = bbox.width / 2;
        var yOffset = bbox.height / 2;
        annotations
            .each(function (d, idx) {
                var annotationWidget = context._annotationWidgets[idx];
                annotationWidget
                    .diameter(context.annotationDiameter())
                    .shape_colorFill(context.textbox_shape_colorFill())
                    .shape_colorStroke(context.textbox_shape_colorStroke())
                    ;
                for (var key in d) {
                    if (annotationWidget[key]) {
                        annotationWidget[key](d[key]);
                    } else if (window.__hpcc_debug) {
                        console.log("Invalid annotation property:  " + key);
                    }
                }
                annotationWidget.render();

                var aBBox = annotationWidget.getBBox(true);
                annotationWidget
                    .move({
                        x: xOffset - aBBox.width / 2 + 4,
                        y: yOffset + aBBox.height / 2 - 4
                    })
                    ;
                xOffset -= aBBox.width + context.annotationSpacing();
            })
            ;
        annotations.exit()
            .each(function (d, idx) {
                var element = d3.select(this);
                delete context._annotationWidgets[idx];
                element.remove();
            })
            ;
    };

    //  Methods  ---
    VertexC.prototype.intersection = function (pointA, pointB) {
        var i1 = this._icon.intersection(pointA, pointB, this._pos);
        if (i1)
            return i1;
        var i2 = this._textBox.intersection(pointA, pointB, this._pos);
        if (i2)
            return i2;
        return null;
    };

    return VertexC;
}));
