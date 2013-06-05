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
            error: errorHandler = function (xhRequest, ErrorText, thrownError) {
                var error_message = "Failed to communicate with the server";
                if (thrownError != '') {
                    error_message = thrownError
                }
                var data = {
                    errors: {
                        total: 1,
                        messages: error_message.charAt(0).toUpperCase() + error_message.slice(1)
                    }
                }
                callback(data);
            },
            dataType: 'json'
        });
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
                error: errorHandler = function (xhRequest, ErrorText, thrownError) {
                    var error_message = "Failed to communicate with the server";
                    if (thrownError != '') {
                        error_message = thrownError;
                    }

                    var data = {
                        stage: 'uploading',
                        uploading: {
                            errors: {
                                total: 1,
                                messages: error_message.charAt(0).toUpperCase() + error_message.slice(1)
                            }
                        }
                    }
                    callback(data);
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
        uploadFile: uploadFile
    }
}();
