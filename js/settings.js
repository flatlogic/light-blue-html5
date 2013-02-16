$(function(){
    //settings popover
    var $settings = $("#settings"),
        settingsState = JSON.parse(localStorage.getItem("settings-state")) || {sidebar: 'left'},
        popoverClose = function(e){
            var $popover = $settings.siblings(".popover");
            if(!$.contains($popover[0], e.target)){
                $settings.popover('hide');
                $(document).off("click", popoverClose);
            }
        },
        sidebarSide = function(side){
            var $body = $("body");
            if (side == "right"){
                $body.addClass("sidebar-on-right")
            } else {
                $body.removeClass("sidebar-on-right")
            }
        };

    sidebarSide(settingsState.sidebar);

    $settings.popover({
        template: '<div class="popover">' +
            '<div class="arrow"></div>' +
            '<div class="popover-inner">' +
            '<div class="popover-content"></div>' +
            '</div>' +
            '</div>',
        html: true,
        content: function(){
            return _.template($('#settings-template').html(), settingsState);
        }
    }).click(function(){
            $(document).on("click", popoverClose);
            return false;
        });


    //sidevar left/right
    $(".page-header").on("click", ".popover .btn", function(){
        var $this = $(this);
        sidebarSide($this.data("value"));
        settingsState.sidebar = $this.data("value");
        localStorage.setItem("settings-state", JSON.stringify(settingsState));
    });
});