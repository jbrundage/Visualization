injestWidgetConfig(g_config, g_data);

function injestWidgetConfig(config, data) {

    console.group('config === ', config);

    const contentElement = document.getElementById("content");
    contentElement.innerHTML = "";

    const mainWidget = injestConfigNode(config);

    window.g_widget = mainWidget
        .target("content")
        .render()
        ;

    console.groupEnd();

    function injestConfigNode(configNode) {

        console.group('configNode.label === ', configNode.label);

        const widgetSplit = configNode.widget.split("_");
        const packageName = widgetSplit[0];
        const widgetName = widgetSplit[1];
        const widget = new window["@hpcc-js/" + packageName][widgetName]();
        if (configNode.properties) {
            Object.keys(configNode.properties).forEach(propertyName => {
                try {
                    widget[propertyName](configNode.properties[propertyName]);
                } catch (err) {
                    console.error(err);
                }
            })
        }
        if (configNode.children) {
            if (typeof configNode.children === "function") {
                const childWidgetArr = [];
                configNode.children(data).forEach(child => {
                    childWidgetArr.push(injestConfigNode(child));
                });
                configNode.child_map(widget, childWidgetArr, configNode.children(data));
            } else {

                const childWidgetArr = [];
                configNode.children.forEach(child => {
                    childWidgetArr.push(injestConfigNode(child));
                });
                configNode.child_map(widget, childWidgetArr, configNode.children);
            }
        }
        if (configNode.wrapper) {
            try {
                const wrapperSplit = configNode.wrapper.split("_");
                const wrapperPackageName = wrapperSplit[0];
                const wrapperWidgetName = wrapperSplit[1];
                const wrapper = new window["@hpcc-js/" + wrapperPackageName][wrapperWidgetName]();
                if (configNode.wrapperProperties) {
                    Object.keys(configNode.wrapperProperties).forEach(propertyName => {
                        try {
                            wrapper[propertyName](configNode.wrapperProperties[propertyName]);
                        } catch (err) {
                            console.error(err);
                        }
                    })
                }
                try {
                    wrapper.widget(widget);
                } catch (err) {
                    try {
                        wrapper.chart(widget);
                    } catch (err2) {
                        console.error(err);
                        console.error(err2);
                    }
                }
                return wrapper;
            } catch (err) {
                console.error(err);
            }
        }
        if (configNode.columns_map) {
            try {
                if (configNode.wrapper && configNode.wrapper === "layout_ChartPanel") {
                    wrapper.columns(configNode.columns_map(data));
                } else {
                    widget.columns(configNode.columns_map(data));
                }
            } catch (err) {
                console.error(err);
            }
        }
        if (configNode.data_map) {
            try {
                const _data = configNode.data_map(data);
                console.log('_data === ', _data);
                if (configNode.wrapper && configNode.wrapper === "layout_ChartPanel") {
                    wrapper.data(_data);
                } else {
                    widget.data(_data);
                }
            } catch (err) {
                console.error(err);
            }
        }

        console.groupEnd();
        return widget;
    }
}

function toggleMenu() {
    const menudiv = document.getElementById("menutoggle");
    const leftnav = document.getElementById("leftnav");
    const menudivClassArr = menudiv.className.split(" ").filter(name => name);
    const leftnavClassArr = leftnav.className.split(" ").filter(name => name);
    if (menudivClassArr.indexOf("menu-collapsed") !== -1) {
        // Menu is collapsed... time to expand it
        menudiv.className = menudivClassArr
            .filter(name => name !== "menu-collapsed")
            .join(" ")
            ;
        leftnav.className = leftnavClassArr
            .filter(name => name !== "menu-collapsed")
            .join(" ")
            ;
    } else {
        // Menu is expanded... time to collapse it
        menudivClassArr.push("menu-collapsed");
        menudiv.className = menudivClassArr.join(" ");
        leftnavClassArr.push("menu-collapsed");
        leftnav.className = leftnavClassArr.join(" ");
    }
}
