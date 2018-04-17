function package_list_item_click(package) {
    window.g_widgets = [];

    $('#package_list .active').removeClass('active');
    $('#package_list [data-text="' + package + '"]').addClass('active');
    animate_list_to($('#package_list'), $('#package_list').find('.active').index());
    $('#widget_list .active').removeClass('active');
    $('#widget_list li').addClass('hidden');
    $('#widget_list li[data-package="' + package + '"]').removeClass('hidden');
    $('#widget_list li[data-package="' + package + '"][data-text="..."]').addClass('active');
    animate_list_to($('#widget_list'), $('#widget_list').find('.active').index());

    if (typeof g_package_special_handling[package] !== "undefined") {
        g_package_special_handling[package]();
        return;
    }

    let data_shape_name = 'CVV';
    let _ds_mode = $('#data_filter_select').val();
    if (_ds_mode === "1") {
        let _best_ds = 'CVV';
        let _count = 0;
        $.trim($('#data_list .active').text())
        Object.keys(g_data_structures).forEach(_ds => {
            let _curr_count = g_data_structures[_ds].widgets.filter(_wn => _wn.indexOf(package + '_') === 0).length;
            if (_curr_count > _count) {
                _best_ds = _ds;
                _count = _curr_count;
            }
        });
        data_shape_name = _best_ds;
    }
    window.g_columns = random_columns(data_shape_name);
    window.g_data = random_data(data_shape_name);
    var $body = $('#body-wrapper');
    $body.html('');
    let w_count = 0;
    Object.keys(hpccjs[package]).forEach((widget) => {
        if (_ds_mode === "2" || g_data_structures[data_shape_name].widgets.indexOf(`${package}_${widget}`) !== -1) {
            w_count++;
        }
    });
    Object.keys(hpccjs[package]).forEach((widget) => {
        if (_ds_mode === "2" || g_data_structures[data_shape_name].widgets.indexOf(`${package}_${widget}`) !== -1) {
            let $div = $get_widget_thumb(w_count);
            $body.append($div);
            try {
                init_widget(package, widget, $div.get(0), g_columns, g_data, data_shape_name);
            } catch (e) {
                g_error_log.push(e);
                $div.html('');
                $div.prepend(get_thumb_error_header_text(package, widget, data_shape_name));
                $div.append(get_thumb_error_body_text(package, widget, data_shape_name));
            }
        }
    });
}

function $get_widget_thumb(widget_count) {
    let _w = 0;
    let _h = 0;
    let _w_offset = -30;
    let _h_offset = -40;
    let wrapper_h = $('#wrapper').height();
    let wrapper_w = $('#wrapper').width();

    _grid_count = get_grid_count(widget_count);
    _w = (wrapper_w + _w_offset) / _grid_count;
    _h = (wrapper_h + _h_offset) / _grid_count;
    _w += _w_offset;
    _h += _h_offset;
    return $(`<div class="widget-thumb" style="height:${_h}px;width:${_w}px;"></div>`);
}

function widget_list_item_click(package, widget) {
    window.g_widgets = [];
    $('#widget_list .active').removeClass('active');
    $('#widget_list [data-package="' + package + '"][data-text="' + widget + '"]').addClass('active');
    animate_list_to($('#widget_list'), $('#widget_list').find('.active').index());

    var $body = $('#body-wrapper');
    $body.html('');

    if (typeof g_widget_special_handling[package + '_' + widget] !== "undefined") {
        g_widget_special_handling[package + '_' + widget]();
        return;
    }

    let valid_data_shapes = [];

    g_data_shapes.forEach((data_shape_name) => {
        let _ds_mode = $('#data_filter_select').val();
        if (_ds_mode === "2" || g_data_structures[data_shape_name].widgets.indexOf(`${package}_${widget}`) !== -1) {
            valid_data_shapes.push(data_shape_name);
        }
    });
    if (valid_data_shapes.length === 0) valid_data_shapes.push('CVV');
    valid_data_shapes.forEach((data_shape_name) => {
        let $div = $get_widget_thumb(valid_data_shapes.length);
        $body.append($div);
        window._columns = random_columns(data_shape_name);
        window._data = random_data(data_shape_name);
        try {
            init_widget(package, widget, $div.get(0), _columns, _data, data_shape_name);
        } catch (e) {
            g_error_log.push(e);
            $div.html('');
            $div.prepend(get_thumb_error_header_text(package, widget, data_shape_name));
            $div.append(get_thumb_error_body_text(package, widget, data_shape_name));
        }
    });
}

