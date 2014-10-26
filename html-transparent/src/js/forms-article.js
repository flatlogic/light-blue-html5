$(function(){
    var bs3Wysihtml5Templates = {
        "emphasis": function(argument) {
            var locale = argument.locale,
                options = argument.options,
                size = (options.toolbar && options.toolbar.size) ? ' btn-'+options.toolbar.size : '';
            return "<li>" +
                "<div class='btn-group'>" +
                "<a class='btn btn-default btn-" + size + "' data-wysihtml5-command='bold' title='CTRL+B' tabindex='-1'><i class='glyphicon glyphicon-bold'></i></a>" +
                "<a class='btn btn-default btn-" + size + "' data-wysihtml5-command='italic' title='CTRL+I' tabindex='-1'><i class='glyphicon glyphicon-italic'></i></a>" +
                "</div>" +
                "</li>";
        },
        "link": function(argument) {
            var locale = argument.locale,
                options = argument.options,
                size = (options.toolbar && options.toolbar.size) ? ' btn-'+options.toolbar.size : '';
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
                "<button class='btn btn-primary' data-dismiss='modal'>" + locale.link.insert + "</button>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<a class='btn btn-default btn-" + size + "' data-wysihtml5-command='createLink' title='" + locale.link.insert + "' tabindex='-1'><i class='fa fa-share'></i></a>" +
                "</li>";
        },
        "html": function(argument) {
            var locale = argument.locale,
                options = argument.options,
                size = (options.toolbar && options.toolbar.size) ? ' btn-'+options.toolbar.size : '';
            return "<li>" +
                "<div class='btn-group'>" +
                "<a class='btn btn-default btn-" + size + "' data-wysihtml5-action='change_view' title='" + locale.html.edit + "' tabindex='-1'><i class='fa fa-pencil'></i></a>" +
                "</div>" +
                "</li>";
        }
    };
    function pageLoad(){
        $('.date-picker').datetimepicker();

        $('.selectpicker').selectpicker({
            pickTime: false
        });

        $("#phone, #fax").mask("(999) 999-9999");
        $("#publish-time").mask("99:99");

        //teach select2 to accept data-attributes
        $(".chzn-select").each(function(){
            $(this).select2($(this).data());
        });
        $("#article-tags").select2({
            tags: ['photoshop', 'colors', 'plugins', 'themes', 'bike']
        });

        $("#content").wysihtml5({
            html: true,
            customTemplates: bs3Wysihtml5Templates,
            stylesheets: ['data:text/css,body{background-color: transparent !important;}'],
            toolbar: {
                size: 'sm btn-transparent'
            }
        });

        $("#article-form").parsley();
    }

    pageLoad();
    PjaxApp.onPageLoad(pageLoad);
});