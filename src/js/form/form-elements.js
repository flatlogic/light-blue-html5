$(function(){

    $('.widget').widgster();
    var bs3Wysihtml5Templates = {
        "emphasis": function(locale, options) {
            var size = (options && options.size) ? 'btn-'+options.size : '';
            return "<li>" +
                "<div class='btn-group'>" +
                "<a class='btn " + size + " btn-default' data-wysihtml5-command='bold' title='CTRL+B' tabindex='-1'><i class='fa fa-bold'></i></a>" +
                "<a class='btn " + size + " btn-default' data-wysihtml5-command='italic' title='CTRL+I' tabindex='-1'><i class='fa fa-italic'></i></a>" +
                "</div>" +
                "</li>";
        },
        "link": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
                ""+
                "<div class='bootstrap-wysihtml5-insert-link-modal modal fade'>" +
                "<div class='modal-dialog'>"+
                "<div class='modal-content'>"+
                "<div class='modal-header'>" +
                "<a class='close' data-dismiss='modal'>&times;</a>" +
                "<h4>" + locale.link.insert + "</h4>" +
                "</div>" +
                "<div class='modal-body'>" +
                "<input value='http://' class='bootstrap-wysihtml5-insert-link-url form-control'>" +
                "<label class='checkbox'> <input type='checkbox' class='bootstrap-wysihtml5-insert-link-target' checked>" + locale.link.target + "</label>" +
                "</div>" +
                "<div class='modal-footer'>" +
                "<button class='btn btn-default' data-dismiss='modal'>" + locale.link.cancel + "</button>" +
                "<button href='#' class='btn btn-primary' data-dismiss='modal'>" + locale.link.insert + "</button>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<a class='btn " + size + " btn-default' data-wysihtml5-command='createLink' title='" + locale.link.insert + "' tabindex='-1'><i class='fa fa-share'></i></a>" +
                "</li>";
        },
        "html": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
                "<div class='btn-group'>" +
                "<a class='btn " + size + " btn-default' data-wysihtml5-action='change_view' title='" + locale.html.edit + "' tabindex='-1'><i class='fa fa-pencil'></i></a>" +
                "</div>" +
                "</li>";
        }
    };
    function pageLoad(){
        $('#tooltip-enabled, #max-length').tooltip();
        $('.selectpicker').selectpicker();
        $(".autogrow").autosize({append: "\n"});
        $('#wysiwyg').wysihtml5({
            html: true,
            customTemplates: bs3Wysihtml5Templates,
            stylesheets: []
        });
        $(".select2").each(function(){
            $(this).select2($(this).data());
        });

        new Switchery(document.getElementById('checkbox-ios1'));
        new Switchery(document.getElementById('checkbox-ios2'),{color: Sing.colors['brand-primary']});

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
    }
    pageLoad();
    SingApp.onPageLoad(pageLoad);
});