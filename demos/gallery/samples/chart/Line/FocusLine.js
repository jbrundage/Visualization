import { Line } from "@hpcc-js/chart";

new Line()
    .target("target")
    .columns(["Category", "Value"])
    .data([
        ["A", 144],
        ["B", 89],
        ["C", 55],
        ["D", 34],
        ["E", 21],
        ["F", 13]
    ])
    .interpolate("linear")
    .paletteID("Set1")
    .pointShape("circle")
    .pointSize(8)
    .xAxisFocus(true)
    .xAxisGuideLines(true)
    .xAxisOverlapMode("hide")
    .render()
    ;