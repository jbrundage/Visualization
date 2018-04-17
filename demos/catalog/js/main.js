window.g_error_log = [];
window.g_default = {
    package: "chart",
    widget: "Column",
    data: "CVV",
};
function init_page(){
    init_hpccjs();

    window.$package_list = $('#package_list');
    window.$widget_list = $('#widget_list');
    window.$data_list = $('#data_list');
    $package_list.html(package_list_html('chart'));
    $widget_list.html(widget_list_html('chart','...'));
    $data_list.html(data_list_html('CVV'));

    animate_list_to($package_list,$package_list.find('.active').index());
    animate_list_to($widget_list,$widget_list.find('.active').index());
    animate_list_to($data_list,$data_list.find('.active').index());

    $('.list-wrapper').on('mouseenter',function(){
        if(!window.already_expanding_a_list){
            window.already_expanding_a_list = true;
            expand_this_list.call(this);
        }
    });
    $('.list-wrapper').on('mouseleave',function(){
        window.already_expanding_a_list = false;
    });
    expanded_item_click();
}
window.g_log = [];
function attach_log(){
    let _c = 0;
    Object.keys(hpccjs.common.Widget.prototype).forEach(n=>{
        if(typeof hpccjs.common.Widget.prototype[n] === "function"){
            let orig = hpccjs.common.Widget.prototype[n];
            hpccjs.common.Widget.prototype[n] = function(_){
                try{
                    let d1 = new Date().getTime();
                    let _v = ``;
                    if(typeof _ === "object" && typeof _.id === "function"){
                        _v = `%_${_.id()}_%`;
                    }
                    else if(typeof _ !== "undefined" && !(_ instanceof HTMLElement)){
                        _v = typeof _ === "object" ? JSON.stringify(_) : `'${_}'`;
                    }
                    g_log.push([this.id(),`.${n}(${_v})`,d1]);
                }catch(e){}
                return orig.apply(this,arguments);
            };
            _c++;
        }
    });
    console.log('log attached to this many functions: ',_c);
}
function show_log(_id){
    return g_log.filter(n=>n[0]==_id)
}
function init_hpccjs(){
    window.hpccjs = {};
    for(let pack in window){
        if(pack.indexOf('@hpcc-js/')===0){
            let package = pack.split('/')[1];
            hpccjs[package] = window[pack];
        }
    }
    // window.hpccjs.dashboard = g_hpccjs_dashboard;
}
function init_widget(package,widget,target,columns,data,data_shape){
    if(widget_needs_more_data(package,widget)){
        data = random_data(data_shape,150);
    }
    let _w = new hpccjs[package][widget]()
        .target(target)
        .columns(columns)
        .data(data)
        ;
    _w.__data_shape = data_shape;
    apply_default_widget_params(_w);
    apply_random_widget_params(_w);
    _w.render(function () {
        $(target).prepend(get_thumb_header_text(package,widget,data_shape));
    });
    g_widgets.push(_w);
}

