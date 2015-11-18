"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "./Scatter", "css!./Line"], factory);
    } else {
        root.chart_Line = factory(root.d3, root.chart_Scatter);
    }
}(this, function (d3, Scatter) {
    function Line(target) {
        Scatter.call(this);

        this.interpolate("linear");
    }
    Line.prototype = Object.create(Scatter.prototype);
    Line.prototype.constructor = Line;
    Line.prototype._class += " chart_Line";

    Line.prototype.enter = function (domNode, element) {
        Scatter.prototype.enter.apply(this, arguments);
        this.sortDates(true);
        this.xAxisTickCount(14);
        this.xAxisTickFormat("%B");
        this.xAxisTypeTimePattern("%Y%m%d");
        this.xAxisType("time");
    };

    return Line;
}));
