/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */

var AssayModel;
$(document).ready(function () {

    AssayModel = function (assays) {

        if (!assays)
            assays = [
                {
                    number_of_samples: "",
                    measurement: "",
                    technology: "",
                    platform: ""
                }
            ]

        var self = this;
        self.assays = ko.observableArray(assays);

        self.addFactor = function () {
            self.assays.push({
                number_of_samples: "",
                measurement: "",
                technology: "",
                platform: ""
            });
        };

        self.removeAssay = function (assay) {
            self.assays.remove(assay);
        };

        self.toJSON = function () {
            var assays = [];
            for (var i = 0; i < self.assays().length; i++) {
                var assay = {
                    number_of_samples: self.assays()[i].number_of_samples,
                    measurement: self.assays()[i].measurement,
                    technology: self.assays()[i].technology,
                    platform: self.assays()[i].platform
                }
                assays.push(assay);
            }
            return{
                assays: assays
            }
        }
    };

});