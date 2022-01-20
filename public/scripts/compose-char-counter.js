$(document).ready(function(){
    console.log("document ready");
    $('textarea').on('input', function(){
        const charLength = $(this).val().length;
        $(this).nextAll(".counter").text(140-charLength);
        if (charLength > 140) {
            $(this).nextAll(".counter").css("color", "red");
        }        
    });
});

