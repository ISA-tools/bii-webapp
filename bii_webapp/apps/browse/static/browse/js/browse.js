/**
 * Sets the size of the vertical investigation title
 * once it knows how many studies it contains.
 */
$(document).ready(function () {
    var options = {
        currentPage: 1,
        totalPages: 5,
        alignment:"center",
        useBootstrapTooltip:true,
        pageUrl: function(type, page, current){
            return vars.url.getPage+page;
        }
    }

    $('#pagination').bootstrapPaginator(options);

    $(".investigation").each(function (index) {
        var size = $(this).find('.study').length;
        var el = $(this).find('.inv_id');
        var elheight=size * 120 + (size - 1) * 10;
        el.height(elheight);
        el.css("line-height", (elheight + 'px'));
    });

    $(".study").each(function (index) {
        var x = $(this).parents('.investigation');
        if ($(this).parents('.investigation').length == 0) {
            $(this).css("margin-left", 34 + 'px');
        }
    });
});
