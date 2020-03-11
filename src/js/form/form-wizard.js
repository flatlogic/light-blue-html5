//bootstrap application wizard demo functions

function validateServerLabel(el) {
    var name = el.val();
    var retValue = {};

    if (name == "") {
        retValue.status = false;
        retValue.msg = "Please enter a label";
    } else {
        retValue.status = true;
    }

    return retValue;
}

function validateFQDN(el) {
    var $this = $(el);
    var retValue = {};

    if ($this.is(':disabled')) {
        // FQDN Disabled
        retValue.status = true;
    } else {
        if ($this.data('lookup') === 0) {
            retValue.status = false;
            retValue.msg = "Preform lookup first";
        } else {
            if ($this.data('is-valid') === 0) {
                retValue.status = false;
                retValue.msg = "Lookup Failed";
            } else {
                retValue.status = true;
            }
        }
    }

    return retValue;
}

function lookup() {
    // Normally a ajax call to the server to preform a lookup
    $('#fqdn').data('lookup', 1);
    $('#fqdn').data('is-valid', 1);
    $('#ip').val('127.0.0.1');
}

$(function(){
    function pageLoad(){
        $('.widget').widgster();
        $("#destination").inputmask({mask: "99999"});
        $("#credit").inputmask({mask: "9999-9999-9999-9999"});
        $("#expiration-date").datetimepicker({
            format: false
        });
        $('#wizard').bootstrapWizard({
            onTabShow: function($activeTab, $navigation, index) {
                var $total = $navigation.find('li').length;
                var $current = index + 1;
                var $percent = ($current/$total) * 100;
                var $wizard = $("#wizard");
                $wizard.find('#bar').css({width: $percent + '%'});

                if($current >= $total) {
                    $wizard.find('.pager .next').hide();
                    $wizard.find('.pager .finish').show();
                    $wizard.find('.pager .finish').removeClass('disabled');
                } else {
                    $wizard.find('.pager .next').show();
                    $wizard.find('.pager .finish').hide();
                }

                //setting done class
                $navigation.find('li').removeClass('done');
                $activeTab.prevAll().addClass('done');
            },

            // validate on tab change
            onNext: function($activeTab, $navigation, nextIndex){
                var $activeTabPane = $($activeTab.find('a[data-toggle=tab]').attr('href')),
                    $form = $activeTabPane.find('form');

                // validate form in case there is form
                if ($form.length){
                    return $form.parsley().validate();
                }
            },
            //diable tab clicking
            onTabClick: function($activeTab, $navigation, currentIndex, clickedIndex){
                return $navigation.find('li:eq(' + clickedIndex + ')').is('.done');
            }
        })
            //setting fixed height so wizard won't jump
            .find('.tab-pane').css({height: 444});

        //clear previous wizard if exists
        //causes conflicts when loaded via pjax
        $('.modal.wizard').remove();
        $('.chzn-select').select2();
        var wizard = $('#satellite-wizard').wizard({
            keyboard : false,
            contentHeight : 400,
            contentWidth : 700,
            backdrop: 'static'
        });

        $('#fqdn').on('input', function() {
            if ($(this).val().length != 0) {
                $('#ip').val('').attr('disabled', 'disabled');
                $('#fqdn, #ip').parents('.form-group').removeClass('has-error has-success');
            } else {
                $('#ip').val('').removeAttr('disabled');
            }
        });

        var pattern = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
        x = 46;

        $('#ip').on('input', function() {
            if ($(this).val().length != 0) {
                $('#fqdn').val('').attr('disabled', 'disabled');
            } else {
                $('#fqdn').val('').removeAttr('disabled');
            }
        }).keypress(function(e) {
            if (e.which != 8 && e.which != 0 && e.which != x && (e.which < 48 || e.which > 57)) {
                console.log(e.which);
                return false;
            }
        }).keyup(function() {
            var $this = $(this);
            if (!pattern.test($this.val())) {
                //$('#validate_ip').text('Not Valid IP');
                console.log('Not Valid IP');
                $this.parents('.form-group').removeClass('has-error has-success').addClass('has-error');
                while ($this.val().indexOf("..") !== -1) {
                    $this.val($this.val().replace('..', '.'));
                }
                x = 46;
            } else {
                x = 0;
                var lastChar = $this.val().substr($this.val().length - 1);
                if (lastChar == '.') {
                    $this.val($this.val().slice(0, -1));
                }
                var ip = $this.val().split('.');
                if (ip.length == 4) {
                    //$('#validate_ip').text('Valid IP');
                    console.log('Valid IP');
                    $this.parents('.form-group').removeClass('has-error').addClass('has-success');
                }
            }
        });

        wizard.on('closed', function() {
            wizard.reset();
        });

        wizard.on("reset", function() {
            wizard.modal.find(':input').val('').removeAttr('disabled');
            wizard.modal.find('.form-group').removeClass('has-error').removeClass('has-success');
            wizard.modal.find('#fqdn').data('is-valid', 0).data('lookup', 0);
        });

        wizard.on("submit", function(wizard) {
            var submit = {
                "hostname": $("#new-server-fqdn").val()
            };

            this.log('seralize()');
            this.log(this.serialize());
            this.log('serializeArray()');
            this.log(this.serializeArray());

            setTimeout(function() {
                wizard.trigger("success");
                wizard.hideButtons();
                wizard._submitting = false;
                wizard.showSubmitCard("success");
                wizard.updateProgressBar(0);
            }, 2000);
        });

        wizard.el.find(".wizard-success .im-done").click(function() {
            wizard.hide();
            setTimeout(function() {
                wizard.reset();
            }, 250);

        });

        wizard.el.find(".wizard-success .create-another-server").click(function() {
            wizard.reset();
        });

        wizard.el.find('.wizard-progress-container').empty()
            .append('<div class="bg-gray-lighter"><progress class="progress progress-primary progress-xs" style="width: 0%" value="100" max="100"></progress></div>');

        wizard.progress = wizard.modal.find('progress');

        $(".wizard-group-list").click(function() {
            alert("Disabled for demo.");
        });

        $('#open-wizard').click(function(e) {
            e.preventDefault();
            wizard.show();
            wizard.errorPopover = function(el, msg, allowHtml) {
                this.log("launching popover on", el);
                allowHtml = typeof allowHtml !== "undefined" ? allowHtml : false;
                var popover = el.popover({
                    content: msg,
                    trigger: "manual",
                    html: allowHtml,
                    container: el.parents('.form-group')
                }).addClass("error-popover").popover("show").next(".popover");

                el.parents('.form-group').find('.popover').addClass("error-popover");
                $('.popover-title').css('display', 'none');
                $('.popover').addClass('popover-body-error');
                $('.popover-content').addClass('popover-content-error');
                $('.popover-arrow').addClass('popover-arrow-error');

                this.popovers.push(el);

                return popover;
            };
            $('.dropdown-menu > li > a').addClass('dropdown-item');
        });
    }
    pageLoad();
    SingApp.onPageLoad(pageLoad);
});