/**
 * Sets the size of the vertical investigation title
 * once it knows how many studies it contains.
 */
$(document).ready(function () {

    $(".study").each(function (index) {
        var elheight=$(this).outerHeight();
        $(this).children('.study_id').height(elheight);
        $(this).children('.study_id').css('line-height',elheight+'px');
    });
});
