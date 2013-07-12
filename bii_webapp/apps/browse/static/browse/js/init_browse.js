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

    $('[data-toggle="collapse"]').click(function () {
        $($($(this).closest('.rep_header')).siblings('.collapse')[0]).css('overflow', 'hidden');
    })
});