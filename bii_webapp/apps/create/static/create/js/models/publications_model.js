/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */


var PublicationModel = function (publications) {

    var self = this;

    self.subscription = function (data, pub) {
        var pub_id = pub.pub_med_id().replace(' ', '_');
        if (pub_id != pub.pub_med_id()) {
            pub.pub_med_id(pub_id);
            return;
        }

        var cnt = 0;
        for (var i = 0; i < viewModel.investigation().i_studies_model.studies().length; i++) {
            var study=viewModel.investigation().i_studies_model.studies()[i];
            for (var j = 0; j < study.s_pubs_model.publications().length; j++) {
                var currPub = study.s_pubs_model.publications()[j];
                if (currPub.pub_med_id() == pub.pub_med_id()) {
                    cnt++;
                    if (cnt == 2)
                        break;
                }
            }
        }
        if (cnt == 2) {
            pub.pub_med_id(pub.pub_med_id() + '_' + 1);
            return
        }
    }

    if (!publications) {
        var pub = {
            pub_med_id: ko.observable(""),
            pub_doi: "",
            pub_author_list: "",
            pub_title: "",
            pub_status: ""
        }
        publications = [pub]
        pub.pub_med_id.subscribe(function (data) {
            self.subscription(data, pub);
        });
    }

    self.publications = ko.observableArray(publications);

    self.addPublication = function () {
        var pub = {
            pub_med_id: ko.observable(""),
            pub_doi: "",
            pub_author_list: "",
            pub_title: "",
            pub_status: ""
        }
        self.publications.push(pub);
        pub.pub_med_id.subscribe(function (data) {
            self.subscription(data, pub);
        });
    };

    self.removePublication = function (publication) {
        var index = self.publications.indexOf(publication);
        if (index != self.publications().length - 1) {
            var publications = [];
            for (var i = 0; i < self.publications().length; i++) {
                if (i != index) {
                    publications.push(self.publications()[i]);
                }
            }
            publications.push(self.publications()[index]);
            self.publications(publications);
        }
        self.publications.remove(publication);
    };

    self.toJSON = function () {
        var publications = [];
        for (var i = 0; i < self.publications().length; i++) {
            var publication = {
                pub_med_id: self.publications()[i].pub_med_id(),
                pub_doi: self.publications()[i].pub_doi,
                pub_author_list: self.publications()[i].pub_author_list,
                pub_title: self.publications()[i].pub_title,
                pub_status: self.publications()[i].pub_status
            }
            publications.push(publication);
        }
        return{
            publications: publications
        }
    }
};
