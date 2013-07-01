/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */

var StudyAssayModel;
$(document).ready(function () {

    var measurementOptions = [];

    function getPlatforms(platformsArray) {
        var platforms = [];
        for (var i = 0; i < platformsArray.length; i++) {
            var platIndex = platformsArray[i] - 1;
            platforms.push(vars.configuration.platforms[platIndex].name);
        }
        return platforms;
    }

    function getTechnologies(technolgiesArray) {
        var technologies = [];
        for (var i = 0; i < technolgiesArray.length; i++) {
            var techIndex = technolgiesArray[i] - 1;
            technologies.push(vars.configuration.technologies[techIndex].name);
        }
        return technologies;
    }

    function createOptions() {
        for (var i = 0; i < vars.configuration.length; i++) {
            var measIndex = vars.configuration[i].measurement - 1
            measurementOptions.push({
                measurement: vars.configuration.measurements[measIndex].name,
                platforms: getPlatforms(vars.configuration[i].platforms),
                technologies: getTechnologies(vars.configuration[i].technologies)
            })
        }


    }

    createOptions();

    StudyAssayModel = function (studyID, assays) {

        var self = this;

        self.studyID = studyID;
        self.availableMeasurements = ko.observableArray(vars.configuration.measurements);
        self.availableTechnologies = ko.observableArray(vars.configuration.measurements[0].technologies);
        self.availablePlatforms = ko.observableArray(vars.configuration.measurements[0].technologies[0].platforms);

        var measuSubscription = function (data, assay) {
            self.availableTechnologies(data.technologies);
            var filename = assay.s_filename();
            var split = filename.split('_').slice(0, 2);
            var spaceSplit = data.measurement.split(' ');
            split = split.concat(spaceSplit);
            filename= split.join('_');

            var cnt=0;
            for (var i = 0; i < self.assays().length; i++) {
                var curName = self.assays()[i].s_filename();
                if (curName.indexOf(filename)!=-1)
                    cnt++;
            }

            filename += (cnt == 0 ? '' : cnt) + '.txt';
            assay.s_filename(filename);
            assay.s_spreadsheet.addSpreadSheet(false,assay.s_measurement().measurement,assay.s_technology().technology);
        }

        var techSubscription = function (data, assay) {
            self.availablePlatforms(data.platforms);
            assay.s_spreadsheet.addSpreadSheet(false,assay.s_measurement().measurement,assay.s_technology().technology);
        }

        if (!assays) {
            var filename = 'a_' + self.studyID() + "_" + self.availableMeasurements()[0].measurement + '.txt';
            var assay =
            {
                s_measurement: ko.observable(0),
                s_technology: ko.observable(0),
                s_platform: ko.observable(0),
                s_filename: ko.observable(filename.replace(/ /g, '_'))
            }
            assays = [assay]
            assay.s_measurement.subscribe(function (data) {
                measuSubscription(data,assay)
            });
            assay.s_technology.subscribe(function (data) {
                techSubscription(data,assay)
            });
            assay.s_spreadsheet=new SpreadSheetModel(1);
        }

        self.assays = ko.observableArray(assays);

        self.addAssay = function () {
            var filename = 'a_' + self.studyID() + "_" + self.availableMeasurements()[0].measurement;
            filename = filename.replace(/ /g, '_');
            var cnt = 0;
            for (var i = 0; i < self.assays().length; i++) {
                var curName = self.assays()[i].s_filename();
                if (curName.indexOf(filename)!=-1)
                    cnt++;
            }

            filename += (cnt == 0 ? '' : cnt) + '.txt';

            var assay = {
                s_measurement: ko.observable(0),
                s_technology: ko.observable(0),
                s_platform: ko.observable(0),
                s_filename: ko.observable(filename)
            }
            self.assays.push(assay);
            assay.s_measurement.subscribe(function (data) {
                measuSubscription(data, assay)
            });
            assay.s_technology.subscribe(function (data) {
                techSubscription(data,assay)
            });
            assay.s_spreadsheet=new SpreadSheetModel(self.assays().length,assay.s_measurement().measurement,assay.s_technology().technology);
        };

        self.removeAssay = function (assay) {
            self.assays.remove(assay);
        };

        self.removeAssay(self.assays()[0]);

        self.toJSON = function () {
            var assays = [];
            for (var i = 0; i < self.assays().length; i++) {
                var assay = {
                    s_measurement: self.assays()[i].s_measurement(),
                    s_technology: self.assays()[i].s_technology(),
                    s_platform: self.assays()[i].s_platform()
                }
                assays.push(assay);
            }
            return{
                assays: assays
            }
        }
    };

});