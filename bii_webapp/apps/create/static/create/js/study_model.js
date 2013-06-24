/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */

var StudyModel;
$(document).ready(function () {

    StudyModel = function (studies) {
        if (studies == undefined) {
            studies = [
                {
                    s_id: "",
                    s_title: "",
                    s_description: "",
                    s_grand_number: "",
                    s_funding_agency: "",
                    s_submission_date: "",
                    s_public_release_date: "",
                    s_assays_model: new StudyAssayModel(),
                    s_pubs_model: new StudyPublicationModel(),
                    s_contacts_model: new StudyContactModel(),
                    s_factors_model: new StudyFactorModel(),
                    s_protocols_model: new StudyProtocolModel()
                }
            ]
        }

        var self = this;
        self.studies = ko.observableArray(studies);

        self.addStudy = function () {
            self.studies.push({
                s_id: "",
                s_title: "",
                s_description: "",
                s_grand_number: "",
                s_funding_agency: "",
                s_submission_date: "",
                s_public_release_date: "",
                s_assays_model: new StudyAssayModel(),
                s_pubs_model: new StudyPublicationModel(),
                s_contacts_model: new StudyContactModel(),
                s_factors_model: new StudyFactorModel(),
                s_protocols_model: new StudyProtocolModel()
            });
        };

        self.removeStudy = function (study) {
            self.studies.remove(study);
        };

        self.save = function (form) {
            var studies = self.toJSON();
            var formData = new FormData();
            formData.append('studies', JSON.stringify(studies));
            $.ajax({
                type: "POST",
                url: uploadURL,
                data: formData,
                success: function(data){
                     var x=1;
                },
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false
            });
        };

        self.toJSON = function () {
            var jsonStudies=[];
            for (var i = 0; i < self.studies().length; i++) {
                var currStudy = self.studies()[i];
                var study = {
                    s_id:currStudy.s_id,
                    s_title: currStudy.s_title,
                    s_description: currStudy.s_description,
                    s_grand_number: currStudy.s_grand_number,
                    s_funding_agency: currStudy.s_funding_agency,
                    s_submission_date: currStudy.s_submission_date,
                    s_public_release_date: currStudy.s_public_release_date,
                    s_assays: currStudy.s_assays_model.toJSON().assays,
                    s_pubs: currStudy.s_pubs_model.toJSON().publications,
                    s_contacts: currStudy.s_contacts_model.toJSON().contacts,
                    s_factors: currStudy.s_factors_model.toJSON().factors,
                    s_protocols: currStudy.s_protocols_model.toJSON().protocols
                };
                jsonStudies.push(study);
            }
            return {
                studies:jsonStudies
            }
        }
    };

});