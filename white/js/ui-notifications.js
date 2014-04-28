//copy spinner from flat theme
(function() {
    var $, FlatMessage, spinner_template,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    $ = jQuery;

    spinner_template = '<div class="messenger-spinner">\n    <span class="messenger-spinner-side messenger-spinner-side-left">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n    <span class="messenger-spinner-side messenger-spinner-side-right">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n</div>';

    FlatMessage = (function(_super) {

        __extends(FlatMessage, _super);

        function FlatMessage() {
            return FlatMessage.__super__.constructor.apply(this, arguments);
        }

        FlatMessage.prototype.template = function(opts) {
            var $message;
            $message = FlatMessage.__super__.template.apply(this, arguments);
            $message.append($(spinner_template));
            return $message;
        };

        return FlatMessage;

    })(window.Messenger.Message);

    window.Messenger.themes.air = {
        Message: FlatMessage
    };

}).call(this);

$(function(){
    function pageLoad(){
        $('.widget').widgster();
        Messenger({
            theme: 'air'
        }).post({
            message: "Thanks for checking out Messenger!",
            type: 'error',
            showCloseButton: true,
            hideAfter: false
        });

        var i = 0;

        Messenger().run({
            errorMessage: 'Error destroying alien planet',
            successMessage: 'Alien planet destroyed!',
            action: function(opts) {
                if (++i < 3) {
                    return opts.error({
                        status: 500,
                        readyState: 0,
                        responseText: 0
                    });
                } else {
                    return opts.success();
                }
            }
        });
    }

    pageLoad();

    PjaxApp.onPageLoad(pageLoad);
});