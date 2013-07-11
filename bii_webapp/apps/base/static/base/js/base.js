String.prototype.escapeSpecialChars = function () {
    return this.replace(/[\\]/g, '\\\\')
        .replace(/[\"]/g, '\\"')
        .replace(/[\\]/g, '\\\\')
        .replace(/[\/]/g, '\\/')
        .replace(/[\b]/g, '\\b')
        .replace(/[\f]/g, '\\f')
        .replace(/[\n]/g, '\\n')
        .replace(/[\r]/g, '\\r')
        .replace(/[\t]/g, '\\t')

    replace('\\n', '\\n').replace('\\t', '\\t').replace('\\"', '\\"')
};
/**
 * Sets the current main content in the middle
 */
$(document).ready(function () {
    var size = $('#main-content').width();
    var parentSize = $('#main-container').width();
    $('#main-content').css("margin-left", (parentSize - size) / 2 + 'px');

//    (function ($) {
//        $('div').each(function () {
//
//            $(this).bind('contentChange', function (evt) {
//                if ($(this).css('max-height') != 'none')
//                    if ($(this).actual('outerHeight') > $(this).css('max-height').replace(/[^-\d\.]/g, ''))
//                        $(this).slimscroll({height: $(this).css('max-height'), alwaysVisible: true});
//                return false;
//            });
//            $(this).trigger('contentChange');
//        });
//    })(jQuery);

    var rightWidth = $('#user_profile').width();
    if (!rightWidth)
        rightWidth = $('#login').width();
    //logo width plus profile width
    var widthLeft = 1144 - (rightWidth + 74) - 5;
    $('#searchbar').width(widthLeft);

    $('#main-menu').css('width',$('#main-menu > ul').children('li').length*100);
});

var showToast = function (msg, duration) {
    if (duration == undefined)
        duration = 2000
    var el = $('body');
    el.append('<div class="toast"></div>');
    $('.toast').text(msg);
    $('.toast').css('margin-left', -$('.toast').outerWidth() / 2 + 'px');
    $('.toast').show();
    if (duration != -1)
        setTimeout(function () {
            $('.toast').hide();
            el.remove('.toast')
        }, duration);
}

var hideToast = function () {
    $('.toast').hide();
}

$().toastmessage({
    position : 'middle-center'
});