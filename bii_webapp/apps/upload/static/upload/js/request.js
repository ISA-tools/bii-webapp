var request = function () {

    function requestUpdate(uploadID,callback) {
        $.ajax({
                url: vars.urls.uploadFileProgress+'?uploadID='+uploadID,  //server script to process data
                type: 'GET',
                //Ajax events
                success: completeHandler = function (data) {
                    if (callback)callback(data);
                },
                error: errorHandler = function (xmlHttpRequest, ErrorText, thrownError) {
                    if (xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0)
                        return;  // it's not really an error
                    handleConnectionErrors();
                    if (callback)callback(vars.upload_progress);
                },
                dataType: 'json'
            }
        )
        ;
    }

    function requestInit(file,callback) {
        var name = file.name;
        var size = file.size;
        var formData = new FormData();
        formData.append('filename', name);
        formData.append('filesize', size);
        $.ajax({
                url: vars.urls.init,  //server script to process data
                type: 'POST',
                //Ajax events
                success: completeHandler = function (data) {
                    if (callback)callback(data);
                },
                error: errorHandler = function (xmlHttpRequest, ErrorText, thrownError) {
                    if (xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0)
                        return;  // it's not really an error
                    handleConnectionErrors();
                    if (callback)callback(vars.upload_progress);
                },
                data: formData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false
            }
        )
        ;
    }

    function handleConnectionErrors() {
        var error_message = "Connection failed";
        if (vars.upload_progress){
            var obj=vars.upload_progress.UPLOAD;
            obj[obj.stage].ERROR =
            {
                total: 1,
                messages: error_message.charAt(0).toUpperCase() + error_message.slice(1)
            }
        }
        else {
            vars.upload_progress = {
                'UPLOAD': {
                    stage: 'uploading',
                    uploading: {
                        ERROR: {
                            total: 1,
                            messages: error_message.charAt(0).toUpperCase() + error_message.slice(1)
                        }
                    }
                }
            }
        }
    }

    function cancelFile(uploadID,callback) {
        $.ajax({
                url: vars.urls.cancelUpload+'?uploadID='+uploadID,  //server script to process data
                type: 'GET',
                //Ajax events
                success: completeHandler = function (data) {
                    if (callback)callback(data);
                },
                error: errorHandler = function (xmlHttpRequest, ErrorText, thrownError) {
                    if (xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0)
                        return;  // it's not really an error
                    handleConnectionErrors();
                    if (callback)callback(vars.upload_progress);
                },
                dataType: 'json'
            }
        )
        ;
    }

    function reset() {
        $.ajax({
                url: vars.urls.resetUpload,  //server script to process data
                type: 'GET',
                async: false
                //Ajax events
            }
        );
    }

    function uploadFile(uploadID,file, callback) {
        var name = file.name;
        var size = file.size;
        var type = file.type;

        if (file.name.length < 1) {
            alert('Filename less than a character')
        } else {
            var formData = new FormData();
            formData.append('file', file);
            formData.append('uploadID', uploadID);
            formData.append('filename', name);
            formData.append('filesize', size);
            $.ajax({
                url: vars.urls.uploadFile,  //server script to process data
                type: 'POST',
                //Ajax events
                success: successHandler = function (data) {
                    if (callback) callback(data);
                },
                error: errorHandler = function (xmlHttpRequest, ErrorText, thrownError) {
                    if (xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0)
                        return;  // it's not really an error
                    handleConnectionErrors();
                    if (callback)callback(vars.upload_progress);
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
        uploadFile: uploadFile,
        reset: reset,
        requestInit: requestInit
    }
}

    ();
