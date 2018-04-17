window.g_demo_ordinal_palettes = ["category10","category20b","category20c","Dark2","Paired","Set1","Set2"];
let get_random_ordinal_palette = n=>g_demo_ordinal_palettes[Math.floor(Math.random()*g_demo_ordinal_palettes.length)];

window.g_demo_rainbow_palettes = ["YlOrRd","Greys","Purples","Spectral","BuPu"];
let get_random_rainbow_palette = n=>g_demo_rainbow_palettes[Math.floor(Math.random()*g_demo_rainbow_palettes.length)];

window.g_random_widget_primary_params = {
    paletteID: {
        probability: 1,
        func: w=>{
            let is_ordinal = w._palette.toString().indexOf('domain')===-1;
            if(is_ordinal){
                return get_random_ordinal_palette();
            } else {
                return get_random_rainbow_palette();
            }
        }
    },
    useClonedPalette: {
        probability: 1,
        func: w=>true
    },
    outerText: {
        probability: 0.9,
        // func: w=>true
        func: w=>false//TODO remove this publish param or fix outerText?
    },
    innerRadius: {
        probability: 0.9,
        func: w=>Math.random()*50
    },
    pointSize: {
        probability: 0.5,
        func: w=>Math.floor(Math.random()*20)+1
    },
    pointShape: {
        probability: 1,
        func: w=>["circle","rectangle","cross"][Math.floor(Math.random()*3)]
    },
    interpolate: {
        probability: 1,
        func: w=>{
            switch(w.classID()){
                case 'chart_Line':
                case 'chart_Area':
                    return Math.random() < 0.8 ? "linear" : ["linear","basis", "bundle", "cardinal", "catmullRom", "natural", "monotone"][Math.floor(Math.random()*7)]
                    break;
                case 'chart_Step':
                    return Math.random() > 0.8 ? ["step-before", "step-after"][Math.floor(Math.random()*2)] : "step";
                    break;
            }
            return ""
        }
    },
    interpolateFillOpacity:{
        probability: 0.5,
        func: w=>(Math.random()*100)/100
    },
    yAxisDomainPadding: {
        probability: 0.3,
        func: w=>20
    },
    // yAxisType: {
    //     probability: 0.3,
    //     func: w=>["linear","pow"][Math.floor(Math.random()*2)]
    //     // func: w=>["linear","pow","log"][Math.floor(Math.random()*3)]
    // },
    yAxisStacked: {
        probability: 0.3,
        func: w=>!!Math.floor(Math.random()*2)
    },
    xAxisGuideLines: {
        probability: 0.5,
        func: w=>!!Math.floor(Math.random()*2)
    },
    overlapMode: {
        probability: 1,
        func: w=>"hide"
    },
    xAxisOverlapMode: {
        probability: 1,
        func: w=>"hide"
    },
    yAxisOverlapMode: {
        probability: 1,
        func: w=>"hide"
    },
    orientation: {
        probability: 0.3,
        func: w=>{
            switch(w.classID()){
                case 'chart_Gantt':return "vertical";
                case 'chart_Bar':return "vertical";
                case 'chart_Column':return "horizontal";
            }
            return ["horizontal","vertical"][Math.floor(Math.random()*2)]
        }
    },
    contourStrokeWidth: {
        probability: 0.3,
        func: w=>Math.floor(Math.random()*3)
    },
    contourBandwidth: {
        probability: 1,
        func: w=>Math.floor(Math.random()*100)+2
    },
    showContourFill: {
        probability: 0.1,
        func: w=>false
    },
    binSize: {
        probability: 1,
        func: w=>{
            return Math.random() < 0.6 ? Math.floor(Math.random()*10)+2 : 12
        }
    },
    titleColumn: {
        probability: 1,
        func: w=>{
            if(w.__data_shape && w.__data_shape[0]==='C')return w.columns()[0];
            return null;
        }
    },
    subtitleColumn: {
        probability: 1,
        func: w=>{
            if(w.__data_shape && w.__data_shape[1]==='C')return w.columns()[1];
            return null;
        }
    },
    rangesColumn: {
        probability: 1,
        func: w=>{
            // if(w.__data_shape && w.__data_shape[2]==='V')return w.columns()[2];
            return null;
        }
    },
};
window.g_random_widget_secondary_params = {
    yAxisType: {
        probability: 1,
        func: w=>{
            if(w.__data_shape.indexOf('T') !== -1 && w.orientation() === "vertical"){
                return "time";
            }
            return undefined;
        }
    },
    yAxisTypeTimePattern: {
        probability: 1,
        func: w=>{
            if(w.__data_shape.indexOf('T') !== -1 && w.orientation() === "vertical"){
                return "%Q";
            }
            return undefined;
        }
    },
    xAxisType: {
        probability: 1,
        func: w=>{
            if(w.__data_shape.indexOf('T') !== -1 && w.orientation() === "horizontal"){
                return "time";
            }
            return undefined;
        }
    },
    xAxisTypeTimePattern: {
        probability: 1,
        func: w=>{
            if(w.__data_shape.indexOf('T') !== -1 && w.orientation() === "horizontal"){
                return "%Q";
            }
            return undefined;
        }
    },
    // yAxisTypePowExponent: {
    //     probability: 1,
    //     func: w=>{
    //         if(w.yAxisType && w.yAxisType()==="pow"){
    //             return Math.floor(Math.random()*3)+2;
    //         }
    //         return 2;
    //     }
    // },
    // yAxisTypeLogBase: {
    //     probability: 1,
    //     func: w=>{
    //         if(w.yAxisType()==="log"){
    //             return (Math.floor(Math.random()*3) * 10)+10;
    //         }
    //         return 10;
    //     }
    // },
    xAxisFocus: {
        probability: 0.1,
        func: w=>{
            if(w.orientation && w.orientation()==="horizontal"){
                return true;
            }
            return false;
        }
    },
    regions: {
        probability: 0.3,
        func: w=>{
            if(w.orientation && w.orientation()==="horizontal" && w.data().length > 10){
                var rand1 = Math.floor(Math.random()*10);
                var rand2 = Math.floor(Math.random()*10);
                if(rand1 !== rand2){
                    return [
                        {
                            "x0": w.data()[Math.min(rand1,rand2)][0],
                            "x1": w.data()[Math.max(rand1,rand2)][0]
                        }
                    ];
                }
            }
            return [];
        }
    }
};