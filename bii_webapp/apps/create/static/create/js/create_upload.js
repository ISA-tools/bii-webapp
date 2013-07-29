var create_upload = function () {

    function start(data) {
        upload.reset();
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


        var name = file.name;
        var size = file.size;
        var formData = new FormData();
        formData.append('filename', name);
        formData.append('filesize', size);
        formData.append('uploadID', data.INFO.uploadID);
        var url = document.URL;
        url = url.substring(0, url.lastIndexOf("/")) + '/uploadSave';

        $.ajax({
                url: url,  //server script to process data
                type: 'POST',
                //Ajax events
                success: completeHandler = function (data) {
                    $('#upload_modal #cancelButton').removeAttr('onclick');
                    $('#upload_modal #cancelButton').text('Close');
                    if (data.UPLOAD)
                        upload.update(data, true);
                    if (!upload.isIssuesExist(data))
                        if (data.UPLOAD.type == 'investigation')
                            $('#result > a').attr('href', vars.urls.getInvestigation + '/' + data.UPLOAD.ID);
                        else
                            $('#result > a').attr('href', vars.urls.getStudy + '/' + data.UPLOAD.ID);
                    upload.STATE = 'STOPPED';
                },
                error: errorHandler = function (xmlHttpRequest, ErrorText, thrownError) {
                    if (xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0)
                        return;  // it's not really an error
                },
                dataType: 'json',
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            }
        );

        upload.STATE = 'STARTED';
        pollProgress(data.INFO.uploadID, data);
    }

    function pollProgress(uploadID, upload_session) {

        if (upload_session.ERROR) {
            upload.STATE = 'STOPPED';
            return;
        }

        upload.update(upload_session);

        if (upload.isIssuesExist(upload_session)) {
            $('#upload_modal #cancelButton').removeAttr('onclick');
            $('#upload_modal #cancelButton').text('Close');
            upload.STATE = 'STOPPED';
            return;
        }

        if (upload.STATE == 'STOPPING' || upload_session.UPLOAD.stage == 'complete') {
            upload.STATE = 'STOPPED';
            $('#upload_modal #cancelButton').removeAttr('onclick');
            $('#upload_modal #cancelButton').text('Close');
            return;
        }

        setTimeout(function () {
            request.requestUpdate(uploadID, function (upload_session) {

                function checkQueue() {
                    if (!progressHandler.isRunning())
                        pollProgress(uploadID, upload_session);
                    else if (upload.STATE == 'STARTED')
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