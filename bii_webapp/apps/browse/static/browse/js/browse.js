/**
 * Sets the size of the vertical investigation title
 * once it knows how many studies it contains.
 */
$(document).ready(function () {
    var options = {
        currentPage: vars.current_page,
        totalPages: vars.number_of_pages,
        alignment: "center",
        useBootstrapTooltip: true,
        pageUrl: function (type, page, current) {
            return vars.urls.browse + page;
        }
    }

    $('#pagination').bootstrapPaginator(options);

    $(".study").each(function (index) {
        var elheight = $(this).outerHeight();
        $(this).children('.study_id').height(elheight);
        $(this).children('.study_id').css('line-height', elheight + 'px');
    });

    $(".investigation").each(function (index) {
        var totalHeight = 0;
        var studies=$(this).find('.study');
        studies.each(function () {
            totalHeight += $(this).outerHeight();
        })
        totalHeight+= (studies.length - 1) * 10;
        var inv_id = $($(this).children('.inv_id')[0]);
        inv_id.height(totalHeight);
        inv_id.css("line-height", (totalHeight + 'px'));
    });

    $(".study").each(function (index) {
        var x = $(this).parents('.investigation');
        if ($(this).parents('.investigation').length == 0) {
            $(this).css("margin-left", 34 + 'px');
            $(this).css("margin-left", 34 + 'px');
        }
    });
});
