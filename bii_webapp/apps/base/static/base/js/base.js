/**
 * Sets the current main content in the middle
 */
$(document).ready(function () {
    var size = $('#main-content').width();
    var parentSize = $('#main-container').width();
    $('#main-content').css("margin-left", (parentSize - size) / 2 + 'px');

    (function ($) {
        $(document).ready(function () {
            $('div').each(function () {

                $(this).bind('contentChange', function (evt) {
                    if ($(this).css('max-height') != 'none')
                        if ($(this).actual('outerHeight') > $(this).css('max-height').replace(/[^-\d\.]/g, ''))
                            $(this).slimscroll({height: $(this).css('max-height'), alwaysVisible: true});
                    return false;
                });
                $(this).trigger('contentChange');
            });
            //Modify main scrollbar
            $('.container').slimscroll({height: 'auto', alwaysVisible: true});
        });
    })(jQuery);

    var rightWidth = $('#user_profile').width();
    if (!rightWidth)
        rightWidth = $('#login').width();
    //logo width plus profile width
    var widthLeft = 1144 - (rightWidth + 74) - 5;
    $('#searchbar').width(widthLeft);
});