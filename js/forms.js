$(function(){
    $('#date-of-birth').datepicker();

    $(".btn-group > .btn[data-toggle-class]").click(function(){
        var $this = $(this);
        $this.parent().children(".btn[data-toggle-class]").removeClass(function(){
            return $(this).data("toggle-class")
        });
        $this.addClass($this.data("toggle-class"));
    });

    $('.selectpicker').selectpicker();
    //selectpicker doesn't seem to be flexible enough (can't change template), so need to replace span.caret externally
    $('.selectpicker + .bootstrap-select span.caret').replaceWith("<i class='icon-caret-down'></i>");
    $('.selectpicker + .bootstrap-select span.pull-left').removeClass("pull-left");
    $("#phone, #fax").mask("(999) 999-9999");
    $(".chzn-select").chosen();
});