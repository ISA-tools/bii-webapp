$(document).ready(function () {
    upload.reset();
    $('#select_file').click(function () {
        $('#file').val("");
        $('#file').trigger('change');
    });

    $(window).bind('beforeunload', function () {
        if (vars.upload_session)
            return 'Uploading will resume in the background';
    });

    if (vars.upload_session) {
        upload.resume(vars.upload_session);
    }

    $('#file').change(function () {
        if ($('#file').val()) {
            upload.start(this.files[0]);
        }
    })
});