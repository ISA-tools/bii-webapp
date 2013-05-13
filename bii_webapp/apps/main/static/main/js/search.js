/**
 * Sets the size of the vertical investigation title
 * once it knows how many studies it contains.
 */
$(document).ready(function() {
	$(".investigation").each(function(index) {
		var size = $(this).find('.study').length;
		var el=$(this).find('.inv_id');
		el.height(size*120+(size-1)*5);
		el.css("line-height",(size*120)+7+'px');
	});
	
	$(".study").each(function(index) {
		var x =$(this).parents('.investigation');
		if($(this).parents('.investigation').length==0){
			$(this).css("margin-left",34+'px');
		}
	});
});