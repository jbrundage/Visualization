// General Page Functions

var g_widget;
var s_widget;
var doc_page;
function quickChartInit(path, width, height){
    var path = "src/" + path;

    require([path,"src/common/Palette"], function(WidgetObj, Palette) {

    function clonePaletteID(sourceID, targetID) {Palette.ordinal(sourceID).clone(targetID); return targetID;}

        var i = 0;
        g_widget = new WidgetObj()
            .target('widget-wrapper')
            //.paletteID(clonePaletteID("default","uid_" + i++))
            .testData()
            .render(function (widget) {
                discover_this(widget);
                updateSerialization(widget);
                $("#exportPNGButton").click(function() {
                    //var url = ""
                   //document.getElementById('myiframe').src = url;
                });
            })
        ;
        $('.loading_spinner').remove();
    });

}
function discover_this(widget_obj) { // from dermatology_modal.js
    $('#discover-pane').empty();
    require(["src/other/PropertyEditor"], function(PropertyEditor) {
        var PropertyEditor = new PropertyEditor()
            .data([widget_obj])
            .target("discover-pane")
            .paramGrouping("By Widget")
            .collapsibleSections(false)
            .show_settings(false)
            .render()
        ;
        PropertyEditor.onChange = function (widget, propID) {
            if (propID === "columns") {
            } else if (propID === "data") {
            } else {
                updateSerialization(widget);
            }
        };
    });
}
function updateSerialization(widget) {
    require(["src/other/Persist"], function (Persist) {
        function displaySerialization(sourceWidget) {
            $('#serialization-test-wrapper').empty();
            Persist.clone(sourceWidget, function (widget) {
                widget
                    .target("serialization-test-wrapper")
                    .render()
                ;
                $('a[href="#serialization-test-pane"]').unbind().on("shown.bs.tab",function(e){
                     updateSerialization(widget);
                });
                s_widget = widget;
            });
        }

        function displaySerializationText(sourceWidget) {
            sourceWidget = sourceWidget || currWidget;
            var text = JSON.stringify(Persist.serializeToObject(sourceWidget, null, false), null, "  ");
            d3.select("#serialization-json-wrapper")
                .attr("class", "prettyprint")
                .text(text)
            ;
        }
        displaySerialization(widget);
        displaySerializationText(widget);
    });
}
function update_chart(el) {
    // Note: Data Attr(s) in Handlebar Template
    var chartObjPath = $(el).data("value"),
        chartObjWidth = parseInt($(el).data("width")),
        chartObjHeight = parseInt($(el).data("height")),
        //chartObjExample = $(el).data("example-url");
        chartObjExample = $(el).data("value");

    quickChartInit(chartObjPath, chartObjWidth, chartObjHeight);
    getExampleCode("sample_html/" + chartObjPath + ".html");
    $('#hierarchy-wrapper').empty();
    getHierarchyDynamically('../../src/' + chartObjPath, chartObjPath);
    $('a[href="#chartTab1"]').html(el.html()); // Update Tab Title
    doc_page = chartObjPath; //for show doc button
    /* Doc Section */
    //resetDocVars();  // Reset Vars
    //buildWidgetDocumentation(chartObjPath); // Build Doc and Update
}
function getExampleCode(exUrl){
    $.ajax({
        url: exUrl,
        success: function(html) {
            $('#example-code-pre').text(html);
            $('#example-code-pre').removeClass('prettyprinted');
            prettyPrint();
        },
        error: function() {
            $('#example-code-pre').text('Example Code File Not Found: ' + exUrl );
        }
    });
    $('#get_example_code').attr('href', exUrl);
}
