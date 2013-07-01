/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */

var SpreadSheetModel;
$(document).ready(function () {

    SpreadSheetModel = function (assayID,measurement, technology) {
        var self = this;

        self.measurement=measurement;
        self.technology=technology;
        self.assayID=assayID;
        self.columns = {};
        self.fields = [];

        function findFields() {
            var headers = vars.configuration.headers;
            for (var i = 0; i < headers.length; i++) {
                if (headers[i].name == self.measurement + ',' + self.technology) {
                    self.fields = headers[i].fields;
                    break;
                }
            }

        }

        function getColumns() {
            self.columns.colHeaders = [];
            self.columns.colAttrs = [];
            for (var i = 0; i < self.fields.length; i++) {
                self.columns.colHeaders.push(self.fields[i]['@header']);
                var type = self.fields[i]['@data-type'];
                if (type.toUpperCase() == 'STRING')
                    type = 'text';
                else if (type.toUpperCase() == 'INTEGER')
                    type = 'numeric';
                else
                    type = 'text';

                self.columns.colAttrs.push({data: self.fields[i]['@header'], type: type});
            }
        }

        var initialised=false;
        self.addSpreadSheet = function (init,measurement, technology) {
            if(initialised && init)
                return;

            if(!initialised && init)
                initialised=true;

            if(measurement){
                self.measurement=measurement;
            }
            if(technology){
                self.technology=technology;
            }

            findFields();
            getColumns();
            var modal = $('#modal'+self.assayID);
            modal.show();
            var modalBody=$('#modal-body'+self.assayID);
            modalBody.handsontable({
                minSpareCols: 1,
                //always keep at least 1 spare row at the right
                minSpareRows: 1,
                //always keep at least 1 spare row at the bottom,
                rowHeaders: true,
                colHeaders: true,
                colHeaders: self.columns.colHeaders,
                columns: self.columns.colAttrs,
                contextMenu: true,
                width: 1152,
                height: 600,
                minRows: 20,
                minCols: self.columns.colHeaders.length
            });
            modal.hide();
        }
    }

});