var progressHandler = function () {

    var queue = [];
    var timePerPx = 5;

    var isRunning=function(){
        return queue.length>0;
    }

    var clear=function(){
        queue = [];
        $(':animated').stop();
        $(':animated').clearQueue();
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

    function showStage(stage, animate) {
        //Ensure that stage is not visible
        var cnt = helper.stageElement(stage);
        var uplFun = cnt.find('.upload-function');

        if (uplFun.is(':visible')) {
            callback.call();
            return;
        }

        console.log('showStage');

        var connector_height = $('.main-connector').height();
        var connector_difference = 0;

        if (stage == 1)
            connector_difference = 56 - connector_height;
        else
            connector_difference = 110;

        var total_height = connector_height + connector_difference;

        if (animate==false) {
            $('.main-connector').height(total_height + 'px');
            var el = helper.stageElement(stage);
            if (el.length > 0) {
                el.find('.connector').width('62px');
                el.find('.upload-function').show();
            } else {
                $('#result').show();
            }
            callback.call();
            return
        }

        var animTime = connector_difference * timePerPx;

        $('.main-connector').animate({height: total_height + 'px'},
            { duration: animTime, complete: function () {
                var el = helper.stageElement(stage);
                el.find('.connector-pin').show();
                //Is it the result or not
                if (el.length > 0) {
                    el.find('.connector').animate({width: '62px'}, {duration: 62 * timePerPx, complete: function () {
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

        if (progress > 100)
            progress = 100;

        var pixelProgress = progress * $('.progress').width() / 100;
        var currWidth = el.width();
        var diff = pixelProgress - currWidth;
        var percDiff = diff * 100 / $('.progress').width();

        if (pixelProgress == el.width()) {
            callback.call();
            return;
        }

        if (animate==false) {
            el.width(pixelProgress+'px');
//            el.width(pixelProgress + 'px');
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
            }, {easing: 'linear', duration: percDiff * timePerPx, complete: function () {
                callback.call();
            }});

        //Numerical percentage increase
        var animatePerc = function (progress) {

            var pixelW = el.width();
            var percW = Math.floor((pixelW * 100) / $('.progress').width());
            el.text(percW + '%');
            el.data('progress', percW);

            if (percW == 100) {
                el.text('COMPLETE');
            } else if (progress > el.data('progress')) {
                setTimeout(function () {
                    animatePerc(progress)
                }, percDiff * timePerPx / 10);
            }
        };
        animatePerc(progress);
    }

    function progressStage(stage, progress, animate) {
        console.log('progressStage')
        var cnt = helper.stageElement(stage);
        var uplFun = cnt.find('.upload-function');
        var el = $(uplFun).find('.bar');

        if (!uplFun.is(':visible')) {
            callback.push(function () {
                showStage(stage, animate);
            });
        }
        callback.push(function () {
            showProgress(el, progress, animate);
        })
    }

    return{
        progressStage:progressStage,
        clear:clear,
        isRunning:isRunning
    }
}();