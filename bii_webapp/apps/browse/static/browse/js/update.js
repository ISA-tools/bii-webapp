$(document).ready(function () {

    $('.editable_field').editable({
        success: function (response, newValue) {
            if(response.field && response.field=='i_id')viewModel.investigation().i_id(newValue);
            if (response.ERROR) return response.ERROR.messages; //msg will be shown in editable form
        },
        ajaxOptions: {
            type: 'post',
            dataType: 'json'
        },

        url:vars.urls.updateInvestigation,
        pk:viewModel.investigation().i_id
    });
    $('.editable_field').click(function () {
        if ($(this).parents('.collapse').length > 0) {
            var el = $($(this).parents('.collapse')[0]);
            el.css('overflow', 'visible');
        }
    })

});