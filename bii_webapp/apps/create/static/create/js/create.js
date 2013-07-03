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
    $("form").submit(function() { return false; });
})

