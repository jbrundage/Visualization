"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.test_chartFactory = factory();
    }
}(this, function () {
    var chartjsFactory = {
        Bar: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chartjs/Bar"], function (DataFactory, Bar) {
                    callback(new Bar()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            },
        },
        Column: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chartjs/Column"], function (DataFactory, Column) {
                    callback(new Column()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            },
        },
        Pie: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chartjs/Pie"], function (DataFactory, Pie) {
                    callback(new Pie()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            },
        },
        Area: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chartjs/Area"], function (DataFactory, Area) {
                    callback(new Area()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            },
        },
        Line: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chartjs/Line"], function (DataFactory, Line) {
                    callback(new Line()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            },
        },
        Polar: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chartjs/Polar"], function (DataFactory, Polar) {
                    callback(new Polar()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            },
        },
        Scatter: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chartjs/Scatter"], function (DataFactory, Scatter) {
                    callback(new Scatter()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            },
        },
        ScatterBubble: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chartjs/ScatterBubble"], function (DataFactory, ScatterBubble) {
                    callback(new ScatterBubble()
                        .columns(DataFactory.scatterLinear.categorized.columns)
                        .data(DataFactory.scatterLinear.categorized.data)
                    );
                });
            },
        },
    };

    return chartjsFactory;
}));
