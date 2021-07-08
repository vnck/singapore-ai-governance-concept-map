$(document).ready(() => {
    $('#titleHeader').on('click', e => {
        e.preventDefault(); 
        $('html, body').animate({
            scrollTop: $("#introHeader").offset().top
          }, 800
        );
        $("#backUpContainer").css('visibility','visible');   
        $("#backUpContainer").fadeIn('fast');
    });

    $(window).scroll(() => { 
        if ($(this).scrollTop() > 100) { 
            $("#backUpContainer:hidden").css('visibility','visible');   
            $("#backUpContainer:hidden").fadeIn('fast');  
        } 
        else {     
            $("#backUpContainer:visible").fadeOut("fast"); 
        }  
    });

    $('#backUpContainer').on('click', e => {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
          }, 800
        );
    });
});
