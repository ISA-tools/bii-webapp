/**
 * Sets the size of the vertical investigation title
 * once it knows how many studies it contains.
 */
$(document).ready(function () {
    var investigation=vars.investigation;
    viewModel = new InvestigationModel(investigation);
    ko.applyBindings(viewModel);

    // Activate jQuery Validation
    $("#createISAForm").validate({ submitHandler: viewModel.save });

    $(".study").each(function (index) {
        var elheight=$(this).outerHeight();
        $(this).children('.study_id').height(elheight);
        $(this).children('.study_id').css('line-height',elheight+'px');
    });


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
