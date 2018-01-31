function start_progress(elm) {
    var halflife = 5000;
    elm.progress_stopped = false;
    update_progress(elm, halflife, 0);
}
function exit_progress(elm) {
    elm.progress_stopped = true;
    delete document.getElementById('hpccjs-progress-style-for-' + elm.id);
}
function update_progress(elm, halflife, perc) {
    halflife *= 1.2;
    var bar_size = 5;
    var bar_color = '#FF00FF';
    perc = perc ? perc : 0;
    var _id = elm.id;
    var _style_id = 'hpccjs-progress-style-for-' + _id;
    if (!!elm.progress_stopped) {
        return;
    }
    var _style = document.getElementById(_style_id);
    if (_style) {
        _style.innerHTML = '#' + _id + '::before{' + _styles() + '}';
    } else {
        _style = document.createElement("style");
        _style.id = _style_id;
        _style.innerHTML = '#' + _id + '::before{' + _styles() + '}';
        elm.insertBefore(_style, elm.firstChild);
    }
    setTimeout(function () {
        var _remaining = 100 - perc;
        update_progress(elm, halflife, perc + (_remaining / 2));
    }, perc === 0 ? 100 : halflife);
    function _styles() {
        return [
            'content:" ";display:block;position:absolute',
            'height:' + bar_size + 'px;width:' + perc + '%',
            'left:0;top:0',
            'box-shadow: 0 0 10px #29d, 0 0 5px #29d',
            'opacity: 1.0',
            'transform: translate(0px, -4px)',
            'background-color: ' + bar_color,
            'transition: width ' + (halflife / 1000) + 's',
        ].join(';');
    }
}