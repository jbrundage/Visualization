window.g_logs = [];
window.g_log_filters = [
    {label:"size",filter:function(name){return name === "size"}}
]
function init_logging(){
    g_log_filters.forEach(n=>{

    })
}
function log_modal(){
    let _log_analysis = analyze_log('.size(',300);

    window.g_modal = new hpccjs.layout.Modal()
    .target('body-wrapper')
    .title('Title')
    .minWidth('800px')
    .minHeight('800px')
    
    .widget(
        new hpccjs.chart.Column()
            .xAxisOverlapMode('rotate')
            .xAxisLabelRotation(90)
            .columns(['IDFN','Count'])
            .data(_log_analysis.idfn_data)
        )
    .render()
    ;
}
function analyze_log(filter_txt, lim){
    let _lim = typeof lim === "undefined" ? 40 : lim;
    let ret = {};
    ret.id_arr = [];
    ret.idfn_arr = [];
    ret.id_counts = {};
    ret.idfn_counts = {};
    g_log.forEach(log_row=>{
        let _id = log_row[0];
        let _fn = log_row[1];
        if(typeof filter_txt === "undefined" || _fn.split(filter_txt).length > 1){
            
            let _idfn = _id+'|'+_fn;
            if(ret.id_arr.indexOf(_id)===-1){
                ret.id_arr.push(_id);
                ret.id_counts[_id] = 0;
            }
            if(ret.idfn_arr.indexOf(_idfn)===-1){
                ret.idfn_arr.push(_idfn);
                ret.idfn_counts[_idfn] = 0;
            }
            ret.id_counts[_id]++;
            ret.idfn_counts[_idfn]++;
        }
    });
    ret.id_data = ret.id_arr.map(n=>[
        n,
        ret.id_counts[n]
    ]);
    ret.idfn_data = ret.idfn_arr.map(n=>[
        n.length > _lim ? n.slice(0,_lim-3)+'...' : n,
        ret.idfn_counts[n]
    ]);
    return ret;
}