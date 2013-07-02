/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */


var StudyModel = function (studies) {
    var self = this;

    self.subscription = function (data, study) {
        study.s_id(study.s_id().replace(' ', '_'));
        for (var i = 0; i < study.s_assays_model.assays().length; i++) {
            var assay = study.s_assays_model.assays()[i];
            var split = assay.s_filename().split('_');
            split[1] = study.s_id();
            assay.s_filename(split.join('_'));
        }
    }

    if (studies == undefined) {
        var study = {
            s_id: ko.observable(""),
            s_title: "",
            s_description: "",
            s_grand_number: "",
            s_funding_agency: "",
            s_submission_date: "",
            s_public_release_date: "",
            s_pubs_model: new StudyPublicationModel(),
            s_contacts_model: new StudyContactModel(),
            s_factors_model: new StudyFactorModel(),
            s_protocols_model: new StudyProtocolModel()
        };
        study.s_assays_model = new StudyAssayModel(study.s_id);
        studies = [study]
        study.s_id.subscribe(function (data) {
            self.subscription(data, study)
        });
    }

    self.studies = ko.observableArray(studies);

    self.addStudy = function () {
        var study = {
            s_id: ko.observable(""),
            s_title: "",
            s_description: "",
            s_grand_number: "",
            s_funding_agency: "",
            s_submission_date: "",
            s_public_release_date: "",
            s_pubs_model: new StudyPublicationModel(),
            s_contacts_model: new StudyContactModel(),
            s_factors_model: new StudyFactorModel(),
            s_protocols_model: new StudyProtocolModel()
        }
        study.s_assays_model = new StudyAssayModel(study.s_id);
        self.studies.push(study);
        study.s_id.subscribe(function (data) {
            self.subscription(data, study)
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
                s_id: currStudy.s_id(),
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
