window.init_page = n=>{
    init_hpccjs();
    // if(g_dashboards && g_dashboards[0]){
    //     show_dashboard(g_dashboards[0]);
    // }
    g_dashboards.push({
        ddl_url: g_temp_ddl_url,
        ddl_json: JSON.stringify(g_temp_ddl_obj)
    })
    $('#dashboard-select').html('<option value="-1">...</option>'+g_dashboards.map((n,i)=>`<option value="${i}">[${i}] ${n.label}</option>`).join(''))
}
window.require = function(arr,callback){
    callback.apply(this,arr.map(n=>window[n]));
}
function init_hpccjs(){
    window.hpccjs = {};
    for(let pack in window){
        if(pack.indexOf('@hpcc-js/')===0){
            let package = pack.split('/')[1];
            hpccjs[package] = window[pack];
        }
    }
}
function clean_urls(ddl_json_str){
    let new_proxy = 'webmiscdev01.risk.regn.net/brundajx/hpccjs/proxy.php';
    if(ddl_json_str.split('wsurl1\\/').length > 0){

        var url_arr = ddl_json_str.split('"URL":"').slice(1).map(n=>n.split('",')[0]);
        var replace_obj = {};
        url_arr.forEach(function(raw_url){
            let raw_encoded_url = raw_url.split('wsurl1\\/')[1];
            let clean_encoded_url = decodeURIComponent(raw_encoded_url);
            let clean_url = atob(clean_encoded_url);
            replace_obj[raw_url] = clean_url;
        });
        for(var i in replace_obj){
            // ddl_json_str = ddl_json_str.split(i).join(new_proxy+'?enc='+btoa(replace_obj[i]));
            ddl_json_str = ddl_json_str.split(i).join(replace_obj[i]);
        }
    }
    return ddl_json_str;
}
function show_dashboard(d){
    console.log('show dashboard:',d);

    d.ddl_json = clean_urls(d.ddl_json);

    let parsed_ddl = parse_ddl(JSON.parse(d.ddl_json));
    let parsed_layout = d.layout_json ? parse_layout(JSON.parse(d.layout_json)) : {};

    window.g_main = new hpccjs.phosphor.DockPanel().target('placeholder');
    window.g_dashboard = new hpccjs.phosphor.DockPanel();

    window.g_elementcontainer = new hpccjs.marshaller.ElementContainer();
    window.g_d = new hpccjs.marshaller.Dashboard(g_elementcontainer);

    g_dashboard.addWidget(g_d);
    // g_elementcontainer.importV1DDL(d.ddl_url,JSON.parse(d.ddl_json));
    g_elementcontainer.importV1DDL(d.ddl_url,JSON.parse(d.ddl_json));
    let _ddl = new hpccjs.codemirror.JSONEditor().json(JSON.parse(d.ddl_json));
    let _parsed_ddl = new hpccjs.codemirror.JSONEditor().json(parsed_ddl);
    g_main
        .addWidget(g_dashboard,"Dashboard")
        .addWidget(_ddl,"DDL","tab-after",g_dashboard)
        .addWidget(_parsed_ddl,"Parsed DDL","tab-after",_ddl)
        .render(function(){
            // g_d.render();
            g_elementcontainer.refresh();
        })
        ;
}
function dashboard_selected(elm){
    let idx = $(elm).val();
    show_dashboard(g_dashboards[idx]);
}
function show_dashboard2(d){
    console.log('d',d);
    $('#dashboard_title').html(d.label);
    $('#icon').attr('class',`fa ${d.icon}`);
    $('#dashboard-dropdown > ul').html(g_dashboards.map((_d,_idx)=>{
        return `<li onclick="clicked_dashboard_dropdown_item(${_idx})"><i class="fa ${_d.icon}"></i><span>${_d.label}</span></li>`;
    }));
    let parsed_ddl = parse_ddl(JSON.parse(d.ddl_json));
    let parsed_layout = parse_layout(JSON.parse(d.layout_json));

    window.g_main = new hpccjs.phosphor.DockPanel().target('placeholder');
    window.g_dashboard = new hpccjs.phosphor.DockPanel();

    window.g_elementcontainer = new hpccjs.marshaller.ElementContainer();
    window.g_d = new hpccjs.marshaller.Dashboard(g_elementcontainer);

    g_dashboard.addWidget(g_d);
    // g_elementcontainer.importV1DDL(d.ddl_url,JSON.parse(d.ddl_json));
    g_elementcontainer.importV1DDL(g_temp_ddl_url,g_temp_ddl_obj);
    window.g_json = new hpccjs.phosphor.DockPanel()
        .addWidget(new hpccjs.codemirror.JSONEditor().json(parsed_ddl),"Parsed DDL")
        .addWidget(new hpccjs.codemirror.JSONEditor().json(parsed_layout),"Parsed Layout")
        ;
    let _saved = g_json._dock.saveLayout();
    _saved.main.sizes = [0.5,0.5];
    g_json._dock.restoreLayout(_saved);
    g_main
        .addWidget(g_dashboard,"Dashboard")
        .addWidget(g_json,"Parsed JSON","tab-after",g_dashboard)
        .render()
        ;
    
}
function clicked_dashboard_dropdown(){
    $('#dashboard-dropdown').addClass('expanded');

    $('#topnav').off('mouseleave').on('mouseleave',function(){
        setTimeout(function(){
            if($('#dashboard-dropdown:hover').length===0){
                $('#dashboard-dropdown').removeClass('expanded');
            }
        },400);
    });
}
function clicked_dashboard_dropdown_item(idx){
    $('#dashboard-dropdown').removeClass('expanded');
    show_dashboard(g_dashboards[idx]);
    event.stopPropagation();
}