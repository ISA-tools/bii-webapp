/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */

var PublicationModel;
$(document).ready(function () {

    PublicationModel = function (publications) {
        if(!publications)
            publications=[{
            pubmed_id: "",
            pub_doi: "",
            pub_author_list: "",
            pub_title: "",
            pub_status: ""}]

        var self = this;
        self.publications = ko.observableArray(publications);

        self.addPublication = function () {
            self.publications.push({
                pubmed_id: "",
                pub_doi: "",
                pub_author_list: "",
                pub_title: "",
                pub_status: ""
            });
        };

        self.removePublication = function (publication) {
            self.publications.remove(publication);
        };

        self.toJSON=function(){
            var publications=[];
            for (var i = 0; i < self.publications().length; i++) {
                var publication = {
                    pubmed_id: self.publications()[i].pubmed_id,
                    pub_doi: self.publications()[i].pub_doi,
                    pub_author_list: self.publications()[i].pub_author_list,
                    pub_title: self.publications()[i].pub_title,
                    pub_status: self.publications()[i].pub_status
                }
                publications.push(publication);
            }
            return{
                publications:publications
            }
        }
    };

});