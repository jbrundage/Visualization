const rowHeight = 150;
const placeholder = document.getElementById("placeholder");

placeholder.style.height = (g_data.length * rowHeight)+"px";

window.g_grid = new window["@hpcc-js/layout"].Grid()
    .target("placeholder")
    .gutter(0)
    ;

g_data.forEach((row,i)=>{
    const subgrid = new window["@hpcc-js/layout"].Grid();
    const descriptionWidget = getAttributeDescWidget(row);
    const fill1 = buildGauge1(row);
    const fill2 = buildGauge2(row);
    subgrid
        .setContent(0,0,descriptionWidget,undefined,1,1)
        .setContent(0,1,fill1,undefined,1,1)
        .setContent(0,2,fill2,undefined,1,1)

    g_grid
        .setContent(i,0,subgrid)
        .gutter(0)
        ;
})
window.g_grid2 = new window["@hpcc-js/phosphor"].DockPanel()
    ;
const numericCorrelations = getNumericCorrelationsWidget();
const cardinalityBreakdownWidgetArr = getCardinalityBreakdownWidgetArr();
const popularPatternsWidgetArr = getPopularPatternsWidgetArr();
const subDockPanel1 = new window["@hpcc-js/phosphor"].DockPanel();
const subDockPanel2 = new window["@hpcc-js/phosphor"].DockPanel();

cardinalityBreakdownWidgetArr.forEach(widget=>{
    subDockPanel1
        .addWidget(widget, widget.columns()[0], "tab-after")
        ;
});
popularPatternsWidgetArr.forEach(widget=>{
    subDockPanel2
        .addWidget(widget, widget.columns()[0], "tab-after")
        ;
});

g_grid2
    .addWidget(numericCorrelations,"# Correlations")
    .addWidget(subDockPanel1,"Cardinality", "tab-after")
    .addWidget(subDockPanel2,"Patterns","tab-after",subDockPanel1)
    ;
g_grid
    .setContent(0,1,g_grid2,undefined,5,1)
    .render()
    ;
function getNumericCorrelationsWidget(){
    const numRows = g_data.filter(row=>row.numeric_correlations.Row.length > 0);
    const lineColumns = ["Attribute", ...numRows.map(row=>row.attribute)];
    const lineData = [];
    numRows
        .forEach(row=>{
            const _dataRow = [row.attribute];
            const attrMap = {};
            row.numeric_correlations.Row.forEach(ncRow=>{
                attrMap[ncRow.attribute.trim()] = ncRow.corr;
            });
            console.log('attrMap === ',attrMap);
            lineColumns.forEach((colName,colIdx)=>{
                if(colIdx > 0){
                    _dataRow.push(typeof attrMap[colName] === "undefined" ? 1 : attrMap[colName]);
                }
            });
            lineData.push(_dataRow);
        })
        ;
    return new window["@hpcc-js/chart"].Line()
        .columns(lineColumns)
        .data(lineData);
}
function stringArrayToTree(depth, arr){
    if(depth>100)debugger;
    const uniqueCharMap = {};
    arr.forEach(str=>{
        if(!uniqueCharMap[str[depth]]){
            uniqueCharMap[str[depth]] = [];
        }
        uniqueCharMap[str[depth]].push(str);
    });
    const childCount = Object.keys(uniqueCharMap).length;
    if(childCount > 1){
        const childArr = [];
        Object.keys(uniqueCharMap)
            .forEach(char=>{
                childArr.push(stringArrayToTree(depth+1, uniqueCharMap[char]))
            })
            ;
        return childArr;
    } else if(childCount === 1) {
        const childArr = stringArrayToTree(depth+1, uniqueCharMap[char]);
        const responseNode = {
            "": 
        }
    } else {
        console.error('wtf?');
        debugger;
    }
}
stringArrayToTree(0, ["AABBCC", "AAA", "CCC", "AABCD"]);
function getPopularPatternsWidgetArr(){
    const popularPatternsRows = g_data.filter(row=>row.popular_patterns.Row.length > 0);
    const widgetArr = [];
    popularPatternsRows
        .forEach(row=>{
            const arr = [];
            const countMap = {};
            row.popular_patterns.Row.forEach(pattern=>{
                const str = pattern.data_pattern.trim();
                arr.push(str);
                countMap[str] = pattern.rec_count;
            });
            arr.sort((a,b)=>a.length > b.length ? 1 : -1);
            console.log('arr === ',arr);
            const treeData = {
                "label": row.attribute,
                "children": treeSplit(arr)
            };

            function treeSplit(undefined, _arr) {
                
            }
        })
        ;
        
    return widgetArr;
}
function getCardinalityBreakdownWidgetArr(){
    const cardinalRows = g_data.filter(row=>row.cardinality_breakdown.Row.length > 0);
    const widgetArr = [];
    cardinalRows
        .forEach(row=>{
            const barColumns = [row.attribute, "Record Count"];
            const barData = [];
            row.cardinality_breakdown.Row.forEach(ncRow=>{
                barData.push([ncRow.value.trim(), ncRow.rec_count]);
            });
            console.log('barData === ',barData);
            widgetArr.push(
                new window["@hpcc-js/chart"].Bar()
                    .columns(barColumns)
                    .data(barData)
            );
        })
        ;
        
    return widgetArr;
}
function getAttributeDescWidget(row){
    // const backgroundColor = row.best_attribute_type.slice(0,6) === "string" ? "#f39c12" : "#2980b9";
    return new window["@hpcc-js/other"].Html()
        .html(`<div style="padding:0px;margin:20px;font-size:24px;">
            <span>${row.attribute}</span><br/>
            <span>${row.best_attribute_type}</span>
        </div>`)
        .overflowX("hidden")
        .overflowY("hidden")
        ;
    }
function buildBestTypeWidget(row){
    // const backgroundColor = row.best_attribute_type.slice(0,6) === "string" ? "#f39c12" : "#2980b9";
    return new window["@hpcc-js/other"].Html()
        .html(`<div style="border:1px solid red;padding:0px;margin:20px;font-size:24px;">${row.attribute}</div>`)
        ;
}
// function buildAttributeSummary1(row){
//     const backgroundColor = row.best_attribute_type.slice(0,6) === "string" ? "#f39c12" : "#2980b9";
//     return new window["@hpcc-js/other"].SummaryC()
//         .columns(["Summary", "Score", "Details", "Color"])
//         .data([
//             [
//                 row.best_attribute_type,
//                 row.attribute,
//                 "", backgroundColor]
//         ])
//         .iconOpacity(0)
//         .labelOpacity(0)
//         .mult(0.3)
//         .labelColumn("Summary")
//         .labelAnchor("end")
//         .valueColumn("Score")
//         .moreTextColumn("Details")
//         .moreTextHTML(true)
//         .colorFillColumn("Color")
//         ;
// }
function buildGauge1(row){
    console.log('row.fill_rate === ',row.fill_rate);
    console.log('row.cardinality / row.fill_count === ',row.cardinality / row.fill_count);
    return new window["@hpcc-js/chart"].Gauge()
        .title("Fill %")
        .titleDescription("@hpcc-js/chart")
        .value(row.fill_rate/100)
        .showTick(false)
        ;
}
function buildGauge2(row){
    console.log('row.fill_rate === ',row.fill_rate);
    console.log('row.cardinality / row.fill_count === ',row.cardinality / row.fill_count);
    return new window["@hpcc-js/chart"].Gauge()
        .title("Cardinality / Fill Count")
        .titleDescription("@hpcc-js/chart")
        .value(row.cardinality / row.fill_count)
        .showTick(false)
        ;
}