$(window).scroll(function (a,b,c,d,e,f) {
    var $this = $(this),
        $shadow = $("#header-shadow");
    if ($this.scrollTop() > 0){
        $shadow.addClass("active");
    } else {
        $shadow.removeClass("active");
    }
});