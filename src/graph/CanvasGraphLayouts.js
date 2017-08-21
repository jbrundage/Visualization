"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3v4","dagre"], factory);
    } else {
        root.graph_CanvasGraphLayouts = factory(root.d3v4, root.dagre);
    }
}(this, function (d3v4, dagre) {
    var layouts = {
        "Hierarchy": {
            decay:{alpha:0.0228,velocity:0.4},
            xy:{
                x:function (n) {return n.force_x ? n.force_x : 0;},
                y:function (n) {return n.force_y ? n.force_y : 0;},
                strength:1
            },
            link:{distance:0,strength:0},
            manyBodyForce:{strength:0},
            centeredForce:false,
            init: function (data) {
                var dagre_graph = createDagreGraph.call(this,data);
                dagre.layout(dagre_graph);
                dagre_graph.nodes().map(function (n) {
                    return dagre_graph.node(n);
                }).forEach(function (_pos, _idx) {
                    var _node = data.nodes[_idx];
                    _node.force_x = _pos.x - (this.canvas.width / 2 / this.transform.k);
                    _node.force_y = _pos.y - (this.canvas.height / 2 / this.transform.k);
                }, this);
            }
        },
        "CircleHierarchy": {
            decay:{alpha:0.0128,velocity:0.2},
            xy:{
                x:function (n) {return n.force_x ? n.force_x : 0;},
                y:function (n) {return n.force_y ? n.force_y : 0;},
                strength:1
            },
            link:{distance:1,strength:0},
            manyBodyForce:{strength:0},
            centeredForce:false,
            init: function (data) {
                var dagre_graph = createDagreGraph.call(this,data);
                dagre.layout(dagre_graph);

                var node_positions = dagre_graph.nodes()
                    .map(function (n) {
                        return dagre_graph.node(n);
                    });
                var uni_x = [];
                var uni_y = [];
                var circle_map_x_to_angle = {};
                var circle_map_y_to_radius = {};
                var min_x = node_positions[0].x;
                var max_x = node_positions[0].x;
                var min_y = node_positions[0].y;
                var max_y = node_positions[0].y;
                node_positions.forEach(function (_pos) {
                    if (min_x > _pos.x)min_x = _pos.x;
                    if (max_x < _pos.x)max_x = _pos.x;
                    if (min_y > _pos.y)min_y = _pos.y;
                    if (max_y < _pos.y)max_y = _pos.y;
                    if (uni_x.indexOf(_pos.x) === -1) {
                        uni_x.push(_pos.x);
                    }
                    if (uni_y.indexOf(_pos.y) === -1) {
                        uni_y.push(_pos.y);
                    }
                });
                uni_x.forEach(function (x) {
                    var _x_ratio = ((x - min_x) / (max_x - min_x));
                    circle_map_x_to_angle[x] = _x_ratio * Math.PI * 2;
                });
                uni_y.forEach(function (y) {
                    var _y_ratio = ((y - min_y) / (max_y - min_y));
                    _y_ratio = _y_ratio < 0.9 ? _y_ratio * 0.8 : _y_ratio;
                    circle_map_y_to_radius[y] = _y_ratio * this.circle_layout_radius();
                }, this);
                node_positions.forEach(function (_pos, _idx) {
                    var _node = data.nodes[_idx];
                    _node.force_x = Math.cos(circle_map_x_to_angle[_pos.x]) * circle_map_y_to_radius[_pos.y];
                    _node.force_y = Math.sin(circle_map_x_to_angle[_pos.x]) * circle_map_y_to_radius[_pos.y];
                });
            }
        },
        "ForceDirected": {
            decay:{alpha:0.0228,velocity:0.4},
            xy:{
                x:function() {return 0;},
                y:function() {return 0;},
                strength:function (d) {
                    return d.child_arr.length > 0 ? 1 : -0.1;
                }
            },
            link:{
                distance:function (d) {
                    if(d.target.is_primary)return 200;
                    if(d.target.is_leaf)return 130;
                    return 60;
                },
                strength:1
            },
            manyBodyForce:{
                strength:function (d) {
                    if(d.is_leaf)return -200;
                    return -250;
                }
            },
            centeredForce:true,
            init: function (data) {
                //
            },
            post_init: function(data){
                data.nodes.forEach(function (_node, _i, _arr) {
                    _node.fx = _node.x;
                    _node.fy = _node.y;
                });
            }
        },
        "ForceDirected2": {
            decay:{alpha:0.0228,velocity:0.7},
            xy:{
                x:function() {return 0;},
                y:function() {return 0;},
                strength:function (d) {
                    return d.child_arr.length > 0 ? 1 : -0.1;
                }
            },
            link:{
                distance:100,
                strength:function (d) {
                    if (d.target.is_primary) {
                        return 200;
                    }
                    if (d.target.is_leaf) {
                        return 130;
                    }
                    return 60;
                }
            },
            manyBodyForce:{
                strength:function (d) {
                    if(d.is_primary)return -400;
                    if (d.is_leaf) {
                        return -200;
                    }
                    return -250;
                }
            },
            centeredForce:true,
            init: function (data) {
                //
            }
        },
        "Circle": {
            decay:{alpha:0.0128,velocity:0.25},
            xy:{
                x:function (n) {return n.force_x ? n.force_x : 0;},
                y:function (n) {return n.force_y ? n.force_y : 0;},
                strength:1
            },
            link:{distance:1,strength:0},
            manyBodyForce:{strength:0},
            centeredForce:true,
            init: function (data) {
                var _radius = this.circle_layout_radius();
                data.nodes.forEach(function (_node, _i, _arr) {
                    var angle = Math.PI * 2 * (_i == 0 ? 0 : (_i) / (_arr.length));
                    _node.force_x = Math.cos(angle) * _radius;
                    _node.force_y = Math.sin(angle) * _radius;
                });
            }
        }
    };
    
    function createDagreGraph(data){
        var g = new dagre.graphlib.Graph({
            multigraph: true,
            compound: true,
            directed: true
        });
        g.setGraph({
            rankdir: this.hierarchyRankDirection(),
            nodesep: this.hierarchyNodeSeparation(),
            edgesep: this.hierarchyEdgeSeparation(),
            ranksep: this.hierarchyRankSeparation()
        });
        g.setDefaultEdgeLabel(function () {
            return {};
        });
        data.nodes.forEach(function (u) {
            g.setNode(u.index, {
                width: u.width,
                height: u.height
            });
        });
        data.links.forEach(function (u) {
            g.setEdge(u.source.index, u.target.index);
        });
        return g;
    }
    
    return layouts;
}));
