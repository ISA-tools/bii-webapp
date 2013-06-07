var request = function () {

    function requestUpdate(callback) {
        $.ajax({
                url: vars.url.uploadFileProgress,  //server script to process data
                type: 'GET',
                //Ajax events
                success: completeHandler = function (data) {
                    callback(data);
                },
                timeout: -1,
                error: errorHandler = function (xmlHttpRequest, ErrorText, thrownError) {
                    if (xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0)
                        return;  // it's not really an error
                    handleConnectionErrors();
                    callback(vars.upload_session);
                },
                dataType: 'json'
            }
        )
        ;
    }

    function handleConnectionErrors() {
        var error_message = "Connection failed";
        if (vars.upload_session)
            vars.upload_session[vars.upload_session.stage].errors =
            {
                total: 1,
                messages: error_message.charAt(0).toUpperCase() + error_message.slice(1)
            }
        else {
            vars.upload_session = {
                errors:true,
                stage:'uploading',
                uploading: {
                    errors: {
                        total: 1,
                        messages: error_message.charAt(0).toUpperCase() + error_message.slice(1)
                    }
                }
            }
        }
    }

    function cancelFile(callback) {
        $.ajax({
                url: vars.url.cancelUpload,  //server script to process data
                type: 'GET',
                //Ajax events
                success: completeHandler = function (data) {
                    callback(data);
                },
                timeout: -1,
                error: errorHandler = function (xmlHttpRequest, ErrorText, thrownError) {
                    if (xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0)
                        return;  // it's not really an error
                    handleConnectionErrors();
                    callback(vars.upload_session);
                },
                dataType: 'json'
            }
        )
        ;
    }

    function uploadFile(file, callback) {
        name = file.name;
        size = file.size;
        type = file.type;

        if (file.name.length < 1) {
            alert('Filename less than a character')
        } else {
            var formData = new FormData();
            formData.append('file', file);
            $.ajax({
                url: vars.url.uploadFile,  //server script to process data
                type: 'POST',
                //Ajax events
                success: successHandler = function (data) {
                    callback(data);
                },
                timeout: -1,
                error: errorHandler = function (xmlHttpRequest, ErrorText, thrownError) {
                    if (xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0)
                        return;  // it's not really an error
                    handleConnectionErrors();
                    callback(vars.upload_session);
                },
                // Form data
                data: formData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false
            });
        }
    }

    return {
        requestUpdate: requestUpdate,
        cancelFile: cancelFile,
        uploadFile: uploadFile
    }
}

    ();
