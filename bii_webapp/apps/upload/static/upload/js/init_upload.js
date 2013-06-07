$(document).ready(function () {

//    $('.uneditable-input >i').removeClass('icon-file')

    $(window).bind('beforeunload', function () {
        if (upload.getState()!='STOPPED')
            showToast('Uploading will resume in the background')
    });

    if (vars.upload_session) {
        upload.resume(vars.upload_session);
    }

    $('#file').change(function () {
        if ($('#file').val()) {
            upload.reset(upload.start, this.files[0]);
        }
    })
});