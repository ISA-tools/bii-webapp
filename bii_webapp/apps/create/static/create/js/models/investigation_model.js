/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */

var InvestigationModel;
$(document).ready(function () {

    InvestigationModel = function (investigation) {
        if (investigation == undefined) {
            investigation =
            {
                i_id: "",
                i_title: "",
                i_description: "",
                i_submission_date: "",
                i_public_release_date: "",
                i_pubs_model: new StudyPublicationModel(),
                i_contacts_model: new StudyContactModel(),
                i_studies_model: new StudyModel()
            }
        }

        var self = this;
        self.investigation = ko.observable(investigation);

        self.save = function (form) {
            var investigation = self.toJSON();
            var formData = new FormData();
            formData.append('investigation', JSON.stringify(investigation));
            $.ajax({
                type: "POST",
                url: uploadURL,
                data: formData,
                success: function (data) {
                    var x = 1;
                },
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false
            });
        };

        self.toJSON = function () {
            var investigation = {
                i_id: self.investigation().i_id,
                i_title: self.investigation().i_title,
                i_description: self.investigation().i_description,
                i_submission_date: self.investigation().i_submission_date,
                i_public_release_date: self.investigation().i_public_release_date,
                i_pubs: self.investigation().i_pubs_model.toJSON().publications,
                i_contacts: self.investigation().i_contacts_model.toJSON().contacts,
                i_studies: self.investigation().i_studies_model.toJSON().studies
            };

            return {
                investigation: investigation
            }
        }
    };

});