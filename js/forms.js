$(function(){
    $('#date-of-birth').datepicker();

    $(".btn-group > .btn[data-toggle-class]").click(function(){
        var $this = $(this);
        $this.parent().children(".btn[data-toggle-class]").removeClass(function(){
            return $(this).data("toggle-class")
        });
        $this.addClass($this.data("toggle-class"));
    })
});