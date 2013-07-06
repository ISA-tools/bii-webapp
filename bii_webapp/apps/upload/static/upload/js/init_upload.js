$(document).ready(function () {

    $('#retry').hide();

    $('#select_file').click(function(){
        $('#file').val('');
        $('#retry').hide();
    })

    $(window).bind('beforeunload', function () {
        if (upload.getState()=='STARTED')
            $().toastmessage('showNoticeToast','Uploading will resume in the background');
    });

//    if (vars.upload_progress) {
//        upload.resume(vars.upload_progress);
//    }

    $('#file').change(function () {
        if ($('#file').val()) {
            upload.start(this.files[0]);
        }
    })
});