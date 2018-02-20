function random_graph_data(r) {
    var ret = {"nodes": [], "links": []};
    ret.nodes = d3.range(r).map(function(i) {
        return random_node();
    });
    ret.links = d3.range(ret.nodes.length - 1).map(function(i) {
        return {
            source: Math.floor(Math.sqrt(i)),
            target: i + 1
        };
    });
    return ret;
}
function rand_arr(arr){
    return arr[Math.floor(Math.random()*(arr.length-1))];
}
function random_node(i){
    var _type=random_node_type();
    var _annotations=get_random_node_annotations(_type);
    var _label=get_random_node_label(_annotations);
    var _icon=get_node_icon_by_type(_type);
    return {
        "id":i,
        "index":i,
        "label":_label,
        "type":_type,
        "icon":_icon,
        "annotations":_annotations,
    }
}
function get_node_icon_by_type(type){
    switch(type){
        case 'Associate':return '';
        case 'Relative':return '';
        case 'Property':return '';
        case 'Business':return '';
        case 'Incident':return '';
    }
}
function random_node_type(){
    return rand_arr(['Associate','Relative','Property','Business','Incident']);
}
function get_random_node_label(){
    return get_random_name();
}
function get_random_name(){
    var last_names = ['Smith','Anderson','Johnson','Rogers','Doe'];
    var male_first_names = ['James','Robert','John','David','William','Mark'];
    var female_first_names = ['Mary','Linda','Debra','Nancy','Sharon','Karen','Susan'];
    if(Math.random() > 0.5){
        return rand_arr(male_first_names)+' '+rand_arr(last_names);
    }else{
        return rand_arr(female_first_names)+' '+rand_arr(last_names);
    }
}
function get_random_business_name(){
    var last_names = ['Smith','Anderson','Johnson','Rogers','Doe'];
    var ret = '';
    if(Math.random() > 0.5){
        ret += rand_arr(last_names)+' & '+rand_arr(last_names);
    }
    else {
        ret += rand_arr(last_names)+' & Co.';
    }
    return ret;
}
function get_random_address(){
    var street_names = ['5th','Maplewood','Main','Broadway','Las Olas','Powerline'];
    var suffix = ['Dr','St','Blvd'];
    var num = Math.floor(Math.random()*1000);
    return num + ' ' + rand_arr(street_names) + ' ' + rand_arr(suffix);
}
function node_annotation_obj(str){
    if(['A','B'].indexOf(str) !== -1){
        return {"color": "#2ecc71", "icon": str};
    }
    if(['C','D'].indexOf(str) !== -1){
        return {"color": "#1abc9c", "icon": str};
    }
    if(['E','F'].indexOf(str) !== -1){
        return {"color": "#9b59b6", "icon": str};
    }
    if(['G'].indexOf(str) !== -1){
        return {"color": "#95a5a6", "icon": str};
    }
}
function get_random_node_annotations(type){
    var ret = [];
    var _anno_text_array = _random_node_annotations(type);
    _anno_text_array.forEach(function(anno_text){
        ret.push(node_annotation_obj(anno_text));
    });
    return ret.filter(function(_){return typeof(_) !== "undefined"});
    
    function _random_node_annotations(type){
        var rand_num = Math.floor(4*Math.random());
        var ret = [];
        for(var i = 0 ;i<rand_num;i++){
            ret.push(rand_1());
        }
        return ret;

        function rand_1(){
            var ret = ['A','B','C','D','E','F','G'];
            return ret[Math.floor(Math.random()*ret.length)];
        }
    }
}