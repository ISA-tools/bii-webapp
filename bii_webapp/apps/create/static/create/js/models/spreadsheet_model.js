/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */

var SpreadSheetModel;
$(document).ready(function () {

    SpreadSheetModel = function (assayID, measurement, technology) {
        var self = this;

        self.measurement = measurement;
        self.technology = technology;
        self.assayID = assayID;
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
            var data=[];
            for(var i=0;i<20;i++){
                var row=[];
                for(var j=0;j<self.fields.length;j++){
                    row[j]="";
                }
                data.push(row);
            }
            self.columns.data = [];
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
                self.columns.data.push("");

                if(self.fields[i]['protocol-type']){
                    self.columns.colHeaders.push('Protocol REF');
                    self.columns.colAttrs.push({data: 'Protocol REF', type: 'text'});
                    self.columns.data.push(self.fields[i]['protocol-type']);
                }
            }

            var data=[];
            for(var i=0;i<20;i++){
                data.push(self.columns.data);
            }
            self.columns.data=data;

        }

        var initialised = false;

        var whiteRenderer = function (instance, td, row, col, prop, value, cellProperties) {
            Handsontable.TextCell.renderer.apply(this, arguments);
            $(td).css({
                background: 'white'
            });
        };

        self.addSpreadSheet = function (init, measurement, technology) {
            if (initialised && init)
                return;

            if (!initialised && init)
                initialised = true;

            if (measurement) {
                self.measurement = measurement;
            }
            if (technology) {
                self.technology = technology;
            }

            findFields();
            getColumns();
            var modal = $('#modal' + self.assayID);
            modal.show();
            var modalBody = $('#modal-body' + self.assayID);
            modalBody.handsontable({
                data:self.columns.data,
                startRows: 20,
                colHeaders: self.columns.colHeaders,
                contextMenu: true,
                width: 1152,
                height: 600,
                cells: function (row, col, prop) {
                    this.renderer = whiteRenderer;
                }
            });
            modal.hide();
        }
    }

});