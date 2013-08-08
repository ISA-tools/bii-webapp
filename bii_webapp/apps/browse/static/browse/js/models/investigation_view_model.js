/**
 * Sets the size of the vertical investigation title
 * once it knows how many studies it contains.
 */
$(document).ready(function () {
    var investigation = vars.investigation;
    viewModel = new InvestigationModel(investigation);
    ko.applyBindings(viewModel);

    // Activate jQuery Validation
    $("#createISAForm").validate({ submitHandler: viewModel.save });

    $(".study").each(function (index) {
        var elheight = $(this).outerHeight();
        $(this).children('.study_id').height(elheight);
        $(this).children('.study_id').css('line-height', elheight + 'px');
    });


    $('.editable_field').editable({
        success: function (response, newValue) {
            if (response.field && response.field == 'i_id')viewModel.investigation().i_id(newValue);
            if (response.ERROR) return response.ERROR.messages; //msg will be shown in editable form
        },
        ajaxOptions: {
            type: 'post',
            dataType: 'json'
        },
        validate: function (value) {
            if ($.trim(value) == '') {
                return 'Title must not be empty';
            }
            if ((/<>]/.test(value))) {
                return 'Invalid Characters detected';
            }
        },

        url: vars.urls.updateInvestigation,
        pk: viewModel.investigation().i_id
    });
    $('.editable_field').click(function () {
        if ($(this).parents('.collapse').length > 0) {
            var el = $($(this).parents('.collapse')[0]);
            el.css('overflow', 'visible');
        }
    })

    $.modal.defaults = {
        overlay: "#000",        // Overlay color
        opacity: 0.75,          // Overlay opacity
        zIndex: 1,              // Overlay z-index.
        escapeClose: false,      // Allows the user to close the modal by pressing `ESC`
        clickClose: false,       // Allows the user to close the modal by clicking the overlay
        modalClass: "modal",    // CSS class added to the element being displayed in the modal.
        spinnerHtml: null,      // HTML appended to the default spinner during AJAX requests.
        showSpinner: true       // Enable/disable the default spinner during AJAX requests.
    };
});

var deleteInvestigation = function () {
    $.ajax({
            url: vars.urls.deleteInvestigation,  //server script to process data
            type: 'POST',
            //Ajax events
            success: completeHandler = function (data) {
                if (data.ERROR) {
                    $().toastmessage('showToast', {
                        text: data.ERROR.messages,
                        sticky: false,
                        type: 'error'
                    });
                    $('#confirmDelete .modal-footer > span a').show();
                    $('#confirmDelete .modal-footer > span > font').remove();
                    $.modal.close();
                }
                window.location = vars.urls.browse
            },
            error: errorHandler = function (xmlHttpRequest, ErrorText, thrownError) {
                if (xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0)
                    return;
            },
            data: JSON.stringify({pk: vars.investigation.i_id(), type: "investigation"}),
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false
        }
    );
    $('#confirmDelete .modal-footer > span a').hide();
    $('#confirmDelete .modal-footer > span').prepend('<font color="red">Deleting...</font>');
}
