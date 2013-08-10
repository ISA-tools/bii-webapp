//QUEUE FUNCTIONS
// ALL ANIMATIONS PLUS REQUEST UPDATES

var upload = function () {

    var STATE = 'STOPPED';
    var retry = true;
    var uploadID = ''

    function reset(callback, param) {
        helper.toggleButtons('resetting');
        uploadID = ''
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

    function pollProgress(upload_session) {

        if (upload_session.ERROR || upload_session == undefined) {
            STATE = 'STOPPED';
            return;
        }

        vars.upload_session=upload_session;
        update(upload_session);

        if (isIssuesExist(upload_session)) {
            helper.toggleButtons('select');
            if (retry)$('#retry').show();
            STATE = 'STOPPED';
            return;
        }

        if (STATE == 'STOPPING' || upload_session.UPLOAD.stage == 'complete') {
            STATE = 'STOPPED';
            helper.toggleButtons('select');
            return;
        }

        setTimeout(function () {
            request.requestUpdate(uploadID, function (upload_session) {

                function checkQueue() {
                    if (!progressHandler.isRunning())
                        pollProgress(upload_session);
                    else if (STATE == 'STARTED')
                        setTimeout(checkQueue, 500);
                }

                checkQueue();

            })
        }, 2000);
    }

    function start(file) {
        upload.reset();
        helper.insertFields(file);
        var initToast = $().toastmessage('showToast', {
            text: 'Initiating upload',
            sticky: true,
            type: 'notice'
        });
        request.requestInit(file, function (data) {
            if (isIssuesExist(data)) {
                $().toastmessage('removeToast', initToast);
                if (retry)$('#retry').show();
                return;
            }
            $().toastmessage('removeToast', initToast);
            uploadID = data.INFO.uploadID
            progressHandler.progressStage(1, 0);
            helper.toggleButtons('cancel');
            request.uploadFile(uploadID, file, function (data) {
                if (data.UPLOAD){
                    update(data, true);
                }
                helper.toggleButtons('select');
                if (isIssuesExist(data))
                    if (retry)$('#retry').show();

                if (data.UPLOAD.type == 'investigation')
                    $('#result > a').attr('href', vars.urls.getInvestigation + '/' + data.UPLOAD.ID);
                else
                    $('#result > a').attr('href', vars.urls.getStudy + '/' + data.UPLOAD.ID);
                STATE = 'STOPPED';
            });
            STATE = 'STARTED';
            retry = true;
            pollProgress(data);
        })
    }

    function isIssuesExist(data) {
        if (data.ERROR) {
            $().toastmessage('showErrorToast', data.ERROR.messages);
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
                $().toastmessage('showNoticeToast', data.INFO.messages);
            if (data.ERROR)
                $().toastmessage('showErrorToast', data.ERROR.messages);
        }
        request.cancelFile(uploadID, callback);
        vars.upload_session = '';
        reset();
    };

    function getState() {
        return STATE;
    }

    function loadSample() {
        upload.reset();
        var initToast = $().toastmessage('showToast', {
            text: 'Initiating upload',
            sticky: true,
            type: 'notice'
        });

        var callback = function (data) {
            if (isIssuesExist(data)) {
                $().toastmessage('removeToast', initToast);
                return;
            }
            var file = {
                name: data.UPLOAD.filename,
                size: data.UPLOAD.filesize
            }
            helper.insertFields(file);
            $().toastmessage('removeToast', initToast);
            uploadID = data.INFO.uploadID
            progressHandler.progressStage(1, 0);
            helper.toggleButtons('cancel');

            request.uploadSample(uploadID, file, function (data) {
                if (data.UPLOAD)
                    update(data, true);
                helper.toggleButtons('select');
                if (!isIssuesExist(data))
                    if (data.UPLOAD.type == 'investigation')
                        $('#result > a').attr('href', vars.urls.getInvestigation + '/' + data.UPLOAD.ID);
                    else
                        $('#result > a').attr('href', vars.urls.getStudy + '/' + data.UPLOAD.ID);
                STATE = 'STOPPED';
            });

            STATE = 'STARTED';
            retry = false;
            pollProgress(data);
        }
        request.initSample('BII-I-1.zip', callback);

    }

    return {
        start: start,
        cancel: cancel,
        reset: reset,
        getState: getState,
        update: update,
        loadSample: loadSample,
        isIssuesExist: isIssuesExist
    };

}
    ();