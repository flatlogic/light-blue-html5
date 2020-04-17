$(function(){

    $('.widget').widgster();
    function pageLoad(){
        $('#tooltip-enabled, #max-length').tooltip();
        $('.selectpicker').selectpicker();
        $(".autogrow").autosize({append: "\n"});

        $(".select2").each(function(){
            $(this).select2($(this).data());
        });

        new Switchery(document.getElementById('checkbox-ios1'), {secondaryColor: '#040620'});
        new Switchery(document.getElementById('checkbox-ios2'),{color: Sing.colors['brand-primary'], secondaryColor: '#040620'});

        $('#datetimepicker4').datetimepicker({
            format: 'L'
        });
        $('#datetimepicker1').datetimepicker({
        });

        $('#colorpicker').colorpicker({color: Sing.colors['gray-100']});

        $("#mask-phone").inputmask({mask: "(999) 999-9999"});
        $("#mask-date").inputmask({mask: "99-99-9999"});
        $("#mask-int-phone").inputmask({mask: "+999 999 999 999"});
        $("#mask-time").inputmask({mask: "99:99"});

        $('#markdown').markdown();

        $('.js-slider').slider();

        // Prevent Dropzone from auto discovering this element:
        Dropzone.options.myAwesomeDropzone = false;
        $('#my-awesome-dropzone').dropzone();
        Holder.run();
        /**
         * Holder js hack. removing holder's data to prevent onresize callbacks execution
         * so they don't fail when page loaded
         * via ajax and there is no holder elements anymore
         */
        $('img[data-src]').each(function(){
            delete this.holder_data;
        });
        $('#summernote').summernote({
            toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ],
            height: 150
        });
    }
    pageLoad();
    SingApp.onPageLoad(pageLoad);
});