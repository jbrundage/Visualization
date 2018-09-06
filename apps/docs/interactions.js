const active_tab_idx = 0;

function clicked_list() {
    let element = arguments[1].target;
    if (!$(element).is(".list-item")) {
        element = $(element).closest('.list-item');
    }
    let active_tab = $("#left-tabs > div.selected > span").text();
    if ($(element).is(".list-endpoint")) {
        tab_options[active_tab].endpoint_onclick.call(element);
    } else {
        if ($(element).is(".selected")) {
            $(element).removeClass("selected");
            $(element).find(".selected").removeClass("selected");
        } else {
            $(element).addClass("selected");
        }
    }
}
function filter_list(elm) {
    const search_str = $(elm).val();
    const lowercase_search_str = search_str.toLowerCase();
    let text_map = [];
    let lowercase_text_map = [];
    $(`.list-item > span`).each(function () {
        $(this).text($(this).text());
        text_map.push($(this).text());
        lowercase_text_map.push($(this).text().toLowerCase());
    })
    if (lowercase_search_str === "") {
        $(`.list-item`).removeClass("search-hidden").removeClass("search-shown").addClass("empty-search");
    } else {
        $(`.list-item`).addClass("search-hidden").removeClass("search-shown").removeClass("empty-search");
        $(`.list-item > span`).each(function (i) {
            if ($(this).parent().is(".ignore-search")) return;
            if (text_map[i].indexOf(search_str) !== -1) {
                $(this).parent().removeClass("search-hidden").addClass("search-shown");
                $(this).parent().parents(".list-item").removeClass("search-hidden").addClass("search-shown");
                $(this).html($(this).text().split(search_str).join(`<b>${search_str}</b>`));
            } else if (lowercase_text_map[i].indexOf(lowercase_search_str) !== -1) {
                $(this).parent().removeClass("search-hidden").addClass("search-shown");
                $(this).parent().parents(".list-item").removeClass("search-hidden").addClass("search-shown");
                $(this).html(lowercase_text_map[i].split(lowercase_search_str).join(`<b>${lowercase_search_str}</b>`));
            }
        })
    }
}