function get_grid_count(n) {
    let _roots = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100];
    let _gt_arr = _roots.filter(_n => n <= _n);
    return _gt_arr.length > 0 ? Math.sqrt(_gt_arr[0]) : 10;
}

function data_list_item_click(data_shape_name) {
    window.g_widgets = [];

    $('#data_list .active').removeClass('active');
    $('#data_list [data-text="' + data_shape_name + '"]').addClass('active');
    animate_list_to($('#data_list'), $('#data_list').find('.active').index());

    var $body = $('#body-wrapper');
    $body.html('');
    window.g_columns = random_columns(data_shape_name);
    window.g_data = random_data(data_shape_name);
    let package = $('#package_list .active').data('text');
    let _count = 0;
    Object.keys(hpccjs[package]).forEach((widget) => {
        let _ds_mode = $('#data_filter_select').val();
        if (_ds_mode === "2" || g_data_structures[data_shape_name].widgets.indexOf(`${package}_${widget}`) !== -1) {
            _count++;
        }
    });
    Object.keys(hpccjs[package]).forEach((widget) => {
        let _ds_mode = $('#data_filter_select').val();
        if (_ds_mode === "2" || g_data_structures[data_shape_name].widgets.indexOf(`${package}_${widget}`) !== -1) {
            let $div = $get_widget_thumb(_count);
            $body.append($div);
            try {
                init_widget(package, widget, $div.get(0), g_columns, g_data, data_shape_name);
            } catch (e) {
                g_error_log.push(e);
                $div.html('');
                $div.prepend(get_thumb_error_header_text(package, widget, data_shape_name));
                $div.append(get_thumb_error_body_text(package, widget, data_shape_name));
            }
        }
    });
}

function get_thumb_header_text(package, widget, data) {
    return `
        <span>
            <b>${package}.${widget}</b>
            <i onclick="clicked_header_text(this)">${data}</i>
            <i class="icon-btn right fa fa-code" onclick="clicked_header_text(this)"></i>
            <i class="icon-btn right fa fa-heart-o" onclick="clicked_save_favorite(this)"></i>
        </span>
    `;
}

function get_thumb_error_header_text(package, widget, data) {
    return `
        <span>
            <b style="color: red;" onclick="clicked_header_text(this)">${package}.${widget}</b>
            <i style="color: red;" onclick="clicked_header_text(this)">${data}</i>
        </span>
    `;
}

function get_thumb_error_body_text(package, widget, data) {
    return `
        <br/><br/><br/>
        <p style="color: red;margin-left:15px;">Error Thrown</p>`;
}

function clicked_save_favorite(that) {
    let $b = $(that).parent().find('b');
    let $i = $(that).parent().find('i');
    let b_text = $b.text();
    let i_text = $i.text();
    let $thumb = $b.closest('.widget-thumb');

    let _thumb_code_str = get_thumb_code($thumb);

    let _fav_str = localStorage.getItem('hpccjs_favorites')
    let _fav_arr = [];
    if (_fav_str !== null) {
        _fav_arr = JSON.parse(_fav_str);
    }
    _fav_arr.push(_thumb_code_str);
    localStorage.setItem('hpccjs_favorites', JSON.stringify(_fav_arr));

    $(that)
        .addClass('red-text')
        .addClass('fa-heart')
        .removeClass('fa-heart-o')
        ;

    // alert('Saved as a favorite.');
}

