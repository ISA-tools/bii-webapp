$(document).ready(function () {
    $('.collapse').each(function(){
        $(this).height($(this).height());
    });

    $('.editable_field').editable();

    $('.editable_field').click(function () {
        if ($(this).parents('.collapse').length > 0) {
            var el=$($(this).parents('.collapse')[0]);
            el.css('overflow', 'visible');
        }
    })
    $('[data-toggle="collapse"]').click(function () {
        $($($(this).closest('.rep_header')).siblings('.collapse')[0]).css('overflow', 'hidden');
    })
});