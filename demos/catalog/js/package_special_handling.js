window.g_package_special_handling = {
    "map": function () {
        $('#body-wrapper').html('');
        let $t = $get_widget_thumb(1);
        $('#body-wrapper').append($t);
        new hpccjs.map.GMap()
            .target($t.get(0))
            .render();
    },
    "marshaller": function () {
        $('#body-wrapper').html('');

    },
    "layout": function () {
        $('#body-wrapper').html('');
        ChartPanel_examples()
    },
};
window.g_appended_panel_count = 0;

function ChartPanel_examples() {
    window.g_appended_panel_count++;
    var arr = [200, 300]
    // console.log('arr');
    // console.log(arr);
    // arr.forEach(function(n,i){
    //     arr.forEach(function(n2,i2){
    let i = 0;
    let i2 = 0;
    let _id = `pt_${i}_${i2}`;
    let _w = 500;
    let _h = 200;
    $('#body-wrapper').append(
        $(`<div id="${_id}" class="panel_thumb" style="float:left;border:1px solid orangered;margin-right:130px;height:${_h}px;width:${_w}px;"></div>`)
    );
    $('#body-wrapper').append(
        $(`<div id="cp_test2" class="panel_thumb" style="float:left;border:1px solid orangered;margin-right:130px;height:500px;width:500px;"></div>`)
    );
    new hpccjs.layout.ChartPanel()
        .title(_id + ` (500 x 200)`)
        .titleIcon('A')
        .target(_id)
        .widget(new hpccjs.dgrid.Table())
        .columns(random_columns('CVVV'))
        .data(random_data('CVVV'))
        .render()
        ;
    new hpccjs.phosphor.DockPanel()
        .target('cp_test2')
        .addWidget(
            new hpccjs.layout.ChartPanel()
                .title(`Testing CP in DP`)
                .titleIcon('A')
                .widget(new hpccjs.dgrid.Table())
                .columns(random_columns('CVVV'))
                .data(random_data('CVVV'))
        )
        .render(function (w) {
            w.addWidget(random_cp_table());
            w.render(function (w) {
                w.addWidget(random_cp_table());
                w.render();
            });
        })
        ;
    //     });
    // });
}
function random_cp_table() {
    return new hpccjs.layout.ChartPanel()
        .title('random cp table')
        .titleIcon('A')
        .widget(new hpccjs.dgrid.Table())
        .columns(random_columns('CVVV'))
        .data(random_data('CVVV'))
}
window.g_exclude_package_list = [
    "util",
    "html",
    // "comms",
    "common",
    "api",
    "amchart",
    "c3chart",
    "google",
    "handson",
    "codemirror",
    "dgrid-shim",
    "phosphor",
    "preact-shim"
];