function clicked_randomize() {
    expanded_item_click();
}

function clicked_search_plus() {
    if (typeof window.g_zoom === "undefined") g_zoom = 30.333;
    g_zoom *= 1.2;
    $('.widget-thumb').each(function () {
        $(this).css('width', g_zoom + `%`);
        let elm = $(this).find('.common_Widget').get(0);
        if (elm && elm.__data__) elm.__data__.resize().render();
    })
}

function clicked_search_minus() {
    if (typeof window.g_zoom === "undefined") g_zoom = 30.333;
    g_zoom *= 0.8;
    $('.widget-thumb').each(function () {
        $(this).css('width', g_zoom + `%`);
        let elm = $(this).find('.common_Widget').get(0);
        if (elm && elm.__data__) elm.__data__.resize().render();
    })
}

function clicked_error(that) {
    let $thumb = $(that).closest('.widget-thumb');
    show_error_modal($thumb);
}

function clicked_dermatology(that) {
    let $thumb = $(that).closest('.widget-thumb');
    show_dermatology($thumb);
}

function clicked_header_text(that) {
    let $b = $(that).parent().find('b');
    let $i = $(that).parent().find('i');
    let b_text = $b.text();
    let i_text = $i.text();
    let $thumb = $b.closest('.widget-thumb');
    show_modal_thumb($thumb);
}

function get_thumb_code($thumb) {
    let w = $thumb.find('.common_Widget').first().get(0).__data__;
    let _class = w.classID();
    let _code_arr = [`new hpccjs.${_class.split('_').join('.')}()
    .target('myHtmlElementId')
    .columns(${JSON.stringify(w.columns())})
    .data([
        ${w.data().map(row => JSON.stringify(row)).join(',\n        ')}
    ])`];
    _code_arr = _code_arr.concat(
        w.publishedProperties(false, true).filter(prop => {
            return prop.id !== "fields" && w[prop.id + '_modified']()
        })
            .sort((a, b) => a.id > b.id ? 1 : -1)
            .map(prop => {
                let _v = _prop_val(w[prop.id]());
                return typeof _v === "undefined" ? '' : `    .${prop.id}(${_v})`;
            })
    )
    _code_arr.push('    .render()');
    return _code_arr;
}

