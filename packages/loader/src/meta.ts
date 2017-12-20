export const npmPackages = {
    "ajv": "ajv/dist/ajv.bundle",
    "amcharts3": "amcharts3",
    "amchartsImg": "amcharts3/amcharts/images/",
    "colorbrewer": "colorbrewer/colorbrewer",
    "codemirror": "codemirror/",
    "d3-array": "d3-array/build/d3-array",
    "d3-axis": "d3-axis/build/d3-axis",
    "@hpcc-js/d3-bullet": "@hpcc-js/d3-bullet/build/d3-bullet",
    "d3-brush": "d3-brush/build/d3-brush",
    "d3-cloud": "d3-cloud/build/d3.layout.cloud",
    "d3-dsv": "d3-dsv/build/d3-dsv",
    "d3-collection": "d3-collection/build/d3-collection",
    "d3-color": "d3-color/build/d3-color",
    "d3-dispatch": "d3-dispatch/build/d3-dispatch",
    "d3-drag": "d3-drag/build/d3-drag",
    "d3-ease": "d3-ease/build/d3-ease",
    "d3-interpolate": "d3-interpolate/build/d3-interpolate",
    "d3-force": "d3-force/build/d3-force",
    "d3-format": "d3-format/build/d3-format",
    "d3-geo": "d3-geo/build/d3-geo",
    "d3-hexbin": "d3-hexbin/build/d3-hexbin",
    "d3-hierarchy": "d3-hierarchy/build/d3-hierarchy",
    "d3-path": "d3-path/build/d3-path",
    "d3-quadtree": "d3-quadtree/build/d3-quadtree",
    "d3-random": "d3-random/build/d3-random",
    "d3-request": "d3-request/build/d3-request",
    "d3-scale": "d3-scale/build/d3-scale",
    "d3-shape": "d3-shape/build/d3-shape",
    "d3-sankey": "d3-sankey/build/d3-sankey",
    "d3-selection": "d3-selection/build/d3-selection",
    "d3-svg-legend": "d3-svg-legend/indexRollup",
    "d3-time": "d3-time/build/d3-time",
    "d3-timer": "d3-timer/build/d3-timer",
    "d3-time-format": "d3-time-format/build/d3-time-format",
    "d3-tip": "d3-tip/lib-browser/index",
    "d3-tile": "d3-tile/build/d3-tile",
    "d3-transition": "d3-transition/build/d3-transition",
    "d3-zoom": "d3-zoom/build/d3-zoom",
    "dagre": "dagre/dist/dagre",
    "es6-promise/auto": "es6-promise/dist/es6-promise.auto",
    "font-awesome": "font-awesome",
    "google-maps": "google-maps/lib/Google",
    "grid-list": "grid-list/src/gridList",
    "handsontable": "handsontable/dist/handsontable.full",
    "immutable": "immutable/dist/immutable.min",
    "javascript-autocomplete": "javascript-autocomplete/auto-complete",
    "orb-fix": "orb-fix/dist/orb",
    "orb-fix.css": "orb-fix/dist/orb.css",
    "react": "react/dist/react.min",
    "react-dom": "react-dom/dist/react-dom.min",
    "reflect-metadata": "reflect-metadata/Reflect",
    "simpleheat": "simpleheat/simpleheat",
    "tooltip.js": "tooltip.js/dist/umd/tooltip",
    "topojson": "topojson/dist/topojson",
    "tslib": "tslib/tslib"
};
export const rawgitPackages = {
    "d3-tip": "GordonSmith/d3-tip/vJSNEXT/lib-browser/index.min"
};
export const localPackages = {
    ...npmPackages,
    ...rawgitPackages
};
export const shims = ["loader", "codemirror-shim", "c3-shim", "ddl-shim", "dgrid-shim", "phosphor-shim", "preact-shim"];
export const packages = [
    "comms", "util", "common", "layout", "phosphor", "api", "dgrid", "chart", "other", "form",
    "c3chart", "google", "amchart", "tree", "graph", "map",
    "handson", "react", "composite", "marshaller", "html", "timeline", "codemirror"
];
