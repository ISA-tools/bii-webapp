var selectDefaultStudy = function (element) {
    var el = $(element);
    var aEl = $(el.parent('a')[0]);
    var liEl = $(aEl.parent('li')[0]);
    var ulEl = $(liEl.parent('ul')[0]);

    if (liEl.hasClass('active')) {
        var firstLi = $(ulEl.children('li')[0]);
        var firstA = $(firstLi.children('a')[0]);
        firstA.click();
        firstLi.addClass('active');
    }
}

$(document).ready(function(){
    $("form").submit(function() { return false; });
})