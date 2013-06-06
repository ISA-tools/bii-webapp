//QUEUE FUNCTIONS
// ALL ANIMATIONS PLUS REQUEST UPDATES

var upload = function () {

    var STOP = false;
    var STARTED = false;
    var currentStage = '';

    function setFields(file) {
        var first = true;
        $('.fileupload-name').text(file.name);
        $('.uneditable-input >i').addClass('icon-file');
        $('.filename').each(function () {
            $(this).text(file.name);
            if (first) {
                first = false;
                var size = calcSize(file.size);
                $(this).text($(this).text() + ' (' + size + ')');
            }
        });
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

    function reset(callback, param) {
        STOP = true;
        $('#cancel').hide();
        $('#select_file').show();
        progressHandler.clear();
        var stop = function () {
            clearFields();
            if (STARTED)
                setTimeout(stop, 100);
            else {
                if (callback)callback(param);
            }
        };
        stop();
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

    function update(upload_session, animate) {

        currentStage = upload_session.stage;
        var progress = 0;
        if (currentStage != 'complete')
            progress = upload_session[upload_session.stage].progress;

        var currStageID = stageID(currentStage);

        for (var i = 1; i < currStageID; i++) {
            progressHandler.progressStage(i, 100, animate);
        }

        progressHandler.progressStage(currStageID, progress, animate)
    }

    function stageElement(id) {
        return $($('#upload-container').children('.uploading-container').get(id - 1));
    }

    function recursiveUpdates() {

        request.requestUpdate(function (upload_session) {
            if (isIssuesExist(upload_session))
                return;

            if (upload_session.stage == 'complete') {
                setTimeout(function () {
                }, 500);
                STOP = true;
            }

            update(upload_session);

            function checkQueue() {
                if (STOP) {
                    STARTED = false;
                    return;
                }

                if (!progressHandler.isRunning())
                    recursiveUpdates();
                else
                    setTimeout(checkQueue, 100);
            }

            checkQueue();

        });
    }

    function start(file) {
        STOP = false;
        STARTED = true;
        $('#select_file').hide();
        $('#cancel').css({'display': 'inline-block'});
        setFields(file);
        currentStage = 'uploading'
        progressHandler.progressStage(1, 0);
        request.uploadFile(file, function (upload_session) {
            if (isIssuesExist(upload_session))return;
            recursiveUpdates();
        });
    }

    function resume(upload_session) {
        var file = {};
        file.name = upload_session.filename;
        file.size = upload_session.filesize;
        setFields(file);
        update(upload_session, false);
        if (isIssuesExist(upload_session))
            return;
        if (upload_session.stage != 'complete') {
            $('#select_file').hide();
            $('#cancel').css({'display': 'inline-block'});
            STARTED = true;
            recursiveUpdates();
        } else {
            $('#cancel').hide();
        }
    }

    function isIssuesExist(upload_session) {
        var cnt = stageElement(stageID(currentStage));
        var errors_exist = false;
        var upload_sessionStage = upload_session[upload_session.stage]

        if (upload_session.errors || (upload_sessionStage && upload_sessionStage.errors)) {
            if (upload_session.errors) {
                total = upload_session.errors.total
                messages = upload_session.errors.messages
            } else {
                total = upload_sessionStage.errors.total
                messages = upload_sessionStage.errors.messages
            }

            var errors_cnt = cnt.find('.errors-container');
            var errors_title = errors_cnt.find('.issue_title');
            errors_title.text(total + ' error' + (total > 1 ? 's' : ''));
            var errors_box = errors_cnt.find('.issue_content');
            errors_box.text(messages);
            errors_box.trigger('contentChange');
            errors_cnt.show();
            errors_exist = true;
        }
        if (upload_sessionStage && upload_sessionStage.warnings) {
            var warnings_cnt = cnt.find('.warnings-container');
            var warnings_title = warnings_cnt.find('.issue_title');
            var warnings_num = upload_sessionStage.warnings.total;
            warnings_title.text(warnings_num + ' warning' + (warnings_num > 1 ? 's' : ''));
            var warnings_box = warnings_cnt.find('.issue_content');
            warnings_box.text(upload_sessionStage.warnings.messages);
            warnings_box.trigger('contentChange');
            warnings_cnt.show();
        }

        return errors_exist;
    }

    function cancel() {
        $('#cancel').off('click');
        $('#cancel').css('opacity', 0.5);
        var callback = function () {

        }
        stop(function(){
            request.cancelFile(reset(function(){
                $('#cancel').hide();
                $('#cancel').css('opacity', 1);
                $('#cancel').on('click');
                $('#cancel').text('Cancel');
                $('#select_file').show();
            }));
        });

    }

    var isStarted = function(){
        return STARTED;
    }

    return {
        resume: resume,
        start: start,
        cancel: cancel,
        clearFields: clearFields,
        setFields: setFields,
        reset: reset,
        stageElement:stageElement,
        isStarted:isStarted
    };

}

    ();
