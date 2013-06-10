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
                setTimeout(stop, 100);
            else {
                helper.clearFields();
                //Ensure that any animations left are cleared
                progressHandler.clear();
                stop()
                if (callback)callback(param);
            }
        };
        wait();
    }

    function update(upload_session, animate) {
        var progress = 0;
        if (upload_session.stage != 'complete')
            progress = upload_session[upload_session.stage].progress;

        var currStageID = helper.stageID(upload_session.stage);

        for (var i = 1; i < currStageID; i++) {
            progressHandler.progressStage(i, 100, animate);
        }

        progressHandler.progressStage(currStageID, progress, animate)
    }

    function recursiveUpdates() {

        request.requestUpdate(function (upload_session) {

            if (upload_session.stage == undefined) {
                return setTimeout(recursiveUpdates, 1000);
            }

            if (isIssuesExist(upload_session)) {
                STATE = 'STOPPED'
                helper.toggleButtons('select');
                return;
            }

            update(upload_session);

            if (upload_session.stage == 'complete') {
                setTimeout(function () {
                }, 500);
                helper.toggleButtons('select');
                STATE = 'STOPPING';
            }

            function checkQueue() {
                if (STATE == 'STOPPING') {
                    STATE = 'STOPPED';
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
        reset(function (file) {
            STATE = 'STARTED';
            helper.insertFields(file);
            helper.toggleButtons('cancel');
            progressHandler.progressStage(1, 0);
            request.uploadFile(file);
            recursiveUpdates();
        }, file)
    }

    function resume(upload_session) {
        var file = {};
        file.name = upload_session.filename;
        file.size = upload_session.filesize;
        helper.insertFields(file);
        update(upload_session, false);
        if (isIssuesExist(upload_session))
            return;
        if (upload_session.stage != 'complete') {
            STATE = 'STARTED';
            helper.toggleButtons('cancel');
            recursiveUpdates();
        }
    }

    function isIssuesExist(upload_session) {
        var cnt = helper.stageElement(helper.stageID(upload_session.stage));
        var errors_exist = false;
        var upload_sessionStage = upload_session[upload_session.stage]

        if (upload_session.errors) {
            var total = upload_sessionStage.errors.total
            var messages = upload_sessionStage.errors.messages
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
        STATE = 'STOPPING'
        helper.toggleButtons('cancelling');
        callback = function (data) {
            vars.upload_session = '';
            reset(function (data) {
                if (data.cancel)
                    showToast(data.cancel.messages);
            }, data);
        }
        request.cancelFile(callback);
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