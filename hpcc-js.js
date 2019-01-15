window.hpccjs = {};
Object.keys(window)
    .filter(key=>key.slice(0,9)==="@hpcc-js/")
    .map(key=>key.slice(9))
    .forEach(package=>{
        window.hpccjs[package]={};
        Object.keys(window[`@hpcc-js/${package}`])
            .forEach(widget=>{
                hpccjs[package][widget] = window[`@hpcc-js/${package}`][widget];
            })
    })
    ;
