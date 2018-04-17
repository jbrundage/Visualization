function parse_ddl(obj){
    return {
        charttype_arr: _classes(),
        widget_data: _data(),
        widget_parameters: _params(),
        interaction_arr: _interactions(),
        // orig: obj
    };
    function _classes(){
        return JSON.stringify(obj).split(`"charttype":"`).filter((n,i)=>i!==0).map(n=>n.split('"')[0]);
    }
    function _params(){
        return [];
    }
    function _data(){
        return [];
    }
    function _interactions(){
        try{
            return obj.dashboards[0].visualizations.filter(n=>typeof n.events !== "undefined").map(n=>n.events)
        }catch(e){
            console.error(e);
        }
        return [];
    }
}
function parse_layout(obj){
    let _layout_properties = _layout();
    let _widget_properties = _params();
    return {
        widget_classes: _classes(),
        widget_props: _widget_properties,
        cell_props: _layout(),
        orig: obj
    };

    function _classes(){
        return _widget_properties.map(n=>n.widget ? n.widget.__class : n.chart.__class);
    }
    function _params(){
        return _layout_properties.map(c=>c.widget.__properties);
    }
    function _layout(){
        return obj.__properties.content.map(c=>c.__properties);
    }
}
window.g_log = [];
function attach_log(){
    let _c = 0;
    Object.keys(hpccjs.common.Widget.prototype).forEach(n=>{
        if(typeof hpccjs.common.Widget.prototype[n] === "function"){
            let orig = hpccjs.common.Widget.prototype[n];
            hpccjs.common.Widget.prototype[n] = function(w){
                let d1 = new Date().getTime();
                g_log.push([w.id(),`called ${n}`,d1]);
                let ret = orig.apply(this,arguments);
                let d2 = new Date().getTime();
                g_log.push([w.id(),`finished ${n}`,d2 - d1]);
                return ret;
            };
            _c++;
        }
    });
    console.log('log attached to this many functions: ',_c);
}
window.g_temp_ddl_url = "http://10.173.147.1:8010/WsWorkunits/WUResult.json?Wuid=W20170905-105711&ResultName=pro2_Comp_Ins122_DDL";
window.g_temp_ddl_obj = {
    dashboards: [
        {
            id: "Ins122_pro2dashboard",
            label: "pro2dashboard",
            title: "pro2dashboard",
            visualizations: [
                {
                    events: {
                        click: {
                            updates: [
                                {
                                    datasource: "Ins122_dsOutput1",
                                    instance: "Ins122",
                                    mappings: {
                                        year: "year"
                                    },
                                    merge: false,
                                    visualization: "t"
                                }
                            ]
                        }
                    },
                    fields: [
                        {
                            id: "year",
                            properties: {
                                datatype: "string",
                                default: [
                                    "2015"
                                ],
                                label: "year",
                                type: "string"
                            }
                        }
                    ],
                    id: "tFORM",
                    properties: {
                        allowEmptyRequest: true,
                        flyout: true
                    },
                    title: "t",
                    type: "FORM"
                },
                {
                    events: {
                        click: {
                            updates: [
                                {
                                    datasource: "Ins122_dsOutput1",
                                    instance: "Ins122",
                                    mappings: {
                                        workeroffice: "workeroffice"
                                    },
                                    merge: true,
                                    visualization: "b"
                                }
                            ]
                        }
                    },
                    fields: [
                        {
                            id: "bestprojectedlatency_AVE",
                            properties: {
                                datatype: "real",
                                function: "AVE",
                                label: "AVE(bestprojectedlatency)",
                                params: {
                                    param1: "bestprojectedlatency_SUM",
                                    param2: "Base_COUNT"
                                },
                                type: "real"
                            }
                        },
                        {
                            id: "workeroffice",
                            properties: {
                                datatype: "string",
                                label: "workeroffice",
                                type: "string"
                            }
                        }
                    ],
                    id: "t",
                    label: [
                        "AVE(bestprojectedlatency)",
                        "workeroffice"
                    ],
                    properties: {
                        charttype: "TABLE"
                    },
                    source: {
                        id: "Ins122_dsOutput1",
                        mappings: {
                            value: [
                                "bestprojectedlatency_AVE",
                                "workeroffice"
                            ]
                        },
                        output: "View_t"
                    },
                    title: "t",
                    type: "TABLE"
                },
                {
                    events: {
                        click: {
                            updates: [
                                {
                                    datasource: "Ins122_dsOutput1",
                                    instance: "Ins122",
                                    mappings: {
                                        quarter: "quarter"
                                    },
                                    merge: true,
                                    visualization: "c"
                                }
                            ]
                        }
                    },
                    fields: [
                        {
                            id: "bestprojectedlatency_AVE",
                            properties: {
                                datatype: "real",
                                function: "AVE",
                                params: {
                                    param1: "bestprojectedlatency_SUM",
                                    param2: "Base_COUNT"
                                },
                                type: "real"
                            }
                        },
                        {
                            id: "quarter",
                            properties: {
                                datatype: "string",
                                type: "string"
                            }
                        }
                    ],
                    id: "b",
                    properties: {
                        charttype: "AM_BAR"
                    },
                    source: {
                        id: "Ins122_dsOutput1",
                        mappings: {
                            x: [
                                "quarter"
                            ],
                            y: [
                                "bestprojectedlatency_AVE"
                            ]
                        },
                        output: "View_b"
                    },
                    title: "b",
                    type: "LINE"
                },
                {
                    fields: [
                        {
                            id: "bestprojectedlatency_AVE",
                            properties: {
                                datatype: "real",
                                function: "AVE",
                                params: {
                                    param1: "bestprojectedlatency_SUM",
                                    param2: "Base_COUNT"
                                },
                                type: "real"
                            }
                        },
                        {
                            id: "month",
                            properties: {
                                datatype: "string",
                                type: "string"
                            }
                        }
                    ],
                    id: "c",
                    properties: {
                        charttype: "AM_COLUMN"
                    },
                    source: {
                        id: "Ins122_dsOutput1",
                        mappings: {
                            x: [
                                "month"
                            ],
                            y: [
                                "bestprojectedlatency_AVE"
                            ]
                        },
                        output: "View_c"
                    },
                    title: "c",
                    type: "LINE"
                }
            ]
        }
    ],
    datasources: [
        {
            WUID: true,
            filter: [
                {
                    fieldid: "year",
                    nullable: false,
                    rule: "=="
                },
                {
                    fieldid: "workeroffice",
                    nullable: false,
                    rule: "=="
                },
                {
                    fieldid: "quarter",
                    nullable: false,
                    rule: "=="
                }
            ],
            id: "Ins122_dsOutput1",
            outputs: [
                {
                    filter: [
                        {
                            fieldid: "year",
                            nullable: false,
                            rule: "=="
                        }
                    ],
                    from: "Ins122_dsOutput1_View_t",
                    id: "View_t",
                    notify: [
                        "t"
                    ]
                },
                {
                    filter: [
                        {
                            fieldid: "workeroffice",
                            nullable: false,
                            rule: "=="
                        }
                    ],
                    from: "Ins122_dsOutput1_View_b",
                    id: "View_b",
                    notify: [
                        "b"
                    ]
                },
                {
                    filter: [
                        {
                            fieldid: "quarter",
                            nullable: false,
                            rule: "=="
                        }
                    ],
                    from: "Ins122_dsOutput1_View_c",
                    id: "View_c",
                    notify: [
                        "c"
                    ]
                }
            ]
        }
    ],
    hipieversion: "1.9.0",
    visualizationversion: "v1.16.0-rc1"
};