function widget_needs_more_data(package,widget){
    let arr = ["chart_HexBin"];
    return arr.indexOf(package+'_'+widget)!==-1;
}
function expand_this_list(){
    $('#expanded-list').remove();
    let rect = this.getBoundingClientRect();
    let $div = $('<div id="expanded-list"></div>');
    let exp_info = get_expand_info(this);
    let curr_col = 0;
    let $p = exp_info.$items.eq(0).closest('ul');
    let _pid = $p.attr('id');
    exp_info.$items.each(function(i){

        $div.append(`
            <div class="expanded-item btn btn-primary" data-text="${$(this).text()}" data-category="${ _pid }" style="
                height: ${exp_info.item_h}px;
                width: ${exp_info.item_w}px;
                " onclick="expanded_item_click(this)">
                ${$(this).text()}
            </div>
        `);
    });
    let _left = (rect.left + (rect.width/2)) - (exp_info.width/2);
    if(_left + exp_info.width > window.innerWidth){
        _left = window.innerWidth - exp_info.width - 8;
    }
    $div.css({
        position: 'fixed',
        // left: rect.left + (rect.width/2),
        left: _left > 0 ? _left : 8,
        top: rect.top + rect.height,
        height: 0,
        width: exp_info.width
    })
    .animate({
        left: _left > 0 ? _left : 8,
        top: rect.top + rect.height,
        height: exp_info.height * 2,
        width: exp_info.width
    },200,'linear',function(){
        console.log('animation done');
    })
    $('body').append($div)
    $div.on('mouseleave',function(){
        setTimeout(function(){
            if(!$div.is(':hover')){
                $div.fadeOut();
            }
        },400);
    })
}
function expanded_item_click(elm){
    let _category = '';
    if(!elm){
        elm = $('#widget_list .active').get(0);
        _category = $(elm).closest('ul').attr('id');
    } else {
        _category = $(elm).data('category');
    }
    let data_shape_name = $.trim($('#data_list .active').text());
    switch(_category){
        case 'package_list':
            var package = $.trim($(elm).text());
            package_list_item_click(package);
            break;
        case 'widget_list':
            window.g_columns = random_columns(data_shape_name);
            window.g_data = random_data(data_shape_name);
            var package = $.trim($('#package_list .active').text());
            var widget = $.trim($(elm).text());
            if(widget === "..."){
                package_list_item_click(package);
            }else{
                widget_list_item_click(package,widget);
            }
            break;
        case 'data_list':
            data_list_item_click($.trim($(elm).text()));
            break;
    }
}
function get_expand_info(elm){
    let $elm = $(elm);
    let active = $elm.find('.active').text();
    let $items = $elm.find('li').not('.hidden');
    let item_h = 27;
    let item_w = 300;
    let item_count = $items.length;
    let items_per_column = Math.ceil(item_count/2);
    let column_count = item_count/items_per_column;
    return {
        item_h: item_h,
        item_w: item_w,
        height: item_h * items_per_column,
        width: item_w * column_count,
        $items: $items
    }
}
function package_list_html(_active_package){
    let ret = '';
    for(let package in hpccjs){
        if(_not_in_excluded_packages(package)){
            let _class = package === _active_package ? "active" : "";
            ret += `<li class="${_class}" data-text="${package}">${package}</li>`;
        }
    }
    return ret;
}
function widget_list_html(_active_package,_active_widget){
    let ret = '';
    for(let package in hpccjs){
        if(_not_in_excluded_packages(package)){
            
            let _visible_class = package === _active_package ? "" : " hidden";
            let _active_class = '...' === _active_widget ? " active" : "";
            ret += `<li class="${_active_class}${_visible_class}" data-package="${package}" data-text="...">...</li>`;
            for(let widget in hpccjs[package]){
                if(_not_in_excluded_widgets(package,widget)){
                    _active_class = widget === _active_widget ? " active" : "";
                    ret += `<li class="${_active_class}${_visible_class}" data-package="${package}" data-text="${widget}">${widget}</li>`;
                }
            }
        }
    }
    return ret;

}
function changed_data_filter(){
    if($('#data_filter_select').val() === "3"){
        let $data_list = $('#data_list');
        $('#data_list').show();
        animate_list_to($data_list,$data_list.find('.active').index());
    } else {
        $('#data_list').hide();
    }
    expanded_item_click();
}
function _not_in_excluded_widgets(package,widget){
    return g_exclude_widget_list.indexOf(package+'_'+widget)===-1;
}
function _not_in_excluded_packages(package){
    return g_exclude_package_list.indexOf(package)===-1;
}
function data_list_html(_active_data){
    let ret = '';
    g_data_shapes.forEach(function(data_shape){
        let _class = data_shape === _active_data ? "active" : "";
        ret += `<li class="${_class}" data-text="${data_shape}">${data_shape}</li>`;
    })
    return ret;
}
function animate_list_to($list,idx){
    $list.css("margin-top",0);
    setTimeout(function(){
        let rect = $list.children().eq(idx).offset();
        $list.animate({
            "margin-top": -(rect.top-5)
        })
    },100);
}