/**
 * Sets the current main content in the middle
 */
$(document).ready(function () {
    var size = $('#main-content').width();
    var parentSize = $('#main-container').width();
    $('#main-content').css("margin-left", (parentSize-size)/2 + 'px');
});