function show_modal_thumb($thumb) {
    let w = $thumb.find('.common_Widget').first().get(0).__data__;
    let _class = w.classID();
    let _title = _class.split('_').join('.');
    let _code_arr = get_thumb_code($thumb);
    let _widget = new hpccjs.other.Html().html(`
        <div id="myHtmlElementId" style="width:100%;top:0px;height:25%;"></div>
        <div id="modal_code_preview" style="width:100%;bottom:0px;height:75%;"></div>
    `);
    let _callback = function () {
        eval(_code_arr.join(''))
        new hpccjs.codemirror.JSEditor()
            .target('modal_code_preview')
            .text(_code_arr.join('\n'))
            .render()
    };
    let _h = ($thumb.height() * 4) + 'px';
    let _w = $thumb.width() + 'px';
    show_modal(_title, _w, _h, _widget, _callback);
}
function clicked_view_favorites() {
    let fav_str = localStorage.getItem('hpccjs_favorites');
    let fav_arr = JSON.parse(fav_str);

    $('#body-wrapper').html('');
    fav_arr.forEach((n, i) => {
        let $thumb = $get_widget_thumb(fav_arr.length);
        let _thumb_id = `fav_thumb_${i}`;
        $thumb.attr('id', _thumb_id);
        $('#body-wrapper').append($thumb);
        eval(n.join('').split("'myHtmlElementId'").join(`'${_thumb_id}'`));
    })
}
function _prop_val(v) {
    let ret = 'null';
    try {

        if (typeof v === "object" && v !== null) {
            return JSON.stringify(v);
        } else if (typeof v === "string") {
            return `"${v}"`;
        } else {
            return v;
        }
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

function clicked_movies() {
    let _h = $('#wrapper').height();
    let _w = $('#wrapper').width();
    $('#body-wrapper').html('<div id="placeholder" style="width:' + _w + 'px;height:' + (_h * 0.9) + 'px"></div>');
    window.g_movie_panel = new hpccjs.phosphor.DockPanel().target('placeholder');
    window.g_movie_tree = undefined;
    while (typeof g_movie_tree === "undefined") {
        let _rand_tree_widget = Object.keys(hpccjs.tree)[Math.floor(Object.keys(hpccjs.tree).length * Math.random())]
        try {
            window.g_movie_tree = new hpccjs.tree[_rand_tree_widget]().data(g_hierarchy_movie_data);
        } catch (e) {

        }
    }
    g_movie_panel
        .addWidget(g_movie_tree, "test")
        .render();
}

function showoff_map() {
    let _h = $('#wrapper').height();
    let _w = $('#wrapper').width();
    $('#body-wrapper').html('<div id="placeholder" style="width:' + _w + 'px;height:' + (_h * 0.9) + 'px"></div>');
    window.g_movie_panel = new hpccjs.phosphor.DockPanel().target('placeholder');
    window.g_movie_tree = undefined;
    while (hpccjs.tree && typeof g_movie_tree === "undefined") {
        let _rand_tree_widget = Object.keys(hpccjs.tree)[Math.floor(Object.keys(hpccjs.tree).length * Math.random())]
        try {
            window.g_movie_tree = new hpccjs.tree[_rand_tree_widget]().data(g_hierarchy_movie_data);
        } catch (e) {

        }
    }
    g_movie_panel
        .addWidget(g_movie_tree, "test")
        .render();
}

function show_modal(_title, _w, _h, _widget, _callback) {
    window.g_modal = new hpccjs.layout.Modal()
        .target('wrapper')
        .title(_title)
        .minWidth(_w)
        .minHeight(_h)
        .widget(_widget)
        .render(_callback)
}

function show_dermatology($thumb) {
    let w = $thumb.find('.common_Widget').first().get(0).__data__;
    let _class = w.classID();
    let _title = _class.split('_').join('.');
    let _code_arr = [`var _derm_widget = new hpccjs.${_class.split('_').join('.')}()
    .target('myHtmlElementId')
    .columns(${JSON.stringify(w.columns())})
    .data([
        ${w.data().map(row => JSON.stringify(row)).join(',\n        ')}
    ])`];
    _code_arr = _code_arr.concat(
        w.publishedProperties(false, true).filter(prop => {
            return prop.id !== "fields" && w[prop.id + '_modified']()
        })
            .sort((a, b) => a.id > b.id ? 1 : -1)
            .map(prop => {
                let _v = _prop_val(w[prop.id]());
                return typeof _v === "undefined" ? '' : `    .${prop.id}(${_v})`;
            })
    )
    _code_arr.push('    ;');
    window.g_modal = new hpccjs.layout.Modal()
        .target('wrapper')
        .title(_title)
        .minWidth('800px')
        .minHeight('800px')
        .widget(
            new hpccjs.other.Html().html(`
                <div id="myHtmlElementId" style="width:100%;top:0px;height:100%;"></div>
            `)
        )
        .render(function () {
            eval(_code_arr.join(''))
            new hpccjs.composite.Dermatology()
                .target('myHtmlElementId')
                .widget(_derm_widget)
                .showToolbar(true)
                .render()
        })

    function _prop_val(v) {
        let ret = 'null';
        try {

            if (typeof v === "object" && v !== null) {
                return JSON.stringify(v);
            } else if (typeof v === "string") {
                return `"${v}"`;
            } else {
                return v;
            }
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }
}