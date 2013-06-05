//QUEUE FUNCTIONS
// ALL ANIMATIONS PLUS REQUEST UPDATES

var upload = function () {

    var progressAnimTime = 500;
    var animPerPX = 5;
    var queue = [];
    var timeouts = [];
    var IMMEDIATE_STOP = false;
    var currentStage='uploading'

    function reset() {
        console.log('reset');
        IMMEDIATE_STOP = true;
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
                $(':animated').clearQueue();
                $(':animated').stop();
            });
        $('#result').hide();
        for (var i = 0; i < queue.length; i++) {
            queue.shift()();
        }
        queue = new Array();
        for (var i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }
        ;
        timeouts = new Array();
        $('.warnings-container').hide();
        $('.errors-container').hide();
        IMMEDIATE_STOP = false;
        currentStage='uploading'
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

    function showStage(stage) {
        console.log('showStage');
        if (IMMEDIATE_STOP) {
            return;
        }

        var connector_height = $('.main-connector').height();

        var connector_difference = 0;
        if (stage == 1)
            connector_difference = 56 - connector_height;
        else
            connector_difference = 110;

        var animTime = connector_difference * animPerPX;

        var total_height = connector_height + connector_difference;
        $('.main-connector').animate({height: total_height + 'px'},
            { duration: animTime, complete: function () {
                var el = stageElement(stage);
                el.find('.connector-pin').show();
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

    function showProgress(el, progress, dur) {
        console.log('showProgress')
        if (el.attr('id') == 'result') {
            return;
        }

        if (progress == el.data('progress')) {
            callback.call();
            return;
        }


        var pixelProgress = Math.floor((progress * $('.progress').width())/100 );

        el.animate(
            {width: pixelProgress + 'px'
            }, {easing: 'linear', duration: progressAnimTime, complete: function () {
                callback.call();
            }});


        var animatePerc = function (progress) {
            var pixelW = el.width();
            var percW = Math.floor((pixelW * 100)/ $('.progress').width());
            el.text(percW + '%');
            el.data('progress', percW);
            if (percW == 100) {
                el.text('COMPLETE');
            } else if(progress > el.data('progress')){
                timeouts[1] = setTimeout(function(){animatePerc(progress)}, progressAnimTime/10);
            }
        };
        animatePerc(progress);

    }

    function progressStage(stage, progress) {
        console.log('progressStage')
        var cnt = stageElement(stage);
        var uplFun = cnt.find('.upload-function');
        var el = $(uplFun).find('.bar');
        var diff = progress - el.data('progress');
        var durPerPerc = progressAnimTime / diff;
        if (!uplFun.is(':visible')) {
            callback.push(function () {
                showStage(stage);
            });
        }
        callback.push(function () {
            showProgress(el, progress, durPerPerc);
        })
    }

    function update(session) {
        console.log('recursiveUpdates')
        currentStage = session.stage;
        var progress=0;
        if (currentStage != 'complete')
            progress = session[session.stage].progress;

        var currStageID = stageID(currentStage);

        for (var i = 1; i < currStageID; i++) {
            progressStage(i, 100);
        }

        progressStage(currStageID, progress)
    }

    function stageElement(id) {
        return $($('#upload-container').children('.uploading-container').get(id - 1));
    }

    function recursiveUpdates(session) {
        console.log('progressStage')
        request.requestUpdate(function (session) {

            if(isIssuesExist(session))
                return;
            update(session);

            if (session.stage == 'complete') {
                setTimeout(function () {
                    $('.input-append .fileupload-exists').hide();
                    $('.input-append .fileupload-new').css({'display': 'inline-block'});
                }, 500);
                return;
            }

            function checkQueue() {
                if (IMMEDIATE_STOP)
                    return;

                if (queue.length == 0)
                    recursiveUpdates(session);
                else
                    timeouts[2] = setTimeout(checkQueue, 100);
            }

            checkQueue();

        });
    }

    function start(file) {
        reset();
        progressStage(1, 0);
        request.uploadFile(file, function (session) {
            isIssuesExist(session);
            recursiveUpdates(session)
        });
    }

    function isIssuesExist(session) {
        var cnt = stageElement(stageID(currentStage));
        var errors_exist=false;
        var sessionStage=session[session.stage]

        if (session.errors || (sessionStage && sessionStage.errors)) {
            if(session.errors){
                total=session.errors.total
                messages=session.errors.messages
            }else{
                total=sessionStage.errors.total
                messages=sessionStage.errors.messages
            }

            var errors_cnt = cnt.find('.errors-container');
            var errors_title = errors_cnt.find('.issue_title');
            errors_title.text(total + ' error' + (total > 1 ? 's' : ''));
            var errors_box = errors_cnt.find('.issue_content');
            errors_box.text(messages);
            errors_box.trigger('contentChange');
            errors_cnt.show();
            errors_exist=true;
        }
        if (sessionStage && sessionStage.warnings) {
            var warnings_cnt = cnt.find('.warnings-container');
            var warnings_title = warnings_cnt.find('.issue_title');
            var warnings_num = sessionStage.warnings.total;
            warnings_title.text(warnings_num + ' warning' + (warnings_num > 1 ? 's' : ''));
            var warnings_box = warnings_cnt.find('.issue_content');
            warnings_box.text(sessionStage.warnings.messages);
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
        start: start,
        cancel: cancel
    };

}
    ();
