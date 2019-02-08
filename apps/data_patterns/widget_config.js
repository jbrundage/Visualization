const dataTypes = {
    "real4": "numeric",
    "real8": "numeric",
    "real8": "numeric",
};

// NOTE: 
//     Nodes can optionally specify a "properties" (key value pair) to customize their widget
//         See available widgets (and their corresponding properties) here: https://github.com/hpcc-systems/Visualization
//     Nodes can optionally specify a "wrapper" to place their widget within a wrapper widget
//     Nodes with "wrapper" can optionally specify "wrapperProperties"
//         See available wrapper widgets (and their corresponding properties) here: https://github.com/hpcc-systems/Visualization
//     Nodes with "children" MUST also have a "child_map" callback that binds the widgets to their parent (see below)
// "insertMode" options = "split-top" | "split-left" | "split-right" | "split-bottom" | "tab-before" | "tab-after"
window.g_config = {
    "label": "DataPatterns",
    "widget": "phosphor_DockPanel",
    "children": [
        {
            "label": "Overall Analysis",
            "widget": "phosphor_DockPanel",
            "insertMode": "split-right",
            "child_map": function (widget, childWidgetArr, childConfigArr) {
                childWidgetArr.forEach((child, idx) => {
                    widget.addWidget(child, childConfigArr[idx].label, childConfigArr[idx].insertMode)
                })
            },
            "children": [
                {
                    "label": "Types",
                    "widget": "dgrid_Table",
                    "columns_map": function () {
                        return ["Attribute Name", "Given Type", "Best Type"];
                    },
                    "data_map": function (dataArr) {
                        const data = [];
                        dataArr.forEach(row => {
                            data.push([
                                row.attribute,
                                row.given_attribute_type,
                                row.best_attribute_type
                            ]);
                        });
                        return data.sort((a, b) => a[1] > b[1] ? -1 : 1);
                    }
                },
                {
                    "label": "All Cardinality",
                    "widget": "phosphor_DockPanel",
                    "insertMode": "split-right",
                    "child_map": function (widget, childWidgetArr, childConfigArr) {
                        childWidgetArr.forEach((child, idx) => {
                            widget.addWidget(child, childConfigArr[idx].label, childConfigArr[idx].insertMode)
                        })
                    },
                    "children": [
                        {
                            "label": "Unweighted",
                            "widget": "chart_Bar",
                            "insertMode": "split-top",
                            "columns_map": function () {
                                return ["Attribute Name", "Cardinality"];
                            },
                            "data_map": function (dataArr) {
                                const data = [];
                                dataArr.forEach(row => {
                                    data.push([
                                        row.attribute,
                                        row.cardinality
                                    ]);
                                });
                                return data.sort((a, b) => a[1] > b[1] ? -1 : 1);
                            }
                        },
                        {
                            "label": "Fill Ratio",
                            "widget": "chart_Bar",
                            "insertMode": "split-top",
                            "columns_map": function () {
                                return ["Attribute Name", "Cardinality Ratio"]
                            },
                            "data_map": function (dataArr) {
                                const data = [];
                                dataArr.forEach(row => {
                                    data.push([
                                        row.attribute,
                                        row.cardinality / row.fill_count
                                    ]);
                                });
                                return data.sort((a, b) => a[1] > b[1] ? -1 : 1);
                            }
                        }
                    ]
                },
                {
                    "label": "Low Cardinality",
                    "widget": "phosphor_DockPanel",
                    "insertMode": "split-right",
                    "child_map": function (widget, childWidgetArr, childConfigArr) {
                        childWidgetArr.forEach((child, idx) => {
                            if (idx > 0) {
                                const sqrIdx = Math.floor(Math.sqrt(idx)) - 1;
                                widget.addWidget(child, childConfigArr[idx].label, childConfigArr[idx].insertMode, childWidgetArr[sqrIdx]);
                            } else {
                                widget.addWidget(child, childConfigArr[idx].label, childConfigArr[idx].insertMode);
                            }
                        })
                    },
                    "children": function (dataArr) {
                        const configArr = [];
                        const rows = dataArr.filter(row => row.cardinality_breakdown.Row.length > 0);
                        rows.forEach(row => {
                            const _rowData = row["cardinality_breakdown"].Row.map(_row => {
                                return [_row.value.trim(), _row.rec_count];
                            });
                            const config = {
                                "label": row.attribute,
                                // TODO: ChartPanel removes widget.data()?
                                // "wrapper": "layout_ChartPanel",
                                // "wrapperProperties": {
                                //     "title": "Attribute: " + row.attribute,
                                // },
                                "widget": "chart_Bar",
                                "insertMode": "split-top",
                                "properties": {
                                    "yAxisDomainLow": 0
                                },
                                "columns_map": function () {
                                    return ["Value", "Count"];
                                },
                                "data_map": function () {
                                    return _rowData;
                                }
                            };
                            if (row["cardinality_breakdown"].Row.length < 10) {
                                config["widget"] = "chart_Pie";
                            }
                            else if (row["cardinality_breakdown"].Row.length < 20) {
                                config["widget"] = "chart_Column";
                            }
                            configArr.push(config);
                        });
                        return configArr;
                    }
                },
            ]
        },
        {
            "label": "Numeric Correlations",
            "widget": "layout_Grid",
            "insertMode": "tab-after",
            "child_map": function (widget, childWidgetArr, childConfigArr) {
                const sqrt = Math.sqrt(childWidgetArr.length);
                const rowCount = Math.ceil(sqrt);
                childWidgetArr.forEach((childWidget, idx, arr) => {
                    const row = Math.floor((idx / arr.length) * rowCount);
                    const col = idx % rowCount;
                    console.log('childConfigArr[idx].label === ', childConfigArr[idx].label);
                    console.log('row === ', row);
                    console.log('col === ', col);
                    widget.setContent(row, col, childWidget, childConfigArr[idx].label);
                })
            },
            "children": function (dataArr) {
                const configArr = [];
                const rows = dataArr.filter(row => row["numeric_correlations"].Row.length > 0);
                rows.forEach(row => {
                    const _rowData = row["numeric_correlations"].Row.map(_row => {
                        return [_row.attribute.trim(), _row.corr];
                    });
                    _rowData.sort((a, b) => a[0] > b[0] ? 1 : -1);
                    const config = {
                        "label": row.attribute,
                        // TODO: ChartPanel removes widget.data()?
                        // "wrapper": "layout_ChartPanel",
                        // "wrapperProperties": {
                        //     "title": "Attribute: " + row.attribute,
                        // },
                        "widget": "chart_Bar",
                        "insertMode": "tab-after",
                        "columns_map": function () {
                            return ["Value", "Count"];
                        },
                        "data_map": function () {
                            return _rowData;
                        }
                    };
                    if (row["numeric_correlations"].Row.length < 10) {
                        config["widget"] = "chart_Pie";
                    }
                    else if (row["numeric_correlations"].Row.length < 20) {
                        config["widget"] = "chart_Column";
                    }
                    configArr.push(config);
                });
                return configArr;
            }
        }
    ],
    "child_map": function (widget, childWidgetArr, childConfigArr) {
        childWidgetArr.forEach((child, idx) => {
            widget.addWidget(child, childConfigArr[idx].label, childConfigArr[idx].insertMode)
        })
    },
};