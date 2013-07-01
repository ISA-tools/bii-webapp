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
            self.columns.data = [];
            var data=[];
            for(var i=0;i<20;i++){
                var row=[];
                for(var j=0;j<self.fields.length;j++){
                    row[j]="";
                }
                data.push(row);
            }

            var dataObj={};
            var protCnt=0;
            for (var i = 0; i < self.fields.length; i++) {
                self.columns.colHeaders.push(self.fields[i]['@header']);
                var type = self.fields[i]['@data-type'];

                var obj={data: self.fields[i]['@header']};
                if (type.toUpperCase() == 'INTEGER'){
                    obj['type']='numeric'
                }

                self.columns.colAttrs.push(obj);
                dataObj[self.fields[i]['@header']]="";

                if(self.fields[i]['protocol-type']){
                    protCnt++;
                    self.columns.colHeaders.push('Protocol REF'+protCnt);
                    self.columns.colAttrs.push({data: 'Protocol REF'+protCnt, type: 'text'});
                    dataObj['Protocol REF'+protCnt]=self.fields[i]['protocol-type'];
                }
            }

            for(var i=0;i<20;i++){
                self.columns.data.push(dataObj);
            }

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
                columns:self.columns.colAttrs,
                colHeaders: self.columns.colHeaders,
                startRows: 20,
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