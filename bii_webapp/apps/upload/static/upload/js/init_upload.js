$(document).ready(function () {
    $('span.fileupload-new').click(function () {
        $('#ZipFile').val("");
    });

    $(window).bind('beforeunload', function () {
        if (vars.upload_session)
            return 'Uploading will resume in the background';
    });

    if (vars.upload_session)
        upload.resume(vars.upload_session);

    $('#ZipFile').change(function () {
        if ($('#ZipFile').val()) {
            upload.start(this.files[0]);
        }else{
            upload.clearFields();
        }
    })
});