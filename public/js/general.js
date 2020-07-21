$('#refresh_button').hover(function() {
    let refreshIcon = $('#refresh_icon');
    refreshIcon.removeClass("text-white-100");
    refreshIcon.addClass("text-white-50");
}, function() {
    let refreshIcon = $('#refresh_icon');
    refreshIcon.addClass("text-white-100");
    refreshIcon.removeClass("text-white-50");
});
