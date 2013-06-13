$(document).ready(function () {

    $('.isafile > a').each(function(){
          var currUrl=$(this).attr('href')
          var url=currUrl.replace('media','/files/download');
        $(this).attr('href',url);
    })

});