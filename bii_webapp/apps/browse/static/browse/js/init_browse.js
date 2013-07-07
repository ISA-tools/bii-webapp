$(document).ready(function () {

    $('.inv_id').click(function () {
        var ref = $($(this).find('div > a')).attr('href');
        window.location = ref;
    })

    $('.study_id').click(function () {
        var ref = $($(this).find('a')).attr('href');
        window.location = ref;
    })

    $('.collapse').each(function () {
        $(this).height($(this).height());
    });

    $('.editable_field').editable();

    $('.editable_field').click(function () {
        if ($(this).parents('.collapse').length > 0) {
            var el = $($(this).parents('.collapse')[0]);
            el.css('overflow', 'visible');
        }
    })

//    $('.editable_field').hover(function () {
//        if ($(this).parents('.collapse').length > 0) {
//            var el = $($(this).parents('.collapse')[0]);
//            el.css('overflow', 'visible');
//        }
//    })

    $('[data-toggle="collapse"]').click(function () {
        $($($(this).closest('.rep_header')).siblings('.collapse')[0]).css('overflow', 'hidden');
    })

//    $(".editable_field").each(function(){
//        $(this).attr('title','Click to edit');
//    })
//
//    $(".editable_field").tooltip({
//        'placement': 'left'
//    });
});