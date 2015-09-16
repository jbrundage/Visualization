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
                    rawData.nodes.forEach(function (node,i) {
                        var annotation = [];
                        var chr = "\uf0c0";
                        if ([0].indexOf(i) !== -1) {
                            chr = "\uf007";
                            annotation.push({
                                "faChar": "\uf007",
                                "tooltip": "Person",
                                "shape_colorFill": "white",
                                "image_colorFill": "white",
                                "diameter":18
                            });
                        }
                        else if ([1,2,3].indexOf(i) !== -1) {
                            chr = "\uf015";
                            annotation.push({
                                "faChar": "\uf015",
                                "tooltip": "Property",
                                "shape_colorFill": "green",
                                "shape_colorStroke": "green",
                                "image_colorFill": "white",
                                "diameter":18
                            });
                        }
                        else if ([4].indexOf(i) !== -1) {
                            chr = "\uf1b9";
                            annotation.push({
                                "faChar": "\uf1b9",
                                "tooltip": "Vehicle",
                                "shape_colorFill": "navy",
                                "shape_colorStroke": "navy",
                                "image_colorFill": "white",
                                "diameter":18
                            });
                        }
                        else if ([5,6,7,8,9,10].indexOf(i) !== -1) {
                            chr = "\uf0c0";
                            annotation.push({
                                "faChar": "\uf0c0",
                                "tooltip": "Associate",
                                "shape_colorFill": "navy",
                                "shape_colorStroke": "navy",
                                "image_colorFill": "white",
                                "diameter":18
                            });
                        }
                        vertices.push(new Vertex()
                            .text(node.name)
                            .textbox_shape_colorStroke(palette(node.group))
                            .textbox_shape_colorFill("whitesmoke")
                            .icon_shape_colorStroke(palette(node.group))
                            .icon_shape_colorFill(palette(node.group))
                            .faChar(chr)
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
            }
        }
    };
}));
