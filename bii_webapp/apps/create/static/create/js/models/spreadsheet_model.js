/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */


var SpreadSheetModel = function (assay,assays) {
    var self = this;

    self.columns = {};
    self.fields = [];

    function findFields() {
        var headers = vars.configuration.headers;
        for (var i = 0; i < headers.length; i++) {
            if (headers[i].name == assay.measurement().measurement + ',' + assay.technology().technology) {
                self.fields = headers[i].fields;
                break;
            }
        }

    }

    function getColumns() {
        self.columns.colHeaders = [];
        self.columns.colAttrs = [];
        self.columns.data = [];
        var data = [];
        for (var i = 0; i < 20; i++) {
            var row = [];
            for (var j = 0; j < self.fields.length; j++) {
                row[j] = "";
            }
            data.push(row);
        }

        var dataObj = {};
        var offset = 0;
        for (var i = 0; i < self.fields.length; i++) {
            self.columns.colHeaders.push(self.fields[i]['@header']);
            var type = self.fields[i]['@data-type'];

            var obj = {data: self.fields[i]['@header'] + "_row" + (offset + i)};
            if (type.toUpperCase() == 'INTEGER') {
                obj['type'] = 'numeric'
            }

            self.columns.colAttrs.push(obj);
            dataObj[self.fields[i]['@header'] + "_row" + (offset + i)] = "";

            if (self.fields[i]['protocol-field']) {
                offset++;
                var pfield = self.fields[i]['protocol-field'];
                self.columns.colHeaders.push('Protocol REF');
                self.columns.colAttrs.push({data: 'Protocol REF_row' + (offset + i), type: 'text'});
                dataObj['Protocol REF_row' + (i + offset)] = pfield['protocol-type'];
            }
            if (self.fields[i]['unit-field']) {
                offset++;
                var ufield = self.fields[i]['unit-field'];
                self.columns.colHeaders.push('Unit REF');
                self.columns.colAttrs.push({data: 'Unit REF_row' + (offset + i)});
                dataObj['Unit REF_row' + (offset + i)] = "";
            }
        }

        for (var i = 0; i < 20; i++) {
            var newObject = jQuery.extend(true, {}, dataObj);
            self.columns.data.push(newObject);
        }

    }

    var initialised = false;

    var whiteRenderer = function (instance, td, row, col, prop, value, cellProperties) {
        Handsontable.TextCell.renderer.apply(this, arguments);
        $(td).css({
            background: 'white'
        });
    };

    self.addSpreadSheet = function (init) {
        if (initialised && init)
            return;

        if (!initialised && init)
            initialised = true;

        findFields();
        getColumns();
        var assayIndex=assays.indexOf(assay)+1;
        var modal = $('#modal' + assayIndex);
        if(modal.length==0)
            modal=$('.modal');

        modal.show();

        var modalBody = $('#modal-body' + assayIndex);
        if(modalBody.length==0)
            modalBody=$('.modal-body');

        modalBody.handsontable({
            data: self.columns.data,
            columns: self.columns.colAttrs,
            colHeaders: self.columns.colHeaders,
            startRows: 20,
            rowHeaders: true,
            contextMenu: true,
            width: 1140,
            height: 530,
            cells: function (row, col, prop) {
                this.renderer = whiteRenderer;
            }
        });
        modal.hide();
    }

    self.toJSON = function () {
        var modalBody = $('#modal-body' + (assays.indexOf(assay)+1));
        if (modalBody.data('handsontable'))
            return modalBody.data('handsontable').getData();
        else{
            self.addSpreadSheet(true);
            return modalBody.data('handsontable').getData();
        }
    }

}
