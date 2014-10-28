$(function(){
    function pageLoad(){
        $('.date-picker').datetimepicker({
            pickTime: false
        });

        $('.selectpicker').selectpicker();

        //teach select2 to accept data-attributes
        $(".select2").each(function(){
            $(this).select2($(this).data());
        });

        $("#user-form").parsley({
            errorsContainer: function ( parsleyField ) {
                return parsleyField.$element.parents(".form-group").children("label");
            }
        });
    }

    pageLoad();
    PjaxApp.onPageLoad(pageLoad);
});