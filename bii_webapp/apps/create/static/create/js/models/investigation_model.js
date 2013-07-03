/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */

var InvestigationModel = function (investigation) {

    var self = this;

    self.subscription = function (inv) {
        inv.i_id(inv.i_id().replace(' ', '_'));
    }

    if (investigation == undefined) {
        investigation =
        {
            i_skip_investigation: ko.observable(false),
            i_id: ko.observable(""),
            i_title: "",
            i_description: "",
            i_submission_date: "",
            i_public_release_date: "",
            i_pubs_model: new StudyPublicationModel([]),
            i_contacts_model: new StudyContactModel([]),
            i_studies_model: new StudyModel()
        }
        investigation.i_id.subscribe(function (data) {
            self.subscription(investigation)
        });
    }

    self.investigation = ko.observable(investigation);

    self.activeState = function (element) {
        var existsActive = false;
        var currClass = element.attr('class') == undefined ? '' : element.attr('class');
        var siblings = element.siblings(element.prop("tagName"));

        if (siblings.length == 0)
            return currClass + ' active';

        siblings.each(function () {
            if ($(this).hasClass('active'))
                existsActive = true;
        })

        if (!existsActive) {
            return currClass + ' active';
        }
        return currClass;
    }

    self.save = function (form) {
        $('#save_button').attr('disabled', 'disabled');
        $('#save_button').text('Saving');
        var investigation = self.toJSON();
        var formData = new FormData();
        formData.append('investigation', JSON.stringify(investigation));
        formData.append('csrfmiddlewaretoken', document.getElementsByName('csrfmiddlewaretoken')[0].value);

        $.ajax({
            url: document.URL + 'save',  //server script to process data
            type: 'POST',
            //Ajax events
            success: successHandler = function (data) {
                $().toastmessage('showSuccessToast', data.INFO.messages);
                $('#save_button').removeAttr('disabled', 'disabled');
                $('#save_button').text('Save');
            },
            timeout: -1,
            error: errorHandler = function (xmlHttpRequest, ErrorText, thrownError) {
                $().toastmessage('showErrorToast',ErrorText);
                $('#save_button').removeAttr('disabled', 'disabled');
                $('#save_button').text('Save');
                if (xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0)
                    return;
            },
            // Form data
            data: formData,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false
        });

    };

    self.toJSON = function () {
        var investigation = {
            i_skip_investigation: self.investigation().i_skip_investigation(),
            i_id: self.investigation().i_id(),
            i_title: self.investigation().i_title,
            i_description: self.investigation().i_description,
            i_submission_date: self.investigation().i_submission_date,
            i_public_release_date: self.investigation().i_public_release_date,
            i_pubs: self.investigation().i_pubs_model.toJSON().publications,
            i_contacts: self.investigation().i_contacts_model.toJSON().contacts,
            i_studies: self.investigation().i_studies_model.toJSON().studies
        };

        return investigation
    }
};
