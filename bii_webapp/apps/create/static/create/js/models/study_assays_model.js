/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */


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

var StudyAssayModel = function (studyID, assays) {

    var self = this;

    self.createOptions=createOptions;

    self.studyID = studyID;

    var measuSubscription = function (data, assay) {
        assay.availableTechnologies(data.technologies);
        var filename = assay.filename();
        var split = filename.split('_').slice(0, 2);
        var spaceSplit = data.measurement.split(' ');
        split = split.concat(spaceSplit);
        filename = split.join('_');

        var cnt = 0;
        for (var i = 0; i < self.assays().length; i++) {
            var curName = self.assays()[i].filename();
            if (curName.indexOf(filename) != -1)
                cnt++;
        }

        filename += (cnt == 0 ? '' : cnt) + '.txt';
        assay.filename(filename);
        assay.spreadsheet.addSpreadSheet(false);
    }

    var techSubscription = function (data, assay) {
        assay.availablePlatforms(data.platforms);
        assay.spreadsheet.addSpreadSheet(false);
    }

    if (!assays) {
        var assay = {};
        assay.availableMeasurements = ko.observableArray(vars.configuration.measurements);
        assay.availableTechnologies = ko.observableArray(vars.configuration.measurements[0].technologies);
        assay.availablePlatforms = ko.observableArray(vars.configuration.measurements[0].technologies[0].platforms);

        var filename = 'a_' + self.studyID() + "_" + assay.availableMeasurements()[0].measurement + '.txt';
        assay.measurement = ko.observable(0),
        assay.technology = ko.observable(0),
        assay.platform = ko.observable(0),
        assay.filename = ko.observable(filename.replace(/ /g, '_'))
        assays = [assay]

        assay.measurement.subscribe(function (data) {
            measuSubscription(data, assay)
        });
        assay.technology.subscribe(function (data) {
            techSubscription(data, assay)
        });

        self.assays = ko.observableArray(assays);
        for (var i = 0; i < self.assays().length; i++) {
            var assay = self.assays()[i];
            assay.spreadsheet = new SpreadSheetModel(assay, self.assays);
        }

    } else {
        self.assays = ko.observableArray(assays);
    }


    self.addAssay = function () {
        var assay = {};
        assay.availableMeasurements = ko.observableArray(vars.configuration.measurements);
        assay.availableTechnologies = ko.observableArray(vars.configuration.measurements[0].technologies);
        assay.availablePlatforms = ko.observableArray(vars.configuration.measurements[0].technologies[0].platforms);

        var filename = 'a_' + self.studyID() + "_" + assay.availableMeasurements()[0].measurement;
        filename = filename.replace(/ /g, '_');
        var cnt = 0;
        for (var i = 0; i < self.assays().length; i++) {
            var curName = self.assays()[i].filename();
            if (curName.indexOf(filename) != -1)
                cnt++;
        }

        filename += (cnt == 0 ? '' : cnt) + '.txt';

        assay.measurement = ko.observable(0);
        assay.technology = ko.observable(0);
        assay.platform = ko.observable(0);
        assay.filename = ko.observable(filename);

        self.assays.push(assay);

        assay.measurement.subscribe(function (data) {
            measuSubscription(data, assay)
        });
        assay.technology.subscribe(function (data) {
            techSubscription(data, assay)
        });
        assay.spreadsheet = new SpreadSheetModel(assay, self.assays);
    };

    self.removeAssay = function (assay) {
        var index = self.assays.indexOf(assay);
        if (index != self.assays().length - 1) {
            var assays = [];
            for (var i = 0; i < self.assays().length; i++) {
                if (i != index) {
                    assays.push(self.assays()[i]);
                }
            }
            assays.push(self.assays()[index]);
            self.assays(assays);
        }
        self.assays.remove(assay);
    }

    self.toJSON = function () {
        var assays = [];
        for (var i = 0; i < self.assays().length; i++) {
            var assay = {
                measurement: self.assays()[i].measurement().measurement,
                technology: self.assays()[i].technology().technology,
                platform: self.assays()[i].platform(),
                filename: self.assays()[i].filename(),
                spreadsheet: self.assays()[i].spreadsheet.toJSON()
            }
            assays.push(assay);
        }
        return{
            assays: assays
        }
    }
};
