$(document).ready(function () {
    $('span.fileupload-new').click(function () {
        $('#ZipFile').val("");
    })


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

        return size+''+mm;

    }

    function setFields(file) {
        var first = true;
        $('.filename').each(function () {
            $(this).text(file.name);
            if (first) {
                first = false;
                var size = calcSize(file.size);
                $(this).text($(this).text() + ' (' + size +')');
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

var upload = function () {

    var progressWidth = 230;
    var progressAnimTime = 500;
    var revealBoxTime = 500;
    var queue = new Array();
    var intervals = new Array();
    var resetting = false;

    function reset() {
        resetting = true;
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
                $(':animated').clearQueue();
                $(':animated').stop();
            });
        $('#result').hide();
        for (var i = 0; i < queue.length; i++) {
            queue.shift()();
        }
        queue = new Array();
        for (var i = 0; i < intervals.length; i++) {
            clearInterval(intervals[i]);
        }
        ;
        intervals = new Array();
        resetting = false;
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

    function animate(stage) {

        if (resetting) {
            return;
        }

        var connector_difference = 0;
        if (stage == 1)
            connector_difference = 56;
        else
            connector_difference = 110;

        connector_height = $('.main-connector').height();
        $('.main-connector').animate({height: connector_height + connector_difference + 'px'},
            { duration: revealBoxTime, complete: function () {
                var el = $($('#upload-container').children('.uploading-container').get(stage - 1));
                el.find('.connector-pin').show();
                if (el.length > 0) {
                    el.find('.connector').animate({width: '62px'}, {duration: 500, complete: function () {
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

    function animateIncrease(el, percent, dur) {

        if (resetting) {
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


        function animatePerc() {
            if (resetting) {
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
                for (var i = 0; i < intervals.length; i++) {
                    clearInterval(intervals[i]);
                }
            }
        };

        for (var i = 0; i < progressAnimTime / 300; i++) {
            var timeout = setInterval(animatePerc, 300 + (i * 300));
            intervals.push(timeout);
        }

    }

    function animatePercent(currentStage, percentage) {

        if (resetting) {
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

        if (resetting) {
            return;
        }

        var objStage = session.stage;
        var percentage = session[objStage];
        var currStageID = stageID(currentStage);
//        if (objStage == 'complete') {
//            currentStage = objStage;
//            animate(stageID(currentStage));
//            return;
//        }

//        if (currentStage != stageID(objStage)) {
//            animatePercent(stageID(currentStage), 100);
//            currentStage = stageID(currentStage) + 1;
        while (currStageID < stageID(objStage)) {
            animatePercent(currStageID, 100)
            currStageID += 1;
        }

//        if (objStage == 'complete') {
//            currentStage = objStage;
//            callback.push(function () {
//                animate(stageID(currentStage));
//            });
//            return;
//        }

        animatePercent(currStageID, percentage)
//            }

//        callback.push(function () {
//            animatePercent(stageID(currentStage), percentage)
//        });
//    }
//
//    else
//    {
//        animatePercent(stageID(currentStage), percentage);
//    }
    }

    function recursiveUpdates(session, currentStage) {
        if (resetting) {
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

            var checkQueue = function () {
                setTimeout(function () {
                    if (queue.length > 0) {
                        checkQueue();
                    } else {
                        recursiveUpdates(session, currentStage);
                    }
                }, 500)
            };
            checkQueue();

        });
    }

//    function uploadFile() {
//
//        if (resetting) {
//            return;
//        }
//
//        var session = {
//            stage: 'uploading',
//            uploading: '10'
//        };
//        return JSON.stringify(session);
//    }

    function start(file) {
        reset();
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
            url: 'http://localhost:9090/bii-ws/upload/progress?SessionID=' + sess,  //server script to process data
            type: 'GET',
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
            dataType: 'json'
        });

//        if (resetting) {
//            return;
//        }
//
//        var session = null;
//        if (mock == 1) {
//            session = {
//                stage: 'uploading',
//                uploading: '50'
//            }
//        }
//
//        if (mock == 2) {
//            session = {
//                stage: 'uploading',
//                uploading: '80'
//            }
//        }
//
//        if (mock == 3) {
//            session = {
//                stage: 'uploading',
//                uploading: '100'
//            }
//        }
//
//        if (mock == 4) {
//            session = {
//                stage: 'validating',
//                validating: '20'
//            }
//        }
//
//        if (mock == 5) {
//            session = {
//                stage: 'validating',
//                validating: '100'
//            }
//        }
//
//        if (mock == 6) {
//            session = {
//                stage: 'persisting',
//                persisting: '30'
//            }
//        }
//
//        if (mock == 7) {
//            session = {
//                stage: 'persisting',
//                persisting: '80'
//            }
//        }
//
//        if (mock == 8) {
//            session = {
//                stage: 'persisting',
//                persisting: '100'
//            }
//        }
//
//        if (mock == 9) {
//            session = {
//                stage: 'complete'
//            }
//        }
//        mock++;
//        return JSON.stringify(session);
    }

    function uploadFile(file, callback) {

        if (resetting) {
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
                url: 'http://localhost:9090/bii-ws/upload',  //server script to process data
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
