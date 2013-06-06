//QUEUE FUNCTIONS
// ALL ANIMATIONS PLUS REQUEST UPDATES

var upload = function () {

    var progressAnimTime = 500;
    var animPerPX = 5;
    var queue = [];
    var timeouts = [];
    var IMMEDIATE_STOP = false;
    var currentStage = ''

    function setFields(file) {
        var first = true;
        $('.fileupload-preview').text(file.name);
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
                $(':animated').clearQueue();
                $(':animated').stop();
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
        $('#ZipFile').val();
        $('.warnings-container').hide();
        $('.errors-container').hide();
    }

    function reset() {
        console.log('reset');
        IMMEDIATE_STOP = true;
        clearFields();
//        for (var i = 0; i < queue.length; i++) {
//            queue.shift()();
//        }
        queue = [];
        for (var i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }
        ;
        timeouts = [];
    }

    //Each function calls the call method when done
    //to remove theirself off of the queue and call the
    //next function
    var callback = function () {

        function push(func) {
            //No function in the queue add current and call it
            if (queue.length == 0) {
                queue.push(func);
                func();
            }
            else
                queue.push(func);
        }

        function call() {
            //remove previous function
            queue.shift();
            if (queue.length > 0) {
                //call current
                queue[0]();
            }
        }

        return{
            push: push,
            call: call
        }
    }();

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

    function showStage(stage, animate) {
        console.log('showStage');

        var connector_height = $('.main-connector').height();
        var connector_difference = 0;

        if (stage == 1)
            connector_difference = 56 - connector_height;
        else
            connector_difference = 110;

        var total_height = connector_height + connector_difference;

        if (!animate) {
            $('.main-connector').height(total_height + 'px');
            var el = stageElement(stage);
            if (el.length > 0) {
                el.find('.connector').width('62px');
                el.find('.upload-function').show();
            } else {
                $('#result').show();
            }
            callback.call();
            return
        }

        var animTime = connector_difference * animPerPX;

        $('.main-connector').animate({height: total_height + 'px'},
            { duration: animTime, complete: function () {
                var el = stageElement(stage);
                el.find('.connector-pin').show();
                //Is it the result or not
                if (el.length > 0) {
                    el.find('.connector').animate({width: '62px'}, {duration: 62 * animPerPX, complete: function () {
                        el.find('.upload-function').show();
                        callback.call();
                    }});
                }
                else {
                    $('#result').show();
                    callback.call();
                    return;
                }
            }
            });
    }

    function showProgress(el, progress, animate) {

        if (el.attr('id') == 'result') {
            return;
        }

        if (progress == el.data('progress')) {
            callback.call();
            return;
        }

        var pixelProgress = Math.floor((progress * $('.progress').width()) / 100);
        var pixelW = el.width();
        var percW = Math.floor((pixelW * 100) / $('.progress').width());

        if (!animate) {
            el.width(pixelProgress + 'px');
            el.text(progress + '%');
            if (progress == 100) {
                el.text('COMPLETE');
            }
            callback.call();
            return;
        }

        //Bar increase
        el.animate(
            {width: pixelProgress + 'px'
            }, {easing: 'linear', duration: progressAnimTime, complete: function () {
                callback.call();
            }});

        //Numerical percentage increase
        var animatePerc = function (progress) {
            el.text(percW + '%');
            el.data('progress', percW);

            if (percW == 100) {
                el.text('COMPLETE');
            } else if (progress > el.data('progress')) {
                timeouts[1] = setTimeout(function () {
                    animatePerc(progress)
                }, progressAnimTime / 10);
            }
        };
        animatePerc(progress);
    }

    function progressStage(stage, progress, animate) {
        console.log('progressStage')
        var cnt = stageElement(stage);
        var uplFun = cnt.find('.upload-function');
        var el = $(uplFun).find('.bar');
//        var diff = progress - el.data('progress');
//        var durPerPerc = progressAnimTime / diff;

        if (!uplFun.is(':visible')) {
            callback.push(function () {
                showStage(stage, animate);
            });
        }
        callback.push(function () {
            showProgress(el, progress, animate);
        })
    }

    function update(upload_session, animate) {

        currentStage = upload_session.stage;
        var progress = 0;
        if (currentStage != 'complete')
            progress = upload_session[upload_session.stage].progress;

        var currStageID = stageID(currentStage);

        for (var i = 1; i < currStageID; i++) {
            progressStage(i, 100, animate);
        }

        progressStage(currStageID, progress, animate)
    }

    function stageElement(id) {
        return $($('#upload-container').children('.uploading-container').get(id - 1));
    }

    function recursiveUpdates() {

//        if (IMMEDIATE_STOP)
//            return;

        request.requestUpdate(function (upload_session) {
            if (isIssuesExist(upload_session))
                return;

            if (upload_session.stage == 'complete') {
                setTimeout(function () {
                    $('.input-append .fileupload-exists').hide();
                    $('.input-append .fileupload-new').css({'display': 'inline-block'});
                }, 500);
                IMMEDIATE_STOP = true;
            }

            update(upload_session);

            function checkQueue() {
                if (IMMEDIATE_STOP)
                    return;

                if (queue.length == 0)
                    recursiveUpdates();
                else
                    timeouts[2] = setTimeout(checkQueue, 100);
            }

            checkQueue();

        });
    }

    function start(file) {
        reset();
        setFields(file);
        currentStage = 'uploading'
        IMMEDIATE_STOP = false;
        progressStage(1, 0);
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
        recursiveUpdates();
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

    function cancelFile() {

    }

    function cancel() {
        reset();
        cancelFile();
    }

    return {
        resume: resume,
        start: start,
        cancel: cancel,
        clearFields: clearFields,
        setFields: setFields
    };

}

    ();
