$(function(){
    //settings
    var $settings = $("#settings"),
        $sidebarSettings = $("#sidebar-settings"),
        settingsState = JSON.parse(localStorage.getItem("settings-state")) || {
            sidebar: 'left',
            background: 'two',
            sidebarState: 'auto',
            displaySidebar: true
        },
        $pageHeader = $(".page-header"),
        $body = $("body"),
        popoverClose = function(e){
            var $popover = $settings.siblings(".popover");
            if(!$.contains($popover[0], e.target)){
                $settings.popover('hide');
                $(document).off("click", popoverClose);
            }
        },
        sidebarSide = function(side){
            if (side == "right"){
                $body.addClass("sidebar-on-right")
            } else {
                $body.removeClass("sidebar-on-right")
            }
        },
        backgroundStyle = function(style){
            if (style == "two"){
                $body.addClass("background-two");
                $(".light-brown").removeClass("light-brown").addClass("light-blue");
                $(".light-brown-color").removeClass("light-brown-color").addClass("light-blue-color");
                $(".dark-brown").removeClass("dark-brown").addClass("dark-blue");
            } else {
                $body.removeClass("background-two");
                $(".light-blue").removeClass("light-blue").addClass("light-brown");
                $(".light-blue-color").removeClass("light-blue-color").addClass("light-brown-color");
                $(".dark-blue").removeClass("dark-blue").addClass("dark-brown");
            }
        },
        sidebarState = function(state){
            var $template = $('#sidebar-settings-template');
            if (!$template[0]){
                return;
            }
            $sidebarSettings.html(_.template($template.html(), {sidebarState: state}));
            if (state == "auto"){
                $(".sidebar").removeClass("sidebar-icons");
                $(".side-nav").removeClass("sidebar-icons");
                $(".wrap").removeClass("sidebar-icons");
            } else {
                $(".sidebar").addClass("sidebar-icons");
                $(".side-nav").addClass("sidebar-icons");
                $(".wrap").addClass("sidebar-icons");
            }
            try {
            if (window.onresize){
                window.onresize();
            }
            } catch (e){
                //just swallow it
            }

        },
        displaySidebar = function(display){
            if (display == true){
                $body.removeClass("sidebar-hidden")
            } else {
                $body.addClass("sidebar-hidden")
            }
        };

    sidebarSide(settingsState.sidebar);
    backgroundStyle(settingsState.background);
    sidebarState(settingsState.sidebarState);
    displaySidebar(settingsState.displaySidebar);

    if (!$settings[0]){
        return;
    }

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
            // need to remove popover on anywhere-click
            $(document).on("click", popoverClose);
            $("#user").popover('hide');
            return false;
        });


    //sidevar left/right
    $pageHeader.on("click", ".popover #sidebar-toggle .btn", function(){
        var $this = $(this),
            side = $this.data("value");
        sidebarSide(side);
        settingsState.sidebar = side;
        localStorage.setItem("settings-state", JSON.stringify(settingsState));
    });

    //background
    $pageHeader.on("click", ".popover #background-toggle .btn", function(){
        var $this = $(this),
            style = $this.data("value");
        backgroundStyle(style);
        settingsState.background = style;
        localStorage.setItem("settings-state", JSON.stringify(settingsState));
    });

    //sidebar visibility
    $pageHeader.on("click", ".popover #display-sidebar-toggle .btn", function(){
        var $this = $(this),
            display = $this.data("value");
        displaySidebar(display);
        settingsState.displaySidebar = display;
        localStorage.setItem("settings-state", JSON.stringify(settingsState));
    });

    //sidebar state {active, icons}
    $sidebarSettings.on("click", ".btn", function(){
        var $this = $(this),
            state = $this.data("value");
        sidebarState(state);
        settingsState.sidebarState = state;
        localStorage.setItem("settings-state", JSON.stringify(settingsState));
    });

    //close navigation if sidebar in icons state
    if (($("#sidebar").is(".sidebar-icons") || $(window).width() < 1049) && $(window).width() > 767){
        var $activeAccordion = $("#side-nav").find("> .accordion-group.active");
        $activeAccordion.find(".accordion-toggle").addClass("collapsed");
        $activeAccordion.find(".accordion-body.collapse").removeClass("in");
    }
});

$(function(){
    //user stuff

    var $user = $("#user"),
        popoverClose = function(e){
            var $popover = $user.siblings(".popover");
            if(!$.contains($popover[0], e.target)){
                $user.popover('hide');
                $(document).off("click", popoverClose);
            }
        };

    if (!$user[0]){
        return;
    }

    $user.popover({template: '<div class="popover user-info">' +
        '<div class="arrow"></div>' +
        '<div class="popover-inner">' +
        '<div class="popover-content"></div>' +
        '</div>' +
        '</div>',
        html: true,
        content: _.template($('#user-template').html())
    }).click(function(){
            // need to remove popover on anywhere-click
            $(document).on("click", popoverClose);
            $("#settings").popover('hide');
            return false;
        });
});