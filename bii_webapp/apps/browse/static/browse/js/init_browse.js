$(document).ready(function () {

    $('.inv_id').click(function () {
        var ref = $($(this).find('div > a')).attr('href');
        window.location = ref;
    })

    $('.study_id').click(function () {
        var ref = $($(this).find('a')).attr('href');
        window.location = ref;
    })

    $('.collapse').filter('.in').each(function () {
        if ($(this).find('.collapse').not('in').length > 0)
            return;
        $(this).css('height', ($(this).height()));
    });

//    $('.editable_field').each(function () {
//        if ($(this).parents('.collapse').length > 0) {
//            var parent=$($(this).parents('.collapse')[0]);
//            parent.css('height',parent.height());
//        }
//    });

    $('[data-toggle="collapse"]').click(function () {
        $($($(this).closest('.rep_header')).siblings('.collapse')[0]).css('overflow', 'hidden');
    })
    dropdown($('.group_columns .collapse'), $('.collapsibleImage'));

    $('.editable-empty').text('Add value');

    $('.showtooltip').tooltip({
        animation: true,
        placement: 'left'
    })

});
