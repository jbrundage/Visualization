import { Line } from "@hpcc-js/chart";

new Line()
    .target("target")
    .columns(["C1", "V1", "V2"])
    .data([
        ["C1_1", 68, 71],
        ["C1_7", 69, 82],
        ["C1_0", 74, 84],
        ["C1_6", 75, 78],
        ["C1_9", 81, 84],
        ["C1_8", 82, 69],
        ["C1_5", 82, 78],
        ["C1_3", 84, 68],
        ["C1_2", 94, 69],
        ["C1_4", 102, 77]
    ])
    .interpolate("linear")
    .interpolateFillOpacity(0.04757697403062089)
    .paletteID("Set1")
    .pointShape("rectangle")
    .pointSize(8)
    .useClonedPalette(true)
    .xAxisGuideLines(true)
    .xAxisOverlapMode("hide")
    .render()
    ;