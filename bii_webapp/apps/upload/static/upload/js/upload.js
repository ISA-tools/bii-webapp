var upload = function () {

    var progressWidth = 230;
    var progressAnimTime = 2000;
    var revealBoxTime = 1000;
    var callbackstack = new Array();
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
        for (var i = 0; i < callbackstack.length; i++) {
            if (typeof callbackstack[i] != 'string')
                callbackstack.shift()();
            else {
                callbackstack.shift();
            }
        }
        callbackstack = new Array();
        for (var i = 0; i < intervals.length; i++) {
            clearInterval(intervals[i]);
        }
        ;
        intervals = new Array();
        resetting = false;
    }

    var callback = function () {

        function unshiftAnim() {
            callbackstack.unshift('anim');
        }

        function push(func) {
            if (callbackstack.length == 0)
                func();
            else
                callbackstack.push(func);
        }

        function call() {
            if (callbackstack.length > 0)
                callbackstack.shift()();
        }

        function removeCall() {
            callbackstack.shift();
            call();
        }

        return{
            push: push,
            unshiftAnim: unshiftAnim,
            call: call,
            removeCall: removeCall
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
        callback.unshiftAnim();
        $('.main-connector').animate({height: connector_height + connector_difference + 'px'},
            { duration: revealBoxTime, complete: function () {
                var el = $($('#upload-container').children('.uploading-container').get(stage - 1));
                el.find('.connector-pin').show();
                if (el.length>0) {
                    el.find('.connector').animate({width: '62px'}, {duration: 1000, complete: function () {
                        el.find('.upload-function').show();
                        callback.removeCall();
                    }});
                }
                else {
                    $('#result').show();
                    callback.removeCall();
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
        if (stage == 'finished') {
            return 4;
        }
    }

    function animateIncrease(el, percent, dur) {

        if (resetting) {
            return;
        }

        if (percent == el.data('progress')) {
            callback.call();
            return;
        }

        callback.unshiftAnim();
        el.animate(
            {width: percent + '%'
            }, {easing: 'linear', duration: progressAnimTime, complete: function () {
                callback.removeCall();
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

    function animatePercent(stage, percent) {

        if (resetting) {
            return;
        }
        var cnt=$($('#upload-container').children('.uploading-container').get(stage - 1));
        var uplFun = cnt.find('.upload-function');
        var el = $(uplFun).find('.bar');
        var diff = percent - el.data('progress');
        var durPerPerc = progressAnimTime / diff;
        if (!uplFun.is(':visible')) {
            animate(stage);
            callbackstack.push(function () {
                animateIncrease(el, percent, durPerPerc)
            });
        }
        else
            animateIncrease(el,percent, durPerPerc);
    }

    function updateState(session, stage) {

        if (resetting) {
            return;
        }

        var percent = session.percent;
        var objStage = session.stage;

        if (objStage == 'finished') {
            stage = objStage;
            animate(stageID(stage));
            return;
        }

        if (stage != objStage) {
            animatePercent(stageID(stage), 100);
            stage = objStage;
            callback.push(function () {
                animatePercent(stageID(stage), percent)
            });
        } else {
            animatePercent(stageID(stage), percent);
        }
    }

    var mock = 1;

    function requestUpdate() {

        if (resetting) {
            return;
        }

        var session = null;
        if (mock == 1) {
            session = {
                stage: 'uploading',
                percent: '50'
            }
        }

        if (mock == 2) {
            session = {
                stage: 'uploading',
                percent: '80'
            }
        }

        if (mock == 3) {
            session = {
                stage: 'uploading',
                percent: '100'
            }
        }

        if (mock == 4) {
            session = {
                stage: 'validating',
                percent: '20'
            }
        }

        if (mock == 5) {
            session = {
                stage: 'validating',
                percent: '100'
            }
        }

        if (mock == 6) {
            session = {
                stage: 'persisting',
                percent: '30'
            }
        }

        if (mock == 7) {
            session = {
                stage: 'persisting',
                percent: '80'
            }
        }

        if (mock == 8) {
            session = {
                stage: 'persisting',
                percent: '100'
            }
        }

        if (mock == 9) {
            session = {
                stage: 'finished',
                percent: '0'
            }
        }
        mock++;
        return JSON.stringify(session);
    }

    function recursiveUpdates(session, stage) {
        if (resetting) {
            return;
        }
        var session = $.parseJSON(requestUpdate());
        updateState(session, stage);
        if (session.stage == 'finished')
            return;
        callback.push(function () {
            recursiveUpdates(session, stage)
        })
    }

    function uploadFile(file) {

        if (resetting) {
            return;
        }

        var session = {
            stage: 'uploading',
            percent: '10'
        };
        return JSON.stringify(session);
    }

    function start(file) {
        reset();
        var session = uploadFile(file);
        var stage = 'uploading';
        recursiveUpdates(session, stage)
//        animate(stageID(stage));
//        setInterval(function(){recursiveUpdates(session, stage)},1000);
    }

    return {
        start: start
    };

}

    ();

