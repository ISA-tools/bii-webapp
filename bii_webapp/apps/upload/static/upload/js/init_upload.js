$(document).ready(function () {

//    $('.uneditable-input >i').removeClass('icon-file')

    $('#retry').hide();

    $('#select_file').click(function(){
        $('#file').val('');
        $('#retry').hide();
    })

    $(window).bind('beforeunload', function () {
        if (upload.getState()=='STARTED')
            $().toastmessage('showNoticeToast','Uploading will resume in the background');
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