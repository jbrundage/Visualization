import { HTMLWidget } from "@hpcc-js/common";
import { SVGWidget } from "@hpcc-js/common";
import { WidgetArray } from "@hpcc-js/common";
import { event as d3Event, select as d3Select } from "d3-selection";
import { Button } from "./Button";

import "../src/Form.css";

export class Form extends HTMLWidget {
    tbody;
    tfoot;
    btntd;
    _controls;
    _maxCols;

    constructor() {
        super();

        this._tag = "form";
    }

    data(): any;
    data(_: any): this;
    data(_?: any): any | this {
        if (!arguments.length) {
            const retVal = [];
            this.inputsForEach(function (input) {
                retVal.push(input.value());
            });
            return retVal;
        } else {
            this.inputsForEach(function (input, idx) {
                if (_.length > idx) {
                    input.value(_[idx]).render();
                }
            });
        }
        return this;
    }

    inputsForEach(callback, scope?) {
        let idx = 0;
        this.inputs().forEach(function (inp) {
            const inpArray = inp instanceof WidgetArray ? inp.content() : [inp];
            inpArray.forEach(function (inp2) {
                if (scope) {
                    callback.call(scope, inp2, idx++);
                } else {
                    callback(inp2, idx++);
                }
            });
        });
    }

    calcMaxColumns() {
        let retVal = 0;
        this.inputs().forEach(function (inputWidget) {
            const inputWidgetArray = inputWidget instanceof WidgetArray ? inputWidget.content() : [inputWidget];
            if (inputWidgetArray.length > retVal) {
                retVal = inputWidgetArray.length;
            }
        });
        return retVal;
    }

    values(): any;
    values(_: any): this;
    values(_?: any): any | this {
        if (!arguments.length) {
            const dataArr = {};
            this.inputsForEach(function (inp) {
                const value = inp.value();
                if (value || !this.omitBlank()) {
                    dataArr[inp.name()] = inp.value();
                }
            }, this);
            return dataArr;
        } else {
            this.inputsForEach(function (inp) {
                if (_[inp.name()]) {
                    inp.value(_[inp.name()]);
                } else if (this.omitBlank()) {
                    inp.value("");
                }
            }, this);
        }
        return this;
    }

    submit() {
        let isValid = true;
        if (this.validate()) {
            isValid = this.checkValidation();
        }
        if (!this.allowEmptyRequest() && !this.inputs().some(function (w) {
            if (w._class.indexOf("WidgetArray") !== -1) {
                return w.content().some(function (wa) {
                    return wa.hasValue();
                });
            }
            return w.hasValue();
        })) {
            return;
        }
        this.click(isValid ? this.values() : null, null, isValid);
    }

    clear() {
        this.inputsForEach(function (inp) {
            switch (inp.classID()) {
                case "form_Slider":
                    if (inp.allowRange()) {
                        inp.value([inp.low(), inp.low()]).render();
                    } else {
                        inp.value(inp.low()).render();
                    }
                    break;
                case "form_CheckBox":
                    inp.value(false).render();
                    break;
                case "form_Button":
                    /* skip */
                    break;
                default:
                    inp.value("").render();
                    break;
            }
        });
    }

    checkValidation() {
        let ret = true;
        const msgArr = [];
        this.inputsForEach(function (inp) {
            if (!inp.isValid()) {
                msgArr.push("'" + inp.label() + "'" + " value is invalid.");
            }
        });
        if (msgArr.length > 0) {
            alert(msgArr.join("\n"));
            ret = false;
        }
        return ret;
    }

    enter(domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        element.on("submit", function () {
            d3Event.preventDefault();
        });

        this._placeholderElement.style("overflow", "auto");
        const table = element
            .append("table")
            ;
        this.tbody = table.append("tbody");
        this.tfoot = table.append("tfoot");
        this.btntd = this.tfoot.append("tr").append("td")
            .attr("colspan", 2)
            ;

        const context = this;
        this._controls = [
            new Button()
                .classed({ default: true })
                .value("Submit")
                .on("click", function () {
                    context.submit();
                }, true),
            new Button()
                .value("Clear")
                .on("click", function () {
                    context.clear();
                }, true)
        ];
        const rightJust = context.btntd
            .append("div")
            .style("float", "right")
            ;
        this._controls.forEach(function (w) {
            const leftJust = rightJust
                .append("span")
                .style("float", "left")
                ;
            w.target(leftJust.node()).render();
        });
    }

