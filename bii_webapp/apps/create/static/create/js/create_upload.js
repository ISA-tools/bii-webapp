var create_upload = function () {

    function start(data) {
        $('#upload_modal').modal(
            {escapeClose: false,
            clickClose: false,
            showClose: false});
        $('#upload_modal #cancelButton').attr('onclick', 'javascript:upload.cancel()');
        $('#upload_modal #cancelButton').text('Cancel');

        var file = {
            name: data.UPLOAD.filename,
            size: data.UPLOAD.filesize
        }
        $('#upload_file_title h3').text(file.name);
        helper.insertFields(file);
        progressHandler.progressStage(1, 0);
        helper.toggleButtons('cancel');
        STATE = 'STARTED';
        pollProgress(data.INFO.uploadID, data);
    }

    function pollProgress(uploadID, upload_session) {

        if (upload_session.ERROR) {
            STATE = 'STOPPED';
            return;
        }

        upload.update(upload_session);

        if (upload.isIssuesExist(upload_session)) {
            $('#upload_modal #cancelButton').removeAttr('onclick');
            $('#upload_modal #cancelButton').text('Close');
            STATE = 'STOPPED';
            return;
        }

        if (STATE == 'STOPPING' || upload_session.UPLOAD.stage == 'complete') {
            STATE = 'STOPPED';
            $('#upload_modal #cancelButton').removeAttr('onclick');
            $('#upload_modal #cancelButton').text('Close');
            return;
        }

        setTimeout(function () {
            request.requestUpdate(uploadID, function (upload_session) {

                function checkQueue() {
                    if (!progressHandler.isRunning())
                        pollProgress(uploadID, upload_session);
                    else if (STATE == 'STARTED')
                        setTimeout(checkQueue, 500);
                }

                checkQueue();

            })
        }, 2000);
    }

    return{
        start: start
    }


}();