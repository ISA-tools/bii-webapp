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
            if (response.ERROR) return response.ERROR.messages; //msg will be shown in editable form
            if(response.field && response.field=='i_id'){
                viewModel.investigation().i_id(newValue);
                var children=$('#breadcrumb-wrapper > ul').children('li');
                var invLI=$(children[children.length-1]);
                var aEl=$(invLI.find('a'));
                var href=aEl.attr('href');
                var index=href.substr(0,href.length-1).lastIndexOf('/')+1;
                aEl.attr('href',href.substr(0,index)+newValue+'/');
                aEl.text('Investigation '+newValue);
            }
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
