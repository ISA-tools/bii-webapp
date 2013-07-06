var selectDefaultStudy = function (element) {
    var el = $(element);
    var aEl = $(el.parent('a')[0]);
    var liEl = $(aEl.parent('li')[0]);
    var ulEl = $(liEl.parent('ul')[0]);

    if (liEl.hasClass('active')) {
        var firstLi='';
        var children=ulEl.children('li');
        for(var i=0;i<children.length;i++){
            var child=$(children[i]);
            if(!liEl.is(child) && !child.hasClass('add_item')){
                firstLi=child;
                break;
            }
        }

        if(firstLi=='')
            return;
        var firstA = $(firstLi.children('a')[0]);
        firstLi.addClass('active');
        $(firstA.attr('href')).addClass('active');
    }
}

$(document).ready(function(){
    $.modal.defaults = {
        showClose: false,
        escapeClose: true,
        clickClose: true
    }
    $("form").submit(function() { return false; });

    $(window).resize(function() {
        var modals=$('.modal');
        for(var i=0;i<modals.length;i++){
            var modal=$(modals[i]);
            var currStyle=modal.attr('style');

            if($(window).width()<parseInt(modal.css('max-width'))){
                var winWidth=$(window).width()-26;
                currStyle=currStyle.replace(/width[^;]+;?/g, '');
                currStyle+='width:'+winWidth+'px!important;';
                currStyle=currStyle.replace(/margin-left[^;]+;?/g, '');
                currStyle+='margin-left:-'+$(window).width()/2+'px!important;';
                modal.attr('style',currStyle);
            }else{
                currStyle=currStyle.replace(/width[^;]+;?/g, '');
                currStyle=currStyle.replace(/margin-left[^;]+;?/g, '');
                modal.attr('style',currStyle);
            }

            if($(window).height()<parseInt(modal.css('max-height'))){
                var winHeight=$(window).height()-26;
                currStyle=currStyle.replace(/height[^;]+;?/g, '');
                currStyle+='height:'+winHeight+'px!important;';
                currStyle=currStyle.replace(/margin-top[^;]+;?/g, '');
                currStyle+='margin-top:-'+$(window).height()/2+'px!important;';
                modal.attr('style',currStyle);
            }else{
                currStyle=currStyle.replace(/height[^;]+;?/g, '');
                currStyle=currStyle.replace(/margin-top[^;]+;?/g, '');
                modal.attr('style',currStyle);
            }

        }
    });
    $(window).trigger('resize');

})

