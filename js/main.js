$(document).ready(() => {
    $('#titleHeader').on('click', e => {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#introHeader").offset().top
          }, 800
        );
    })
});