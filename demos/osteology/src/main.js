window.g_cat_arr = ['chart'];
window.g_exclude_widget_arr = ['MultiChart', 'MultiChartSurface', 'Summary'];

function init_blank_page() {
    $('#top-box').html(widget_type_thumbnails());
    $('#content-box').html('<div id="empty-content"></div>');

    init_draggables('.widget-thumb');
    init_droppables('#empty-content');
}
function init_draggables(sel) {
    $(sel).draggable({
        revert: true,
        scroll: false
    });
}
function init_droppables(sel) {
    $(sel).droppable({
        drop: function (event, ui) {
            var dragged_elm = ui.draggable.get(0);
            var dropped_on_elm = this;
            var _cat = $(dragged_elm).children('.thumb-preview').data('category');
            var _wid = $(dragged_elm).children('.thumb-preview').data('widget-name');
            if (dropped_on_elm.id === 'empty-content') {
                g_tf.categories[_cat][_wid].simple.factory(function (w) {
                    $('#empty-content').remove();
                    window.g_dp = new g_DockPanel().target('content-wrapper').addWidget(w, `${_cat}_${_wid}`).render();
                    init_droppables('.phosphor_DockPanel');
                })
            } else {
                g_tf.categories[_cat][_wid].simple.factory(function (w) {
                    g_dp.addWidget(w, `${_cat}_${_wid}`).render();
                })
            }
        }
    });
}

function get_widget_thumbs_html(tf) {
    var html = '';
    g_cat_arr.forEach(category => {
        for (var widget_name in tf.categories[category]) {
            if (tf.categories[category][widget_name].simple && g_exclude_widget_arr.indexOf(widget_name) === -1) {
                var class_name = `${category}_${widget_name}`;
                var thumb_id = `${class_name}_thumb`;
                html += widget_thumb(category, widget_name);
            }
        }
    });
    return html;
}
function init_widget_thumbs(tf) {
    console.log('test1');
    console.log($('.thumb-preview').length);
    $('.thumb-preview').each(function () {
        var _category = $(this).data('category');
        var _widget_name = $(this).data('widget-name');
        let _target = this;
        console.log('_target');
        console.log(_target);
        tf.categories[_category][_widget_name].simple.factory(function (w) {
            w.target(_target).render(n => {
                init_widget_thumb_scaling(_target);
            });
        })
    });
}
function init_widget_thumb_scaling(t) {
    $(t).each(function () {
        var _rect = this.getBoundingClientRect();
        var $elm = $(this).children().first();
        var _elm_rect = $elm.get(0).getBoundingClientRect();
        var _scale = Math.min(_rect.height / _elm_rect.height, _rect.width / _elm_rect.width);
        $elm.css('transform', `scale(${_scale})`);
        $elm.css('position', 'relative');
        $elm.css('top', (_elm_rect.height * (1 - _scale) * -0.5) + 'px');
        $elm.css('left', (_elm_rect.width * (1 - _scale) * -0.5) + 'px');
    })
}
function get_output_html() {
    return '<div id="empty-content"></div>';
}

function widget_thumb(_category, _widget_name) {
    return `
        <div class="widget-thumb class-${_category}_${_widget_name}">
            <div class="thumb-name">${_category}_${_widget_name}</div>
            <div id="${_category}_${_widget_name}_thumb" class="thumb-preview" data-category="${_category}" data-widget-name="${_widget_name}"></div>
        </div>
    `;
}
function widget_type_thumbnails(class_arr) {
    var class_arr = ["chart_Bar", "chart_Column", "chart_Pie"];
    var html = '';
    class_arr.forEach(function (n) {
        html += _thumb(n);
    });
    return html;

}