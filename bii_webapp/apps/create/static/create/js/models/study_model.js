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

        var s_id=study.s_id().replace(' ', '_');
        if(s_id!=study.s_id()){
            study.s_id(s_id);
            return;
        }

        var cnt=0;
        for(var i=0;i<self.studies().length;i++){
            var currStudy=self.studies()[i];
            if(currStudy.s_id()==s_id){
                cnt++;
                if(cnt==2)
                    break;
            }
        }

        if(cnt==2){
            study.s_id(study.s_id()+'_'+(cnt-1));
            return;
        }

        study.s_sample_filename('s_' + study.s_id() + '.txt');

        for (var i = 0; i < study.s_assays_model.assays().length; i++) {
            var assay = study.s_assays_model.assays()[i];
            var split = assay.filename().split('_');
            split[1] = study.s_id();
            assay.filename(split.join('_'));
        }
    }

    if (studies == undefined) {

        var filename = 's_.txt';

        var study = {
            s_id: ko.observable(""),
            s_title: "",
            s_description: "",
            s_grand_number: "",
            s_funding_agency: "",
            s_submission_date: "",
            s_public_release_date: "",
            s_sample_filename: ko.observable(filename.replace(/ /g, '_')),
            s_pubs_model: new PublicationModel([]),
            s_contacts_model: new ContactModel([]),
            s_factors_model: new StudyFactorModel([]),
            s_protocols_model: new StudyProtocolModel([])
        };
        study.s_assays_model = new StudyAssayModel(study.s_id);
        studies = [study]
        study.s_id.subscribe(function (data) {
            self.subscription(data, study)
        });

        self.studies = ko.observableArray(studies);
        for (var i = 0; i < self.studies().length; i++) {
            var study = self.studies()[i];
            study.s_spreadsheet = new StudySpreadSheetModel(study, self.studies);
        }
    }else{
        self.studies = ko.observableArray(studies);
    }

    self.addStudy = function () {

        var filename = 's_.txt';

        var study = {
            s_id: ko.observable(""),
            s_title: "",
            s_description: "",
            s_grand_number: "",
            s_funding_agency: "",
            s_submission_date: "",
            s_public_release_date: "",
            s_sample_filename: ko.observable(filename),
            s_pubs_model: new PublicationModel([]),
            s_contacts_model: new ContactModel([]),
            s_factors_model: new StudyFactorModel([]),
            s_protocols_model: new StudyProtocolModel([])
        }
        study.s_assays_model = new StudyAssayModel(study.s_id);
        self.studies.push(study);
        study.s_id.subscribe(function (data) {
            self.subscription(data, study)
        });

        study.s_spreadsheet = new StudySpreadSheetModel(study,self.studies);
    };

    self.removeStudy = function (study) {
        var index = self.studies.indexOf(study);
        if (index != self.studies().length - 1) {
            var studies = [];
            for (var i = 0; i < self.studies().length; i++) {
                if (i != index) {
                    studies.push(self.studies()[i]);
                }
            }
            studies.push(self.studies()[index]);
            self.studies(studies);
        }
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
                s_sample_filename: currStudy.s_sample_filename(),
                s_spreadsheet: currStudy.s_spreadsheet.toJSON(),
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
