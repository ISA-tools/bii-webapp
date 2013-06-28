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
            studiesData = [
                {
                    s_id: "",
                    s_title: "",
                    s_description: "",
                    s_grand_number: "",
                    s_funding_agency: "",
                    s_submission_date: "",
                    s_public_release_date: "",
                    s_organisms: [],
                    s_assays_model: new AssayModel(),
                    s_pubs_model: new PublicationModel(),
                    s_contacts_model: new ContactModel(),
                    s_factors_model: new FactorModel(),
                    s_protocols_model: new ProtocolModel()
                }
            ]
        } else {
            var studiesData = studies;
            var i=0;
            for (i = 0; i < studiesData.length; i++) {
                var study=studiesData[i]
                study['s_assays_model'] = new AssayModel(study.s_assays);
                study['s_publications_model'] = new PublicationModel(study.s_publications);
                study['s_contacts_model'] = new ContactModel(study.s_contacts);
                study['s_factors_model'] = new FactorModel(study.s_factors);
                study['s_protocols_model'] = new ProtocolModel(study.s_protocols);
                delete study['s_assays']
                delete study['s_publications']
                delete study['s_contacts']
                delete study['s_factors']
                delete study['s_protocols']
            }
        }

        var self = this;
        self.studies = ko.observableArray(studiesData);

        self.addStudy = function () {
            self.studies.push({
                s_id: "",
                s_title: "",
                s_description: "",
                s_grand_number: "",
                s_funding_agency: "",
                s_submission_date: "",
                s_public_release_date: "",
                s_organisms: [],
                s_assays_model: new AssayModel(),
                s_pubs_model: new PublicationModel(),
                s_contacts_model: new ContactModel(),
                s_factors_model: new FactorModel(),
                s_protocols_model: new ProtocolModel()
            });
        };

        self.removeStudy = function (study) {
            self.studies.remove(study);
        };

        self.toJSON = function () {
            var jsonStudies = [];
            for (var i = 0; i < self.studies().length; i++) {
                var currStudy = self.studies()[i];
                var study = {
                    s_id: currStudy.s_id,
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
                studies: jsonStudies
            }
        }
    };

});