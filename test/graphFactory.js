"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.test_graphFactory = factory();
    }
}(this, function () {
    return {
        Vertex: {
            simple: function (callback) {
                require(["test/DataFactory", "src/graph/Vertex"], function (DataFactory, Vertex) {
                    callback(new Vertex()
                        .faChar(DataFactory.FAChar.simple.char)
                        .text(DataFactory.Text.simple.text)
                        .annotationIcons(DataFactory.Graph.vertex.annotationIcons)
                    );
                });
            }
        },
        Edge: {
            simple: function (callback) {
                require(["test/DataFactory", "src/graph/Graph", "src/common/Palette", "src/graph/Vertex", "src/graph/Edge"], function (DataFactory, Graph, Palette, Vertex, Edge) {
                    var graph = new Graph();
                    var vertices = [];
                    var edges = [];
                    var palette = Palette.ordinal("dark2");

                    var rawData = DataFactory.Graph.simple;
                    rawData.nodes.forEach(function (node) {
                        vertices.push(
                            new Vertex()
                                .text(node.name)
                                .textbox_shape_colorStroke(palette(node.group))
                                .textbox_shape_colorFill("whitesmoke")
                                .icon_shape_diameter(60)
                                .icon_shape_colorStroke("transparent")
                                .icon_shape_colorFill("transparent")
                                .icon_image_colorFill("#333333")
                                .textbox_shape_colorStroke("transparent")
                                .textbox_shape_colorFill("transparent")
                                .textbox_text_colorFill("#333333")
                                .iconAnchor("middle")
                                .faChar(node.icon)
                            )
                        ;
                    }, graph);

                    rawData.links.forEach(function (link, idx) {
                        edges.push(
                            new Edge()
                                .sourceVertex(vertices[link.source])
                                .targetVertex(vertices[link.target])
                                .sourceMarker("circle")
                                .targetMarker("arrow")
                                .text("Hello!")
                                .strokeDasharray(idx === 0 ? "15, 10, 5, 10, 15" : null)
                                .strokeColor(idx === 0 ? "cyan" : null)
                                .weight(link.value)
                            )
                        ;
                    }, graph);

                    graph.data({ vertices: vertices, edges: edges });
                    callback(graph);
                });
            }
        },
        Graph: {
            simple: function (callback) {
                require(["test/DataFactory", "src/graph/Graph", "src/common/Palette", "src/graph/Vertex", "src/graph/Edge"], function (DataFactory, Graph, Palette, Vertex, Edge) {
                    var graph = new Graph();
                    var vertices = [];
                    var edges = [];
                    var palette = Palette.ordinal("dark2");

                    var rawData = DataFactory.Graph.simple;
                    rawData.nodes.forEach(function (node) {
                        vertices.push(
                            new Vertex()
                                .text(node.name)
                                .textbox_shape_colorStroke(palette(node.group))
                                .textbox_shape_colorFill("whitesmoke")
                                .icon_shape_diameter(30)
                                .icon_shape_colorStroke(palette(node.group))
                                .icon_shape_colorFill(palette(node.group))
                                .faChar(node.icon)
                            )
                        ;
                    }, graph);

                    rawData.links.forEach(function (link, idx) {
                        edges.push(
                            new Edge()
                                .sourceVertex(vertices[link.source])
                                .targetVertex(vertices[link.target])
                                .sourceMarker("circle")
                                .targetMarker("arrow")
                                .text("")
                                .weight(link.value)
                            )
                        ;
                    }, graph);

                    graph.data({ vertices: vertices, edges: edges });
                    callback(graph);
                });
            },
            restyle: function (callback) {
                require(["test/DataFactory", "src/graph/Graph", "src/common/Palette", "src/graph/Vertex", "src/graph/Edge"], function (DataFactory, Graph, Palette, Vertex, Edge) {
                    var graph = new Graph();
                    var vertices = [];
                    var edges = [];
                    var palette = Palette.ordinal("dark2");

                    var rawData = DataFactory.Graph.simple;
                    rawData.nodes.forEach(function (node) {
                        vertices.push(
                            new Vertex()
                                .text(node.name)
                                .textbox_shape_colorStroke(palette(node.group))
                                .textbox_shape_colorFill("whitesmoke")
                                .icon_shape_diameter(60)
                                .icon_shape_colorStroke("transparent")
                                .icon_shape_colorFill("transparent")
                                .icon_image_colorFill("#333333")
                                .textbox_shape_colorStroke("transparent")
                                .textbox_shape_colorFill("transparent")
                                .textbox_text_colorFill("#333333")
                                .iconAnchor("middle")
                                .faChar(node.icon)
                            )
                        ;
                    }, graph);

                    rawData.links.forEach(function (link, idx) {
                        edges.push(
                            new Edge()
                                .sourceVertex(vertices[link.source])
                                .targetVertex(vertices[link.target])
                                .sourceMarker("circle")
                                .targetMarker("arrow")
                                .text("")
                                .weight(link.value)
                            )
                        ;
                    }, graph);

                    graph.data({ vertices: vertices, edges: edges });
                    callback(graph);
                });
            },
            les_miz: function (callback) {
                require(["test/DataFactory", "src/graph/Graph", "src/common/Palette", "src/graph/Vertex", "src/graph/Edge"], function (DataFactory, Graph, Palette, Vertex, Edge) {
                    var graph = new Graph();
                    var vertices = [];
                    var edges = [];
                    var palette = Palette.ordinal("dark2");

                    var rawData = DataFactory.Graph.les_miz;
                    rawData.nodes.forEach(function (node) {
                        vertices.push(
                            new Vertex()
                                .text(node.name)
                                .textbox_shape_colorStroke(palette(node.group))
                                .textbox_shape_colorFill("whitesmoke")
                                .icon_shape_colorStroke(palette(node.group))
                                .icon_shape_colorFill(palette(node.group))
                                .faChar(node.name[0])
                            )
                        ;
                    }, graph);

                    rawData.links.forEach(function (link, idx) {
                        edges.push(
                            new Edge()
                                .sourceVertex(vertices[link.source])
                                .targetVertex(vertices[link.target])
                                .sourceMarker("circle")
                                .targetMarker("arrow")
                                .text("")
                                .weight(link.value)
                            )
                        ;
                    }, graph);

                    graph.data({ vertices: vertices, edges: edges });
                    callback(graph);
                });
            },
            annotations: function (callback) {
                require(["test/DataFactory", "src/graph/Graph", "src/common/Palette", "src/graph/Vertex", "src/graph/Edge"], function (DataFactory, Graph, Palette, Vertex, Edge) {
                    var graph = new Graph();

                    var vertices = [];
                    var edges = [];

                    var palette = Palette.ordinal("dark2");

                    var rawData = DataFactory.Graph.simple;
                    rawData.nodes.forEach(function (node) {
                        var annotation = [];
                        if (Math.random() < 0.10) {
                            annotation.push({
                                "faChar": "A",
                                "tooltip": "Test A",
                                "shape_colorFill": "white",
                                "image_colorFill": "red"
                            });
                        }
                        if (Math.random() < 0.10) {
                            annotation.push({
                                "faChar": "B",
                                "tooltip": "Test B",
                                "shape_colorFill": "green",
                                "shape_colorStroke": "green",
                                "image_colorFill": "white"
                            });
                        }
                        if (Math.random() < 0.10) {
                            annotation.push({
                                "faChar": "C",
                                "tooltip": "Test C",
                                "shape_colorFill": "navy",
                                "shape_colorStroke": "navy",
                                "image_colorFill": "white"
                            });
                        }
                        vertices.push(new Vertex()
                            .text(node.name)
                            .textbox_shape_colorStroke(palette(node.group))
                            .textbox_shape_colorFill("whitesmoke")
                            .icon_shape_colorStroke(palette(node.group))
                            .icon_shape_colorFill(palette(node.group))
                            .annotationIcons(annotation)
                            .faChar(node.name[0])
                        );
                    }, graph);

                    function createEdge(source, target, label) {
                        return new Edge()
                            .sourceVertex(source)
                            .targetVertex(target)
                            .sourceMarker("circle")
                            .targetMarker("arrow")
                            .text(label || "")
                        ;
                    }
                    rawData.links.forEach(function (link, idx) {
                        edges.push(createEdge(vertices[link.source], vertices[link.target]).weight(link.value));
                    }, graph);

                    graph.data({ vertices: vertices, edges: edges });
                    callback(graph);
                });
            }
        },
        Sankey: {
            simple: function (callback) {
                require(["test/DataFactory", "src/graph/Sankey"], function (DataFactory, Sankey) {
                    var widget = new Sankey()
                        .columns(DataFactory.Sample.DataBreach.columns)
                        .data(DataFactory.Sample.DataBreach.data)
                        .mappings([new Sankey.prototype.Column().column("Covered Entity Type"), new Sankey.prototype.Column().column("Type of Breach")])
                    ;
                    callback(widget);
                });
            }
        },
        CanvasGraph: {
            simple: function (callback) {
                require(["test/DataFactory", "src/graph/CanvasGraph"], function (DataFactory, CanvasGraph) {
                    window.g_w = new CanvasGraph();
                    callback(g_w);
                });
            },
            skew: function (callback) {
                require(["test/DataFactory", "src/graph/CanvasGraph"], function (DataFactory, HeatMap) {
                    callback(new HeatMap()
                        .columns(DataFactory.HeatMap.skew.columns)
                        .data(DataFactory.HeatMap.skew.data)
                        .topLeftX(-10000).topLeftY(-10000)
                        .bottomRightX(10000).bottomRightY(10000)
                    );
                });
            },
            rapidInterval: function (callback) {
                require(["test/DataFactory", "src/graph/CanvasGraph"], function (DataFactory, HeatMap) {
                    var heat = new HeatMap().columns(DataFactory.HeatMap.center.columns).data(DataFactory.HeatMap.center.data)
                        .topLeftX(-10000).topLeftY(-10000)
                        .bottomRightX(10000).bottomRightY(10000)
                        .radius(13).blur(5)
                    ;
                    var step = 400;
                    var renderTimeLimit = 2000;
                    var mitosisLoop = setInterval(function(){
                        var prevRenderTime = new Date().getTime();
                        var newData = [];
                        heat.data().forEach(function(n){
                            var splitChance = 1/(heat.data().length/20);
                            var rand = Math.random();
                            if(rand <= splitChance * n[2] * 5){
                                _split(n);
                            } else if (rand <= splitChance * 100) {
                                _move(n);
                            } else {
                                n[2] = rand >= 0.999999 ? 1 : n[2];
                                newData.push(n);
                            }
                        });
                        heat.data(newData).render();
                        if(new Date().getTime() - prevRenderTime > renderTimeLimit){
                            clearInterval(mitosisLoop);
                        }
                        function _split(c){
                            var o = step + (Math.random()*step);
                            newData.push(c);
                            newData.push([[c[0],c[1]-o,c[2]],[c[0]+o,c[1],c[2]],[c[0],c[1]+o,c[2]],[c[0]-o,c[1],c[2]]][Math.floor(Math.random()*4)]);
                        }
                        function _move(cell){
                            var movedCell = [cell[0] + (step*Math.random()*[-1,1][Math.floor(Math.random()*2)]),cell[1] + (step*Math.random()*[-1,1][Math.floor(Math.random()*2)]),cell[2] * 0.99];
                            if(movedCell[2] > 0.01){
                                newData.push(movedCell);
                            }
                        }
                    },100);
                    callback(heat);
                });
            }
        },
    };
}));
