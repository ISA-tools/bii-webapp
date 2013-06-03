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


//QUEUE FUNCTIONS
// ALL ANIMATIONS PLUS REQUEST UPDATES

var upload;
upload = function () {

    var progressWidth = 230;
    var progressAnimTime = 500;
    var animPerPX = 5;
    var queue = [];
    var timeouts = [];
    var stopped = false;

    function reset() {
        stopped = true;
        mock = 1;
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
                $(':animated').clearQueue().stop();
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
        stopped = false;
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

    function animate(stage, noCallback) {

        if (stopped) {
            return;
        }

        var connector_height = $('.main-connector').height();

        var connector_difference = 0;
        if (stage == 1)
            connector_difference = 56-connector_height;
        else
            connector_difference = 110;

        var animTime=connector_difference*animPerPX;

        var total_height = connector_height + connector_difference;
        $('.main-connector').animate({height: total_height + 'px'},
            { duration: animTime, complete: function () {
                var el = $($('#upload-container').children('.uploading-container').get(stage - 1));
                el.find('.connector-pin').show();
                if (el.length > 0) {
                    el.find('.connector').animate({width: '62px'}, {duration: 62*animPerPX, complete: function () {
                        el.find('.upload-function').show();
                        if (!noCallback)callback.call();
                    }});
                }
                else {
                    $('#result').show();
                    if (!noCallback)callback.call();
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

    function animateIncrease(el, percent, dur) {

        if (stopped) {
            return;
        }

        if (el.attr('id') == 'result') {
            return;
        }

        if (percent == el.data('progress')) {
            callback.call();
            return;
        }

//        callback.unshiftAnim();
        el.animate(
            {width: percent + '%'
            }, {easing: 'linear', duration: progressAnimTime, complete: function () {
                callback.call();
            }});


        var animatePerc = function () {
            if (stopped) {
                return;
            }

            var pixelW = el.width();
            var percW = Math.round(pixelW * 100 / progressWidth);
            if (percW > 100)
                percW = 100;
            el.data('progress', percW);
            el.text(percW + '%');
            if (percW == 100) {
                el.text('COMPLETE');
            } else {
                timeouts[1] = setTimeout(animatePerc, 50);
            }
        };

        animatePerc();

    }

    function animatePercent(currentStage, percentage) {

        if (stopped) {
            return;
        }
        var cnt = $($('#upload-container').children('.uploading-container').get(currentStage - 1));
        var uplFun = cnt.find('.upload-function');
        var el = $(uplFun).find('.bar');
        var diff = percentage - el.data('progress');
        var durPerPerc = progressAnimTime / diff;
        if (!uplFun.is(':visible')) {
            callback.push(function () {
                animate(currentStage);
            });
            callback.push(function () {
                animateIncrease(el, percentage, durPerPerc)
            });
        }
        else
            callback.push(function () {
                animateIncrease(el, percentage, durPerPerc);
            })
    }

    function updateState(session, currentStage) {

        if (stopped) {
            return;
        }

        var objStage = session.stage;
        var percentage = session[objStage];
        var currStageID = stageID(currentStage);
        while (currStageID < stageID(objStage)) {
            animatePercent(currStageID, 100)
            currStageID += 1;
        }
        animatePercent(currStageID, percentage)
    }

    function recursiveUpdates(session, currentStage) {
        if (stopped) {
            return;
        }
        requestUpdate(function (session) {
            updateState(session, currentStage);
            if (session.stage == 'complete') {
                setTimeout(function () {
                    $('.input-append .fileupload-exists').hide();
                    $('.input-append .fileupload-new').css({'display': 'inline-block'});
                }, 500);
                return;
            }

            function checkQueue() {
                if (stopped)
                    return;
                if (queue.length == 0)
                    recursiveUpdates(session, currentStage);
                else
                    timeouts[2] = setTimeout(checkQueue, 100);
            }

            checkQueue();

        });
    }

    function start(file) {
        reset();
        animate(1, true);
        uploadFile(file, function (session) {
            if (session.error) {
                alert(session.error)
                return;
            }

            var currentStage = 'uploading';
            recursiveUpdates(session, currentStage)
        });
    }

    function cancelFile() {

    }

    function cancel() {
        reset();
        cancelFile();
    }


    var mock = 1;

    function requestUpdate(callback) {
        var sess = document.cookie.replace("csrftoken=", "");
        $.ajax({
            url: $('#WS_SERVER').text() + 'upload/progress?SessionID=' + sess,  //server script to process data
            type: 'GET',
            //Ajax events
            success: completeHandler = function (data) {
                callback(data);
            },
            error: errorHandler = function () {
                return JSON.stringify({error: 'Uploading failed'});
            },
            dataType: 'json'
        });
    }

    function uploadFile(file, callback) {

        if (stopped) {
            return;
        }

        name = file.name;
        size = file.size;
        type = file.type;

        if (file.name.length < 1) {

        }
        else if (file.size > 100000) {
            alert("File is to big");
        }
        else if (file.type != '') {
            alert("File doesnt match zip");
        }
        else {
            var formData = new FormData();
            formData.append('SessionID', document.cookie.replace("csrftoken=", ""));
            formData.append('ZipFile', file);

            $.ajax({
                url: $('#WS_SERVER').text() + 'upload',  //server script to process data
                type: 'POST',
//                    xhr: function () {  // custom xhr
//                        myXhr = $.ajaxSettings.xhr();
//                        if (myXhr.upload) { // if upload property exists
//                            myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // progressbar
//                        }
//                        return myXhr;
//                    },
                //Ajax events
                success: completeHandler = function (data) {
                    callback(data);
                },
                error: errorHandler = function () {
                    return JSON.stringify({error: 'Uploading failed'});
                },
                // Form data
                data: formData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false
            });
        }
    }

    return {
        start: start,
        cancel: cancel
    };

}
    ();
