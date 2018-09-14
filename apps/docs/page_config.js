
function init_page_config() {
    tab_arr = [
        {
            "label": "By Package",
            "icon": "fa-archive",
            "data": function (data_map) {
                return Object.keys(hpccjs).sort().map(package_name => {
                    return {
                        "label": package_name,
                        "children": Object.keys(hpccjs[package_name]).map(widget_name => {
                            const widget_sample_arr = get_widget_sample_paths(widget_name);
                            if (widget_sample_arr.length > 0) {
                                return {
                                    "label": widget_name,
                                    "click_to_show_properties": true,
                                    "children": widget_sample_arr.sort().map(path => {
                                        return {
                                            "label": path.split('/').slice(-1),
                                            "path": path,
                                        }
                                    })
                                }
                            }
                            return false
                        }).filter(n => n)
                    };
                }).filter(n => n.children && n.children.length > 0)
            },
            "label_onclick": function () {
                let meta = $(this).data("meta");
                console.log('this === ', this);
                let widget_name = $(this).text();
                let package_name = $(this).parents(".list-item").last().find(".list-item-label-btn").first().text();
                if ($(this).is(".list-item-label-btn") && $(this).closest(".list-item").is(".show-widget-properties")) {
                    $("#breadcrumbs-list").html(`Properties for: <b>${widget_name}</b>`);
                    $("#content").html(properties_html(widget_name));
                } else {
                    $("#breadcrumbs-list").html(samples_breadcrumbs_html(meta));
                    $("#content").html(gallery_iframe_html(
                        playground_url + "?" + meta
                    ));
                }
            }
        },
        {
            "label": "Alphabetical",
            "icon": "fa-sort-alpha-asc",
            "data": function () {
                let ret = []
                Object.keys(hpccjs).forEach(package_name => {
                    Object.keys(hpccjs[package_name]).forEach(widget_name => {
                        const widget_sample_arr = get_widget_sample_paths(widget_name);
                        if (widget_sample_arr.length > 0) {
                            ret.push({
                                "label": widget_name,
                                "children": [
                                    {
                                        "label": "Samples",
                                        "ignore-search": true,
                                        "children": widget_sample_arr.sort().map(path => {
                                            return {
                                                "label": path,
                                                "path": path,
                                            }
                                        })
                                    },
                                ]
                            });
                        }
                    });
                });
                return ret.sort((a, b) => a.label > b.label ? 1 : -1);
            },
            "label_onclick": function () {
                let bc_arr = [];
                $(this).parents(".list-item").each(function () {
                    let text = $(this).find("span").first().text();
                    bc_arr.push(text);
                })
                console.log('bc_arr === ', bc_arr);
                let meta = $(this).data("meta");
                $("#breadcrumbs-list").html(samples_breadcrumbs_html(meta));
                $("#content").html(gallery_iframe_html(
                    playground_url + "?" + meta
                ));
            }
        },
        {
            "label": "By Folder",
            "icon": "fa-folder",
            "data": function () {
                return config_to_tree(config.samples.children);
            },
            "label_onclick": function () {
                let meta = $(this).data("meta");
                $("#breadcrumbs-list").html(samples_breadcrumbs_html(meta));
                $("#content").html(gallery_iframe_html(
                    playground_url + "?" + meta
                ));
            }
        }
    ];

    tab_arr.forEach(function (tab_obj, i) {
        tab_arr[i].children = tab_arr[i].data(tab_arr[i]);
        tab_options[tab_obj.label] = tab_arr[i];
        tab_options[tab_obj.label]["html"] = function () {
            let $html = $("<div></div>");
            const output = tree_to_list(this.data(), $html);
            $html.append(output, $html);
            return $html.html();
        };
    })
}
function is_not_excluded(w) {
    return get_widget_sample_paths(w).length > 0 && RegExp(/[A-Z]/).test(w[0]);
}
function config_to_tree(node) {
    if (node.name) {
        node.label = node.name;
    }
    if (node.children) {
        node.children.sort(function (a, b) {
            return a.label > b.label ? 1 : -1;
        }).forEach(n => config_to_tree(n))
    }
    return node;
}