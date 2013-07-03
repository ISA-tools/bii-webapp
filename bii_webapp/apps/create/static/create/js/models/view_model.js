/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */
var viewModel;

$.validator.setDefaults({ ignore: '' });

$(document).ready(function () {
    viewModel = new InvestigationModel();
    ko.applyBindings(viewModel);

    // Activate jQuery Validation
    var errorEls = [];

    $("#createISAForm").validate({
        submitHandler: function () {
            //clear errors
            for (var i = 0; i < errorEls.length; i++) {
                var el = errorEls[i];
                el.find('span').remove();
            }
            viewModel.save();
        },
        invalidHandler: function (event, validator) {
            $().toastmessage('showErrorToast', 'Please complete missing fields');
            //clear errors
            for (var i = 0; i < errorEls.length; i++) {
                var el = errorEls[i];
                el.find('span').remove();
            }

            errorEls = [];
            for (var i = 0; i < validator.errorList.length; i++) {
                var el = $(validator.errorList[i].element);
                var parent = $(el.parents('.tab-pane')[0]);
                var parID = parent.attr('id');
                var aEl = $("a[href=#" + parID + "]");
                if (aEl.has('.errorFlag').length == 0) {
                    aEl.prepend('<span class="errorFlag" style="color: red;font-weight: bold;font-size: 16px;">* </span>');
                    if ($.inArray(aEl, errorEls) == -1)
                        errorEls.push(aEl);
                }
            }
        }
    });

    $("#investigation_tab1 .required").each(function () {
        $(this).rules('add', {
            required: function () {
                if ($("#i_skip_investigation").is(':checked'))
                    return false;
                else {
                    return true;
                }
            }
        })
    })
});