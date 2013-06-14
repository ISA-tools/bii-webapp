$(document).ready(function () {

//    $('.uneditable-input >i').removeClass('icon-file')

    $(window).bind('beforeunload', function () {
        if (upload.getState()=='STARTED')
            showToast('Uploading will resume in the background')
    });

    if (vars.upload_progress) {
        upload.resume(vars.upload_progress);
    }

    $('#file').change(function () {
        if ($('#file').val()) {
            upload.reset(upload.start, this.files[0]);
        }
    })
});