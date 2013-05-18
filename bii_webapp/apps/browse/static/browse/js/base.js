/**
 * Sets the current main content in the middle
 */
$(document).ready(function () {
    var size = $('#main-content').width();
    var parentSize = $('#main-container').width();
    $('#main-content').css("margin-left", (parentSize-size)/2 + 'px');

    var rightWidth = $('#user_profile').width();
    if(!rightWidth)
        rightWidth=$('#login').width();
    //logo width plus profile width
    var widthLeft=1144-(rightWidth+74)
    $('#searchbar').width(widthLeft);
});