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
            platforms.push(assay_mapping.platforms[platIndex].name);
        }
        return platforms;
    }

    function getTechnologies(technolgiesArray) {
        var technologies = [];
        for (var i = 0; i < technolgiesArray.length; i++) {
            var techIndex = technolgiesArray[i] - 1;
            technologies.push(assay_mapping.technologies[techIndex].name);
        }
        return technologies;
    }

    function createOptions() {
        for (var i = 0; i < assay_mapping.assay_mappings.length; i++) {
            var measIndex = assay_mapping.assay_mappings[i].measurement - 1
            measurementOptions.push({
                measurement: assay_mapping.measurements[measIndex].name,
                platforms: getPlatforms(assay_mapping.assay_mappings[i].platforms),
                technologies: getTechnologies(assay_mapping.assay_mappings[i].technologies)
            })
        }


    }

    createOptions();

    StudyAssayModel = function (assays) {
        if (!assays)
            assays = [
                {
                    s_measurement: ko.observable(0),
                    s_technology: ko.observable(0),
                    s_platform: ko.observable(0)
                }
            ]

        var subscription=function(data) {
            self.availableTechnologies = ko.observableArray(data.technologies);
            self.availablePlatforms = ko.observableArray(data.platforms);
            var techOptions = '';
            for(var i=0;i<data.technologies.length;i++){
                var t=data.technologies[i];
                techOptions+="<option value="+t+">"+t+"</option>"
            }
            var platOptions = '';
            for(var i=0;i<data.platforms.length;i++){
                var p=data.platforms[i];
                platOptions+="<option value="+p+">"+p+"</option>"
            }
            $('#assay_tab_content .active #technologiesSelect').html(techOptions);
            $('#assay_tab_content .active #platformsSelect').html(platOptions);
        }

        assays[0].s_measurement.subscribe(function(data){subscription(data)});

        var self = this;
        self.assays = ko.observableArray(assays);

        self.availableMeasurements = ko.observableArray(measurementOptions);
        self.availableTechnologies = ko.observableArray(measurementOptions[0].technologies);
        self.availablePlatforms = ko.observableArray(measurementOptions[0].platforms);

        self.addAssay = function () {
            self.assays.push({
                s_measurement: ko.observable(0),
                s_technology: ko.observable(0),
                s_platform: ko.observable(0)
            });
            self.assays()[self.assays().length-1].s_measurement.subscribe(function(data){subscription(data)});
        };

        self.removeAssay = function (assay) {
            self.assays.remove(assay);
        };

        self.removeAssay(self.assays()[0]);

        self.toJSON=function(){
            var assays=[];
            for (var i = 0; i < self.assays().length; i++) {
                var assay = {
                     s_measurement:self.assays()[i].s_measurement(),
                     s_technology:self.assays()[i].s_technology(),
                     s_platform:self.assays()[i].s_platform()
                }
                assays.push(assay);
            }
            return{
                assays:assays
            }
        }
    };

});