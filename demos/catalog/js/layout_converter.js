function v1_to_v2_layout(json_str){
    let _rects = parse_rects(json_str,",");
    console.info(`_rects`,_rects);
    let score_arr = [];
    _rects.forEach(rect=>{
        score_arr.push(get_score_arr(rect,_rects));
    });
    let pair_arr = [];
    let rect_copy = JSON.parse(JSON.stringify(_rects));
    
    return pair_arr;
}
function get_score_arr(rect,_rects){
    let arr = [];
    _rects.forEach(r=>{
        if(r === rect){
            arr.push(0);
        } else {
            arr.push(compat_score(rect,r));
        }
    });
    return arr;
}
function parse_rects(str,splitter2){
    let parse1 = [
        `"gridRow":`,
        `"gridCol":`,
        `"gridRowSpan":`,
        `"gridColSpan":`
    ].map((pat,i)=>{
        let _pat_split = str.split(pat);
        return _pat_split.slice(1).map(n=>{
            return $.trim(n.split(splitter2)[0])
        });
    });
    return parse1[0].map((n,i)=>{
        return parse1.map(n2=>parseInt(n2[i]));
    });
}
function compat_score(_a,_b){
    let patterns = {
        "L_W":{points: 2, callback: function(a,b){return a[0] === b[0] && a[2] === b[2]}},
        "T_H":{points: 1, callback: function(a,b){return a[1] === b[1] && a[3] === b[3]}},
        "L_R":{points: 100, callback: function(a,b){
            return (a[0] === b[0] + b[2]) || (b[0] === a[0] + a[2])
        }},
        "T_B":{points: 100, callback: function(a,b){
            return (a[1] === b[1] + b[3]) || (b[1] === a[1] + a[3])
        }},
    };
    let score_arr = Object.keys(patterns)
        .filter(pattern=>{
            return patterns[pattern].callback(_a,_b);
        })
        .map(n=>patterns[n].points);
    if(score_arr.length === 0){
        return 0;
    } else {
        return score_arr.reduce((sum,n)=>sum + n);
    }
}