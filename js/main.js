$(document).ready(() => {
    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl, { trigger: 'hover focus' });
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
    let $backUpContainer = $("#backUpContainer");
    let isVisible = false;
    $(window).scroll(() => { 
        if (sw) {
            sw = false;
            setTimeout(() => {
                let shouldBeVisible = $(window).scrollTop() > 100;
                if (shouldBeVisible && !isVisible) { 
                    $backUpContainer.css('visibility','visible').fadeIn('fast');
                    isVisible = true;
                } 
                else if (!shouldBeVisible && isVisible) {     
                    $backUpContainer.fadeOut("fast");
                    isVisible = false;
                }
                sw = true;
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