    update(domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);

        this._maxCols = this.calcMaxColumns();

        const context = this;
        const rows = this.tbody.selectAll("tr").data(this.inputs());
        rows.enter().append("tr")
            .each(function (inputWidget, i) {
                const element2 = d3Select(this);

                const inputWidgetArray = inputWidget instanceof WidgetArray ? inputWidget.content() : [inputWidget];
                inputWidgetArray.forEach(function (inputWidget2, idx) {
                    element2.append("td")
                        .attr("class", "prompt")
                        .text(inputWidget2.label() + ":")
                        ;
                    const input = element2.append("td")
                        .attr("class", "input")
                        ;
                    if (idx === inputWidgetArray.length - 1 && inputWidgetArray.length < context._maxCols) {
                        input.attr("colspan", (context._maxCols - inputWidgetArray.length + 1) * 2);
                    }
                    inputWidget2.target(input.node()).render();
                    if (inputWidget2 instanceof SVGWidget) {
                        const bbox = inputWidget2.element().node().getBBox();
                        input.style("height", bbox.height + "px");
                        inputWidget2.resize().render();
                    }

                    if (inputWidget2._inputElement instanceof Array) {
                        inputWidget2._inputElement.forEach(function (e) {
                            e.on("keyup.form", function (w) {
                                setTimeout(function () {

                                    context._controls[0].disable(!context.allowEmptyRequest() && !context.inputs().some(function (w2) {
                                        if (w2._class.indexOf("WidgetArray") !== -1) {
                                            return w2.content().some(function (wa) {
                                                return wa.hasValue();
                                            });
                                        }
                                        return w2.hasValue();
                                    }));
                                }, 100);
                            });
                        });
                    }
                });
            })
            ;
        rows.each(function (inputWidget, i) {
            if (i === 0 && inputWidget.setFocus) {
                inputWidget.setFocus();
            }
        });
        rows.exit().remove();

        this.tfoot
            .style("display", this.showSubmit() ? "table-footer-group" : "none")
            ;
        this.btntd
            .attr("colspan", this._maxCols * 2)
            ;

        // Disable Submit unless there is data
        if (!this.allowEmptyRequest()) {
            setTimeout(function () {
                context._controls[0].disable(!context.allowEmptyRequest() && !context.inputs().some(function (w) {
                    if (w._class.indexOf("WidgetArray") !== -1) {
                        return w.content().some(function (wa) {
                            return wa.hasValue();
                        });
                    }
                    return w.hasValue();
                }));
            }, 100);
        }

    }

    exit(domNode, element) {
        this.inputs_reset();
        this._controls.forEach(function (w) {
            w.target(null);
        });
        HTMLWidget.prototype.exit.apply(this, arguments);
    }

    click(row, col, sel) {
        console.log("Clicked Submit: " + JSON.stringify(row));
    }

    validate_exists: () => boolean;
    inputs_exists: () => boolean;
    inputs_reset: () => void;
    showSubmit_exists: () => boolean;
    omitBlank_exists: () => boolean;
    allowEmptyRequest_exists: () => boolean;
}
Form.prototype._class += " form_Form";

export interface Form {
    validate(): boolean;
    validate(_: boolean): this;
    inputs(): any[];
    inputs(_: any[]): this;
    showSubmit(): boolean;
    showSubmit(_: boolean): this;
    omitBlank(): boolean;
    omitBlank(_: boolean): this;
    allowEmptyRequest(): boolean;
    allowEmptyRequest(_: boolean): this;
}
Form.prototype.publish("validate", true, "boolean", "Enable/Disable input validation");
Form.prototype.publish("inputs", [], "widgetArray", "Array of input widgets");
Form.prototype.publish("showSubmit", true, "boolean", "Show Submit/Cancel Controls");
Form.prototype.publish("omitBlank", false, "boolean", "Drop Blank Fields From Submit");
Form.prototype.publish("allowEmptyRequest", false, "boolean", "Allow Blank Form to be Submitted");
