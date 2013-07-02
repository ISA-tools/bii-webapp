/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */


var StudyPublicationModel = function (publications) {
    if (!publications)
        publications = [
            {
                s_pubmed_id: "",
                s_pub_doi: "",
                s_pub_author_list: "",
                s_pub_title: "",
                s_pub_status: ""}
        ]

    var self = this;
    self.publications = ko.observableArray(publications);

    self.addPublication = function () {
        self.publications.push({
            s_pubmed_id: "",
            s_pub_doi: "",
            s_pub_author_list: "",
            s_pub_title: "",
            s_pub_status: ""
        });
    };

    self.removePublication = function (publication) {
        self.publications.remove(publication);
    };

    self.toJSON = function () {
        var publications = [];
        for (var i = 0; i < self.publications().length; i++) {
            var publication = {
                s_pubmed_id: self.publications()[i].s_pubmed_id,
                s_pub_doi: self.publications()[i].s_pub_doi,
                s_pub_author_list: self.publications()[i].s_pub_author_list,
                s_pub_title: self.publications()[i].s_pub_title,
                s_pub_status: self.publications()[i].s_pub_status
            }
            publications.push(publication);
        }
        return{
            publications: publications
        }
    }
};
