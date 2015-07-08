"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/HTMLWidget", "./Input", "./Slider", "../common/Text", "../layout/Border", "../layout/Grid", "css!./Form"], factory);
    } else {
        root.form_Form = factory(root.d3, root.common_HTMLWidget, root.form_Input, root.form_Slider, root.common_Text, root.layout_Border, root.layout_Grid);
    }
}(this, function (d3,HTMLWidget,Input,Slider,Text,Border,Grid) {
    function Form() {
        HTMLWidget.call(this);

        this._tag = "form";
    }
    Form.prototype = Object.create(HTMLWidget.prototype);
    Form.prototype._class += " form_Form";

    Form.prototype.publish("gridColumnCount", 4, "number", "Column count per row of inputs");
    
    Form.prototype.publish("minRowCount", 6, "number", "Minimum number of grid rows",null,{tags:['Private']});
    Form.prototype.publish("minColCount", 4, "number", "Minimum number of grid columns",null,{tags:['Private']});
    
    Form.prototype.publish("grid", null, "widget", "Grid which holds all form inputs");
    Form.prototype.publish("validate", true, "boolean", "Enable/Disable input validation");
    Form.prototype.publish("inputs", [], "widgetArray", "Array of input widgets");
    Form.prototype.publish("showSubmit", true, "boolean", "Show Submit/Cancel Controls");

    Form.prototype.testData = function () {
        this
            .inputs([
                new Input()
                    .name("textbox-test")
                    .label("Alphanumeric")
                    .type("textbox")
                    .validate("^[A-Za-z0-9]+$")
                    .value("SomeString123"),
                new Input()
                    .name("textbox-test")
                    .label("Only Alpha")
                    .type("textbox")
                    .validate("^[A-Za-z]+$")
                    .value("SomeString"),
                new Input()
                    .name("number-test")
                    .label("Number Test")
                    .type("number")
                    .validate("\\d+")
                    .value(123),
                new Input()
                    .name("checkbox-test")
                    .label("Checkbox Test")
                    .type("checkbox")
                    .value(true),
                new Input()
                    .name("select-test")
                    .label("Select Test")
                    .type("select")
                    .selectOptions(["A","B","C"])
                    .value("B"),
                new Input()
                    .name("button-test")
                    .label("Button Test")
                    .type("button")
                    .value("Button Text"),
                new Input()
                    .name("textarea-test")
                    .label("Textarea Test")
                    .type("textarea")
                    .value("Textarea Text"),
                new Slider()
                    .name("slider-test")
                    .label("Slider Test")
                    .value(66)
            ])
        ;
        return this;
    };

    Form.prototype.submit = function(){
        var isValid = true;
        if(this.validate()){
            isValid = this.checkValidation();
        }
        if(isValid){
            var inpArr = this.inputs();
            var dataArr = {};
            inpArr.forEach(function(inp){
                dataArr[inp.name()] = inp.value();
            });
            this.click(dataArr);
        }
    };
    Form.prototype.clear = function(){
        var inpArr = this.inputs();
        inpArr.forEach(function(inp){
            if (inp instanceof Slider) {
                inp.value(inp.low());
            } else if(inp.type() === "checkbox"){
                inp.value(false);
                inp._inputElement.node().checked = false;
            } else {
                inp.value(" ");
                inp._inputElement.node().value = " ";
            }
        });
    };

    Form.prototype.checkValidation = function(){
        var ret = true;
        var msgArr = [];
        this.inputs().forEach(function(inp){
            if(!inp.isValid()){
                msgArr.push("'"+inp.label()+"'"+" value is invalid.");
            }
        });
        if(msgArr.length > 0){
            alert(msgArr.join("\n"));
            ret = false;
        }
        return ret;
    };

    Form.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        element.on("submit", function () {
            d3.event.preventDefault();
        });

        this._parentElement.style("overflow", "auto");
        this.grid(new Grid().gutter(0)
                .minRowCount(this.minRowCount())
                .minColCount(this.minColCount())
                .target(this._parentElement.node())
            )
        ;
    };

    Form.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        var context = this;
        
        this.inputs().forEach(function(inp,idx){
            var row = Math.floor(idx / context.gridColumnCount());
            var col = idx % context.gridColumnCount();
            context.grid().setContent(row,col,
                    new Grid().gutter(0)
                        .setContent(0,0,new Text().text(inp.label()))
                        .setContent(1,0,inp)
                )
            ;
//            for(var cellIdx in context.grid().content()[idx].widget().content()){
//                context.grid().content()[idx].widget().content()[cellIdx].surfaceBorderWidth(0);
//            }
        });
        for(var cellIdx in this.grid().content()){
            this.grid().content()[cellIdx].surfaceBorderWidth(0);
        }
        context.grid().render();
    };

    Form.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    Form.prototype.click = function (row) {
        console.log("Clicked Submit: "+JSON.stringify(row));
    };

    return Form;
}));