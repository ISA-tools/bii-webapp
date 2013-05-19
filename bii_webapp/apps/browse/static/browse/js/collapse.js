/**
 * Registers collapsible elements to flip the arrow image
 * when clicked
 */
$(document).ready(function () {
    $(".dropdown_button").each(function (index) {
        var dropdownParent = $(this).closest('.dropdown_parent');
        var dropdown_container = dropdownParent.children('.dropdown_container');
        dropdown_container.data('angle', 0);
        var image = $(this).children('img');
        $(this).click(function () {
            dropdown(dropdown_container, image);
        });
    });
});

function dropdown(element, image) {
    var rotate = true;
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var ieversion = new Number(RegExp.$1);
        rotate = !(ieversion <= 8);
    }

    if (rotate) {
        var angle = image.data('angle');
        angle=angle > 0 ? 0 :180;
        image.rotate(angle);
        image.data('angle',angle);
    }
}
;

