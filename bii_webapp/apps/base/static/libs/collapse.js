/**
 * Registers collapsible elements to flip the arrow image
 * when clicked
 */
$(document).ready(function () {
    var IE8orless = false;
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var ieversion = new Number(RegExp.$1);
        IE8orless = ieversion <= 8;
    }

    if (IE8orless) {
        var els = document.getElementsByTagName("a");
        for (var i = 0, l = els.length; i < l; i++) {
            var el = els[i];
            if (el.href.indexOf("collapse") != -1) {
                el.href = "javascript:void(0)";
            }
        }
        return;
    }

    $(".dropdown_button").each(function (index) {
        var dropdownParent = $(this).closest('.dropdown_parent');
        var dropdown_container = dropdownParent.children('.dropdown_container');
        dropdown_container.data('angle', 0);
        var image = $(this).children('img');
        $(this).click(function () {
            dropdown(dropdown_container, image);
        });
        $(this).attr('href', 'javascript:void(0)');
    });

});

//    var els = document.getElementsByClassName("dropdown_button");
//    for (var i = 0, l = els.length; i < l; i++) {
//        var el = els[i];
//        el.href = "javascript:void(0)";
//        el.onclick=function(){dropdown(dropdown_container, image)};
//    }
//    });
//
//$(".dropdown_button").each(function (index) {
//    var dropdownParent = $(this).closest('.dropdown_parent');
//    var dropdown_container = dropdownParent.children('.dropdown_container');
//    dropdown_container.data('angle', 0);
//    var image = $(this).children('img');
//    $(this).click(function () {
//        dropdown(dropdown_container, image);
//    });
//    $(this).attr('href', 'javascript:void(0)');
//});
//})

function dropdown(element, image) {
    var angle = image.data('angle');
    angle = angle > 0 ? 0 : 180;
    image.rotate(angle);
    image.data('angle', angle);
}
;

