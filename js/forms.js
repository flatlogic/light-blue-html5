$(function(){
    $('.date-picker').datepicker();

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

    //teach select to accept data-attributes
    $(".chzn-select").each(function(){
        $(this).select2($(this).data());
    });

    //changing default parsley behaviour so it adds error messages to labels.
    //label - is a parent of element
    $("#user-form").parsley({
        errors: {
            container: function ( elem, isRadioOrCheckbox ) {
                return elem.parents(".control-group").children("label");
            }
        }
    });

    $("input:checkbox").uniform();

    var customWysihtml5Templates = {
        "font-styles": function(locale) {
            return "<li class='dropdown'>" +
            "<a class='btn btn-small dropdown-toggle' data-toggle='dropdown' href='#'>" +
            "<i class='icon-font'></i>&nbsp;<span class='current-font'>Normal text</span>&nbsp;&nbsp;<i class='icon-caret-down'></i>" +
            "</a>" +
            "<ul class='dropdown-menu'>" +
            "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='div'>Normal text</a></li>" +
            "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h1'>Heading 1</a></li>" +
            "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h2'>Heading 2</a></li>" +
            "</ul>" +
            "</li>"
        },
        "emphasis":  function(locale) {
            return "<li>" +
            "<div class='btn-group'>"
            + "<a class='btn btn-small ' data-wysihtml5-command='bold' title='CTRL+B'>Bold</a>"
            + "<a class='btn btn-small ' data-wysihtml5-command='italic' title='CTRL+I'>Italic</a>"
            //,+ "<a class='btn' data-wysihtml5-command='underline' title='CTRL+U'>Underline</a>"
            + "</div>"
            + "</li>"
        },
        "lists": function(locale) {
                return "<li>"
            + "<div class='btn-group'>"
            + "<a class='btn btn-small ' data-wysihtml5-command='insertUnorderedList' title='Unordered List'><i class='icon-list'></i></a>"
            + "<a class='btn btn-small ' data-wysihtml5-command='insertOrderedList' title='Ordered List'><i class='icon-th-list'></i></a>"
            + "<a class='btn btn-small ' data-wysihtml5-command='Outdent' title='Outdent'><i class='icon-indent-right'></i></a>"
            + "<a class='btn btn-small ' data-wysihtml5-command='Indent' title='Indent'><i class='icon-indent-left'></i></a>"
            + "</div>"
            + "</li>"
        },

        "link": function(locale) {
                    return "<li>"

            + "<div class='bootstrap-wysihtml5-insert-link-modal modal hide fade'>"
            + "<div class='modal-header'>"
            + "<a class='close' data-dismiss='modal'>×</a>"
            + "<h3>Insert Link</h3>"
            + "</div>"
            + "<div class='modal-body'>"
            + "<input value='http://' class='bootstrap-wysihtml5-insert-link-url input-xlarge'>"
            + "</div>"
            + "<div class='modal-footer'>"
            + "<a href='#' class='btn' data-dismiss='modal'>Cancel</a>"
            + "<a href='#' class='btn btn-primary' data-dismiss='modal'>Insert link</a>"
            + "</div>"
            + "</div>"

            + "<a class='btn btn-small ' data-wysihtml5-command='createLink' title='Link'><i class='icon-share'></i></a>"

            + "</li>"
        },

        "image": function(locale) {
                        return "<li>"

            + "<div class='bootstrap-wysihtml5-insert-image-modal modal hide fade'>"
            + "<div class='modal-header'>"
            + "<a class='close' data-dismiss='modal'>×</a>"
            + "<h3>Insert Image</h3>"
            + "</div>"
            + "<div class='modal-body'>"
            + "<input value='http://' class='bootstrap-wysihtml5-insert-image-url input-xlarge'>"
            + "</div>"
            + "<div class='modal-footer'>"
            + "<a href='#' class='btn' data-dismiss='modal'>Cancel</a>"
            + "<a href='#' class='btn btn-primary' data-dismiss='modal'>Insert image</a>"
            + "</div>"
            + "</div>"

            + "<a class='btn btn-small ' data-wysihtml5-command='insertImage' title='Insert image'><i class='icon-picture'></i></a>"

            + "</li>"
        },

        "html": function(locale) {
                            return "<li>"
                + "<div class='btn-group'>"
                + "<a class='btn btn-small ' data-wysihtml5-action='change_view' title='Edit HTML'><i class='icon-pencil'></i></a>"
                + "</div>"
                + "</li>"
        }
    };
    $("#text").wysihtml5({
        html: true,
        customTemplates: customWysihtml5Templates
    });
});