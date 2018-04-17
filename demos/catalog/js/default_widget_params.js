window.g_default_widget_params = {
    "amchart_Gauge": {
        low: 0,
        high: 200
    }
};
function apply_default_widget_params(w){
    let _classID = w.classID();
    if(typeof g_default_widget_params[_classID] !== "undefined"){
        // debugger;
        for(let param_name in g_default_widget_params[_classID]){
            let _val = g_default_widget_params[_classID][param_name];
            if(typeof w[param_name] === "function"){
                w[param_name](_val);
            }
        }
    }
}
function apply_random_widget_params(w){
    let _class = w.classID();
    Object.keys(g_random_widget_primary_params).forEach(function(_key){
        if(Math.random() < g_random_widget_primary_params[_key].probability){
            if(typeof w[_key] === "function"){
                let _val = g_random_widget_primary_params[_key].func(w);
                if(typeof _val !== "undefined"){
                    w[_key](_val);
                }
            }
        }
    });
    Object.keys(g_random_widget_secondary_params).forEach(function(_key){
        if(Math.random() < g_random_widget_secondary_params[_key].probability){
            if(typeof w[_key] === "function"){
                let _val = g_random_widget_secondary_params[_key].func(w);
                if(typeof _val !== "undefined"){
                    w[_key](_val);
                }
            }
        }
    });
    if(typeof g_widget_special_handling[_class] === "function"){
        g_widget_special_handling[_class](w);
    }
}