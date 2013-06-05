$(document).ready(function () {
    $('span.fileupload-new').click(function () {
        $('#ZipFile').val("");
    });


    function calcSize(filesize) {
        var size = filesize;
        var mm = 'bytes';

        if (size > 1024) {
            size = Math.round(size / 1024);
            mm = 'kb';
        }

        if (size > 1024) {
            size = Math.round(size / 1024);
            mm = 'mb';
        }
        if (size > 1024) {
            size = Math.round(size / 1024);
            mm = 'gb';
        }

        return size + '' + mm;

    }

    function setFields(file) {
        var first = true;
        $('.filename').each(function () {
            $(this).text(file.name);
            if (first) {
                first = false;
                var size = calcSize(file.size);
                $(this).text($(this).text() + ' (' + size + ')');
            }
        });
    }

    $('#ZipFile').change(function () {
        if ($('#ZipFile').val()) {
            setFields(this.files[0]);
            upload.start(this.files[0]);
        }
    })
});