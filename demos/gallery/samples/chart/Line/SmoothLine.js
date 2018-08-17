import { Line } from "@hpcc-js/chart";

new Line()
    .target("target")
    .columns(["C1", "V1", "V2"])
    .data([
        ["A", 68, 71],
        ["B", 69, 82],
        ["C", 74, 84],
        ["D", 75, 78],
        ["E", 81, 84],
        ["F", 82, 69],
        ["G", 82, 78],
        ["H", 84, 68],
        ["I", 94, 69],
        ["J", 102, 77]
    ])
    .interpolate("monotone")
    .paletteID("Set1")
    .pointShape("circle")
    .pointSize(8)
    .xAxisGuideLines(true)
    .xAxisOverlapMode("hide")
    .render()
    ;