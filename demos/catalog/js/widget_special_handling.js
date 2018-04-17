window.g_widget_special_handling = {
    "chart_Bullet": w => {
        let _s = w.__data_shape.split('[');
        if (_s.length > 1) {
            let arr = _s.map(n => $.trim(n.split(']')[0].split(',')));
            let col_arr = [];
            w.titleColumn(w.columns()[0]);
            if (arr[0].length === 2) w.subtitleColumn(w.columns()[1]);

            let _idx = arr[0].length;
            w.measuresColumn(w.columns()[_idx]);

            if (arr.length === 3) {
                w.rangesColumn(w.columns()[_idx + 1]);
            } else if (arr.length === 4) {
                w.rangesColumn(w.columns()[_idx + 1]);
                w.markersColumn(w.columns()[_idx + 2]);
            }
        }
    },
    "composite_Dermatology": w => {
        let _a = new hpccjs.chart.Contour()
            .columns(["C1", "V1", "V2"])
            .data([
                ["C1_0", 95, 87],
                ["C1_1", 85, 102],
                ["C1_2", 89, 80],
                ["C1_3", 65, 78],
                ["C1_4", 94, 70],
                ["C1_5", 93, 77],
                ["C1_6", 93, 60],
                ["C1_7", 80, 89],
                ["C1_8", 64, 84],
                ["C1_9", 71, 73]
            ])
            .contourBandwidth(47)
            .paletteID("Spectral")
            .useClonedPalette(true)
            .xAxisGuideLines(false)
            .xAxisOverlapMode("hide")
            .yAxisDomainPadding(20);
        w.widget(_a);
    },
    "chart_Summary": w => {
        let _html = '';
        let _arr = [100, 200, 300];
        _arr.forEach(function (n) {
            _arr.forEach(function (n2) {
                let _id = `summary_${n}_${n2}`;
                $('#body-wrapper').append(`<div id="${_id}" style="float:left;height:${n}px;width:${n2}px;"></div>`);
                new hpccjs.chart.Summary()
                    .target(_id)
                    .columns(["Summary", "Score", "Details", "Status", "Icon"])
                    .data([
                        ["Elephants", 22, "<a href='http://www.google.com#q=Elephants'>Big an grey</a>", "grey", "fa-info-circle"],
                        ["Mice", 87, "<a href='http://www.google.com#q=Elephants'>Squeaky</a>", "red", "fa-briefcase"],
                        ["Sheep", 50, "<a href='http://www.google.com#q=Elephants'>Tasty</a>", "green", "fa-info-circle"],
                        ["People", 42, "<a href='http://www.google.com#q=Elephants'>Two Legs</a>", "orange", "fa-briefcase"]
                    ])
                    .iconColumn("Icon")
                    .labelColumn("Summary")
                    .valueColumn("Score")
                    .moreTextColumn("Details")
                    .moreTextHTML(true)
                    .colorFillColumn("Status")
                    .render();
            })
        })
    }
};
window.g_exclude_widget_list = [
    "chart_Axis",
    "chart_XYAxis",
    // "chart_Summary",
    "tree_DendrogramColumn",
    "tree_IndentedColumn",
    "tree_TreemapColumn",
];