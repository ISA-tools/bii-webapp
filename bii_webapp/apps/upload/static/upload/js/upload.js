//QUEUE FUNCTIONS
// ALL ANIMATIONS PLUS REQUEST UPDATES

var upload = function () {

    var STATE = 'STOPPED';

    function reset(callback, param) {
        helper.toggleButtons('resetting');
        request.reset();
        vars.upload_session = '';
        if (STATE == 'STARTED')
            STATE = 'STOPPING'
        //Stop showing animations
        progressHandler.clear();
        var wait = function () {
            if (STATE == 'STOPPING')
                setTimeout(wait, 100);
            else {
                helper.clearFields();
                //Ensure that any animations left are cleared
                progressHandler.clear();
                if (callback)callback(param);
            }
        };
        wait();
    }

    function update(upload_session, animate) {
        var progress = 0;
        var stage = upload_session.UPLOAD.stage
        if (stage != 'complete')
            progress = upload_session.UPLOAD[stage].progress;

        var currStageID = helper.stageID(stage);

        for (var i = 1; i < currStageID; i++) {
            progressHandler.progressStage(i, 100, animate);
        }

        progressHandler.progressStage(currStageID, progress, animate)
    }

    function recursiveUpdates(upload_session) {

        update(upload_session);

        if (STATE == 'STOPPING') {
            STATE = 'STOPPED';
            return;
        }

        if (upload_session.UPLOAD.stage == 'complete') {
            helper.toggleButtons('select');
            STATE = 'STOPPED';
            return;
        }

        if (isIssuesExist(upload_session)) {
            helper.toggleButtons('select');
            $('#retry').show();
            STATE = 'STOPPED';
            return;
        }

        request.requestUpdate(function (upload_session) {

            function checkQueue() {
                if (!progressHandler.isRunning())
                    recursiveUpdates(upload_session);
                else
                    setTimeout(checkQueue, 100);
            }

            checkQueue();

        });
    }

    function start(file) {
        helper.insertFields(file);
        showToast('Initiating upload', -1);
        request.requestInit(function (data) {
            if (isIssuesExist(data)) {
                showToast(data.ERROR.messages);
                $('#retry').show();
                return;
            }
            hideToast();
            progressHandler.progressStage(1, 0);
            helper.toggleButtons('cancel');
            request.uploadFile(file, function (data) {
                if (STATE != 'STARTED')
                    return;
//                if (STATE == 'STARTED')STATE = 'STOPPING';
                helper.toggleButtons('select');
                if(isIssuesExist(data))
                    $('#retry').show();
            });
            STATE = 'STARTED';
            recursiveUpdates(data);
        })
    }

    function resume(upload_session) {
        var file = {};
        if (upload_session.UPLOAD.filesize == -1)
            return;
        file.name = upload_session.UPLOAD.filename;
        file.size = upload_session.UPLOAD.filesize;
        helper.insertFields(file);
        update(upload_session, false);
        if (isIssuesExist(upload_session)){
            return;
        }
        if (upload_session.UPLOAD.stage != 'complete') {
            STATE = 'STARTED';
            helper.toggleButtons('cancel');
            recursiveUpdates(upload_session);
        }
    }

    function isIssuesExist(data) {

        if (data.ERROR) {
            showToast(data.ERROR.messages);
            return true;
        }

        var cnt = helper.stageElement(helper.stageID(data.UPLOAD.stage));
        var errors_exist = false;
        var upload_sessionStage = data.UPLOAD[data.UPLOAD.stage]

        if (upload_sessionStage.ERROR) {
            var total = upload_sessionStage.ERROR.total
            var messages = upload_sessionStage.ERROR.messages
            var errors_cnt = cnt.find('.errors-container');
            var errors_title = errors_cnt.find('.issue_title');
            errors_title.text(total + ' error' + (total > 1 ? 's' : ''));
            var errors_box = errors_cnt.find('.issue_content');
            errors_box.text(messages);
            errors_box.trigger('contentChange');
            errors_cnt.show();
            errors_exist = true;
        }
        if (upload_sessionStage && upload_sessionStage.WARNING) {
            var warnings_cnt = cnt.find('.warnings-container');
            var warnings_title = warnings_cnt.find('.issue_title');
            var warnings_num = upload_sessionStage.WARNING.total;
            warnings_title.text(warnings_num + ' warning' + (warnings_num > 1 ? 's' : ''));
            var warnings_box = warnings_cnt.find('.issue_content');
            warnings_box.text(upload_sessionStage.WARNING.messages);
            warnings_box.trigger('contentChange');
            warnings_cnt.show();
        }

        return errors_exist;
    }

    function cancel() {
        if (STATE == 'STARTED')STATE = 'STOPPING';
        helper.toggleButtons('cancelling');
        callback = function (data) {
            if (data.INFO)
                showToast(data.INFO.messages);
            if (data.ERROR)
                showToast(data.ERROR.messages);
        }
        request.cancelFile(callback);
        vars.upload_session = '';
        reset();
    };

    var getState = function () {
        return STATE;
    }

    return {
        resume: resume,
        start: start,
        cancel: cancel,
        reset: reset,
        getState: getState
    };

}
    ();