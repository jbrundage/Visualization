window.g_now = new Date().getTime();
window.g_data_structures = {
    "V": {
        widgets: [],
        columns: w=>["V1"],
        data: (range,rand)=>d3.range(range).map(n=>Math.floor(100 * rand()) + 30).sort((a,b)=>a[0] < b[0] ? 1 : -1)
    },
    "VV": {
        widgets: [
            "chart_Area",
            "chart_Bar",
            "chart_Bubble",
            "chart_Column",
            "chart_Contour",
            "chart_HexBin",
            "chart_Line",
            "chart_Pie",
            "chart_Scatter",
            "chart_Step",
        ],
        columns: w=>["V1", "V2"],
        data: (range,rand)=>d3.range(range).map(n=>[
            Math.floor(100 * rand()) + 30,
            Math.floor(100 * rand()) + 30
        ]).sort((a,b)=>a[0] < b[0] ? 1 : -1)
    },
    "VVV": {
        widgets: [],
        columns: w=>["V1", "V2", "V3"],
        data: (range,rand)=>d3.range(range).map(n=>[
            Math.floor(100 * rand()) + 30,
            Math.floor(100 * rand()) + 30,
            Math.floor(100 * rand()) + 30
        ]).sort((a,b)=>a[0] < b[0] ? 1 : -1)
    },
    "CV": {
        widgets: [
            "chart_Area",
            "chart_Bar",
            "chart_Bubble",
            "chart_Column",
            "chart_Contour",
            "chart_HexBin",
            "chart_Line",
            "chart_Pie",
            "chart_Scatter",
            "chart_Step",
        ],
        columns: w=>["C1", "V1"],
        data: (range,rand)=>d3.range(range).map((n,i)=>[
            `C1_${i}`,
            Math.floor(100 * rand()) + 30
        ]).sort((a,b)=>a[1] < b[1] ? -1 : 1)
    },
    "CVV": {
        widgets: [
            "chart_Area",
            "chart_Bar",
            "chart_Column",
            "chart_Contour",
            "chart_HexBin",
            "chart_Line",
            "chart_Scatter",
            "chart_Step",
        ],
        columns: w=>["C1", "V1", "V2"],
        data: (range,rand)=>d3.range(range).map((n,i)=>[
            `C1_${i}`,
            Math.floor(100 * rand()) + 30,
            Math.floor(100 * rand()) + 30
        ]).sort((a,b)=>a[1] < b[1] ? -1 : 1)
    },
    "CVVV": {
        widgets: [
            "chart_Area",
            "chart_Bar",
            "chart_Column",
            "chart_Contour",
            "chart_HexBin",
            "chart_Line",
            "chart_Scatter",
            "chart_Step",
        ],
        columns: w=>["C1", "V1", "V2", "V3"],
        data: (range,rand)=>d3.range(range).map((n,i)=>[
            `C1_${i}`,
            Math.floor(100 * rand()) + 30,
            Math.floor(100 * rand()) + 30,
            Math.floor(100 * rand()) + 30
        ]).sort((a,b)=>a[1] < b[1] ? -1 : 1)
    },
    "C[T0,T1]": {
        widgets: [
            "chart_Gantt"
        ],
        columns: w=>["C1", "[T0,T1]"],
        data: (range,rand)=>d3.range(range).map((n,i)=>{
            const T0 = g_now - Math.floor(1000000 * rand());
            const T1 = T0 + Math.floor(1000000 * rand());
            return [`C1_${i}`,[T0,T1].sort()];
        })
    },
    // "CV[T0,T1]": {
    //     widgets: [],
    //     columns: w=>["C1", "V1", "[T0,T1]"],
    //     data: (range,rand)=>d3.range(range).map((n,i)=>{
    //         const V1 = Math.floor(100 * rand()) + 30;
    //         const T0 = g_now - Math.floor(1000000 * rand());
    //         const T1 = T0 + Math.floor(1000000 * rand());
    //         return [`C1_${i}`, V1, [T0,T1]];
    //     })
    // },
    // "CCV[T0,T1]": {
    //     widgets: [],
    //     columns: w=>["C1", "C2", "V1", "[T0,T1]"],
    //     data: (range,rand)=>d3.range(range).map((n,i)=>{
    //         const V1 = Math.floor(100 * rand()) + 30;
    //         const T0 = g_now - Math.floor(1000000 * rand());
    //         const T1 = T0 + Math.floor(1000000 * rand());
    //         return [`C1_${i}`, V1, [T0,T1]];
    //     })
    // },
    "C[V0,V1]": {
        widgets: [
            "chart_Bar",
            "chart_Column",
        ],
        columns: w=>["C1", "[V0,V1]"],
        data: (range,rand)=>d3.range(range).map((n,i)=>{
            const V0 = Math.floor(100 * rand()) + 30;
            const V1 = Math.floor(100 * rand()) + 30;
            return [`C1_${i}`, [V0,V1].sort()];
        })
    },
    "C[V0,V1][V2,V3]": {
        widgets: [
            "chart_Bar",
            "chart_Column"
        ],
        columns: w=>["C1", "[V0,V1]", "[V2,V3]"],
        data: (range,rand)=>d3.range(range).map((n,i)=>{
            const V0 = Math.floor(100 * rand()) + 30;
            const V1 = Math.floor(100 * rand()) + 30;
            const V2 = Math.floor(100 * rand()) + 30;
            const V3 = Math.floor(100 * rand()) + 30;
            return [`C1_${i}`, [V0,V1].sort(), [V2,V3].sort()];
        })
    },
    "C[V0,V1][V2,V3][V4,V5]": {
        widgets: [
            "chart_Bullet",
            "chart_Bar",
            "chart_Column"
        ],
        columns: w=>["C1", "[V0,V1]", "[V2,V3]", "[V4,V5]"],
        data: (range,rand)=>d3.range(range).map((n,i)=>{
            const V0 = Math.floor(100 * rand()) + 30;
            const V1 = Math.floor(100 * rand()) + 30;
            const V2 = Math.floor(100 * rand()) + 30;
            const V3 = Math.floor(100 * rand()) + 30;
            const V4 = Math.floor(100 * rand()) + 30;
            const V5 = Math.floor(100 * rand()) + 30;
            return [`C1_${i}`, [V0,V1].sort(), [V2,V3].sort(), [V4,V5].sort()];
        })
    },
    "CC[V0,V1][V2,V3][V4,V5]": {
        widgets: [
            "chart_Bullet"
        ],
        columns: w=>["C1", "C2", "[V0,V1]", "[V2,V3]", "[V4,V5]"],
        data: (range,rand)=>d3.range(range).map((n,i)=>{
            const V0 = Math.floor(100 * rand()) + 30;
            const V1 = Math.floor(100 * rand()) + 30;
            const V2 = Math.floor(100 * rand()) + 30;
            const V3 = Math.floor(100 * rand()) + 30;
            const V4 = Math.floor(100 * rand()) + 30;
            const V5 = Math.floor(100 * rand()) + 30;
            return [`C1_${i}`, `C2_${i}`, [V0,V1].sort(), [V2,V3].sort(), [V4,V5].sort()];
        })
    },
    "Hierarchy": {
        widgets: [
            "tree_CirclePacking",
            "tree_DendrogramColumn",
            "tree_Dendrogram",
            "tree_IndentedColumn",
            "tree_Indented",
            "tree_SunburstPartition",
            "tree_TreemapColumn",
            "tree_Treemap"
        ],
        columns: w=>["label", "size"],
        data: (range,rand)=>{
            return {
                label: "hpccjs",
                children: Object.keys(hpccjs).map(package_name=>{
                    return {
                        label: package_name,
                        children: Object.keys(hpccjs[package_name]).map(widget_name=>{
                            return {
                                label: widget_name,
                                size: 1 
                            }
                        })
                    }
                })
            };
        }
    },
};
window.g_data_shapes = Object.keys(g_data_structures);


function random_columns(type) {
    return g_data_structures[type].columns();
}

function random_data(type, range, rand_mode) {
    if (typeof range === "undefined")range = 10;
    if (typeof rand_mode === "undefined")rand_mode = "randomBates";
    let rand = d3[rand_mode](range);
    return g_data_structures[type].data(range,rand);
}