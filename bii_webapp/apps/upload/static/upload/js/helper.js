/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/7/13
 * Time: 12:54 AM
 * To change this template use File | Settings | File Templates.
 */
var helper = function () {

    function toggleButtons(state) {
        if (state == 'cancel') {
            $('#select_file').hide();
            $('#cancel').css({'display': 'inline-block'});
            $('#cancel').css('opacity', 1);
            $('#cancel').removeAttr('disabled');
            $('#cancel').text('Cancel');
            $('#cancel').css('background-image', '');
            $('#cancel').bind('mouseenter mouseleave');
        }
        else if (state == 'select') {
            $('#cancel').hide();
            $('#select_file').show();
        } else if (state == 'cancelling') {
            toggleButtons('cancel');
            $('#cancel').css('opacity', 0.5);
            $('#cancel').css('background-image', 'none', 'important');
            $('#cancel').attr('disabled',true);
            $('#cancel').unbind('mouseenter mouseleave');
            $('#cancel').text('Cancelling');
        }
    }

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

    function stageID(stage) {
        if (stage == 'uploading') {
            return 1;
        }
        if (stage == 'validating') {
            return 2;
        }
        if (stage == 'persisting') {
            return 3;
        }
        if (stage == 'complete') {
            return 4;
        }
    }

    function stageElement(id) {
        return $($('#upload-container').children('.uploading-container').get(id - 1));
    }

    function insertFields(file) {
        $('.fileupload-name').text(file.name);
        $('.uneditable-input >i').addClass('icon-file');

        var first = true;
        $('.filename').each(function () {
            $(this).text(file.name);
            if (first) {
                first = false;
                var size = helper.calcSize(file.size);
                $(this).text($(this).text() + ' (' + size + ')');
            }
        });
    }

    function clearFields() {
        $('.filename').each(function () {
            $(this).text('');
        });
        $('.main-connector').height(0);
        $('.uploading-container').each(
            function () {
                $(this).find('.upload-function').hide();
                var bar = $(this).find('.bar');
                $(this).find('.connector-pin').hide();
                var connector = $(this).find('.connector');
                connector.width(0);
                bar.width(0);
                bar.data('progress', 0);
                bar.text('0%');
            });
        $('#result .filename').text('');
        $('#result').hide();
        $('#file').val('');
        $('.uneditable-input >i').removeClass('icon-file');
        $('.fileupload-name').text('');
        $('.warnings-container').hide();
        $('.errors-container').hide();
    }

    return{
        stageID: stageID,
        calcSize: calcSize,
        toggleButtons: toggleButtons,
        stageElement: stageElement,
        insertFields: insertFields,
        clearFields: clearFields
    }
}();