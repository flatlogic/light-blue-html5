//colors
//same as in _variables.scss
//keep it synchronized
var $lime = "#8CBF26",
    $red = "#e5603b",
    $redDark = "#d04f4f",
    $blue = "#6a8da7",
    $green = "#56bc76",
    $orange = "#eac85e",
    $pink = "#E671B8",
    $purple = "#A700AE",
    $brown = "#A05000",
    $teal = "#4ab0ce",
    $gray = "#666",
    $white = "#fff",
    $textColor = $gray;

//turn off charts is needed
var chartsOff = false;
if (chartsOff){
    nv.addGraph = function(){};
}

COLOR_VALUES = [$red, $orange, $green, $blue, $teal, $redDark];

var colors = function(){
    if (!window.d3) return false;
    return d3.scale.ordinal().range(COLOR_VALUES);
}();

function keyColor(d, i) {
    return colors(d.key)
}

function testData(stream_names, points_count) {
    var now = new Date().getTime(),
        day = 1000 * 60 * 60 * 24, //milliseconds
        days_ago_count = 60,
        days_ago = days_ago_count * day,
        days_ago_date = now - days_ago,
        points_count = points_count || 45, //less for better performance
        day_per_point = days_ago_count / points_count;
    return stream_layers(stream_names.length, points_count, .1).map(function(data, i) {
        return {
            key: stream_names[i],
            values: data.map(function(d,j){
                return {
                    x: days_ago_date + d.x * day * day_per_point,
                    y: Math.floor(d.y * 100) //just a coefficient
                }
            })
        };
    });
}

function closeNavigation(){
    var $accordion = $('#side-nav').find('.accordion-body.in');
    $accordion.collapse('hide');
    $accordion.siblings(".accordion-toggle").addClass("collapsed");
}

function resetContentMargin(){
    if ($(window).width() > 767){
        $(".content").css("margin-top", '');
    }
}

$(function(){

    $("#sidebar").on("mouseleave",function(){
        if (($(this).is(".sidebar-icons") || $(window).width() < 1049) && $(window).width() > 767){
            setTimeout(function(){
                closeNavigation();
            }, 300); // some timeout for animation
        }
    });

    $(window).resize(function(){
        closeNavigation();
        resetContentMargin();
    });

    //class-switch for button-groups
    $(".btn-group > .btn[data-toggle-class]").click(function(){
        var $this = $(this),
            $parent = $this.parent();

        if ($parent.data("toggle") == "buttons-radio"){
            $parent.children(".btn[data-toggle-class]").removeClass(function(){
                return $(this).data("toggle-class")
            }).addClass(function(){
                    return $(this).data("toggle-passive-class")
                });
            $this.removeClass($(this).data("toggle-passive-class")).addClass($this.data("toggle-class"));
        } else {
            $this.toggleClass($(this).data("toggle-passive-class")).toggleClass($this.data("toggle-class"));
        }
    });

    var $sidebar = $('#sidebar');

    $("#search-toggle").click(function(){
        //first hide menu if open

        if ($sidebar.data('collapse')){
            $sidebar.collapse('hide');
        }

        var $notifications = $('.notifications'),
            notificationsPresent = !$notifications.is(':empty');

        $("#search-form").css('height', function(){
            var $this = $(this);
            if ($this.height() == 0){
                $this.css('height', 40);
                notificationsPresent && $notifications.css('top', 86);
            } else {
                $this.css('height', 0);
                notificationsPresent && $notifications.css('top', '');
            }
        });
    });


    //hide search field if open
    $sidebar.on('show', function () {
        var $notifications = $('.notifications'),
            notificationsPresent = !$notifications.is(':empty');
        $("#search-form").css('height', 0);
        notificationsPresent && $notifications.css('top', '');
    });

    /*   Move content down when second-level menu opened */
    $("#side-nav").find("a.accordion-toggle").click(function(){
        var $this = $(this),
            initialContentMargin = 370; //if changed in css change here!
        if ($(window).width() < 768){
            var $secondLevelMenu = $this.find("+ ul"),
                $menuChildren = $secondLevelMenu.find("> li"),
                menuHeight = $menuChildren.length * $menuChildren.height(),
                $content = $(".content");
            if (!$secondLevelMenu.is(".in")){
                $content.css("margin-top", initialContentMargin + menuHeight + 'px');
            } else {
                $content.css("margin-top", '');
            }
        }
    });
});