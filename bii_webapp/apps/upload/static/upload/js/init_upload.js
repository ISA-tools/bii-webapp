$(document).ready(function () {

//    $('.uneditable-input >i').removeClass('icon-file')

    $('#select_file').click(function () {
        $('#file').trigger('change');
    });

    $(window).bind('beforeunload', function () {
        if (upload.isStarted())
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