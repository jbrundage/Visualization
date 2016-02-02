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
        Graph: {
            simple: function (callback) {
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
                            .sourceMarker("circleFoot")
                            .targetMarker("arrowHead")
                            .text(label || "")
                        ;
                    }
                    rawData.links.forEach(function (link, idx) {
                        edges.push(createEdge(vertices[link.source], vertices[link.target]).weight(link.value));
                    }, graph);

                    graph.data({ vertices: vertices, edges: edges });
                    callback(graph);
                });
            },
            many_one_one_many: function (callback) {
                require(["test/DataFactory", "src/graph/Graph", "src/common/Palette", "src/graph/Vertex", "src/graph/Edge"], function (DataFactory, Graph, Palette, Vertex, Edge) {
                    var graph = new Graph();

                    var vertices = [];
                    var edges = [];

                    var palette = Palette.ordinal("dark2");
                    var nodes = DataFactory.Graph.simple.nodes;

                    nodes.forEach(function (node,idx) {
                            var annotation = [];
                            if (Math.random() < 0.10) {
                                annotation.push({"faChar": "A","tooltip": "Test A","shape_colorFill": "white","image_colorFill": "red"});
                            }
                            if (Math.random() < 0.10) {
                                annotation.push({"faChar": "B","tooltip": "Test B","shape_colorFill": "green","image_colorFill": "white"});
                            }
                            if (Math.random() < 0.10) {
                                annotation.push({"faChar": "C","tooltip": "Test C","shape_colorFill": "navy","image_colorFill": "white"});
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
                            if(idx === 0){
                                //edges.push(createEdge(vertices[0], vertices[link.target]).weight(link.value));
                            } else if (idx === 1) {
                                edges.push(createEdge(vertices[0], vertices[1]).weight(1));
                            } else {
                                edges.push(createEdge(vertices[idx], vertices[Math.floor(Math.random()+0.5)]).weight(1));
                            }
                    }, graph);

                    function createEdge(source, target, label) {
                        return new Edge()
                            .sourceVertex(source)
                            .targetVertex(target)
                            .sourceMarker("circleFoot")
                            .targetMarker("arrowHead")
                            .text(label || "")
                        ;
                    }

                    graph.data({ vertices: vertices, edges: edges }).layout("ForceDirected");
                    callback(graph);
                });
            }
        }
    };
}));
