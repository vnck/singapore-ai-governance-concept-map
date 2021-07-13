$(document).ready(() => {
    $(() => {
        $('[data-toggle="popover"]').popover({
            trigger: 'focus'
        });
    });
    
    $('#titleHeader').on('click', e => {
        e.preventDefault(); 
        $('html, body').animate({
            scrollTop: $("#introHeader").offset().top
          }, 800
        );
        $("#backUpContainer").css('visibility','visible');   
        $("#backUpContainer").fadeIn('fast');
    });

    let sw = true;
    $(window).scroll(() => { 
        if (sw) {
            sw = false;
            setTimeout(() => {
                if ($(this).scrollTop() > 100) { 
                    $("#backUpContainer:hidden").css('visibility','visible');   
                    $("#backUpContainer:hidden").fadeIn('fast');
                    sw=true;
                } 
                else {     
                    $("#backUpContainer:visible").fadeOut("fast");
                    sw=true;
                }
            }, 200);  
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
