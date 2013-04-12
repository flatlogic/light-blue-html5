nv.addGraph(function() {
    var chart = nv.models.multiBarChart()
            .margin({top: 25, bottom: 5, left: 15, right: 15})
            .showLegend(false)
            .showControls(false)
            .ticks(false)
            .color(['#ffffff'])
        ;

    chart.yAxis
        .showMaxMin(false)
        .tickFormat(d3.format(',.f'));

    chart.xAxis
        .showMaxMin(false)
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

    d3.select('#visits svg')
        .datum(testData(['Visits'], 25))
        .transition().duration(500)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
});

nv.addGraph(function() {
    var chart = nv.models.multiBarChart()
            .margin({top: 25, bottom: 5, left: 15, right: 15})
            .showLegend(false)
            .showControls(false)
            .ticks(false)
            .color(['#ffffff'])
        ;

    chart.yAxis
        .showMaxMin(false)
        .tickFormat(d3.format(',.f'));

    chart.xAxis
        .showMaxMin(false)
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

    d3.select('#orders svg')
        .datum(testData(['Orders'], 25))
        .transition().duration(500)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
});

nv.addGraph(function() {
    var chart = nv.models.multiBarChart()
            .margin({top: 25, bottom: 5, left: 15, right: 15})
            .showLegend(false)
            .showControls(false)
            .ticks(false)
            .color(['#ffffff'])
        ;

    chart.yAxis
        .showMaxMin(false)
        .tickFormat(d3.format(',.f'));

    chart.xAxis
        .showMaxMin(false)
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

    d3.select('#traffic svg')
        .datum(testData(['Traffic'], 25))
        .transition().duration(500)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
});

$(function(){
    $("input:checkbox").uniform();

    // Notification link click handler.
    // JUST FOR DEMO.
    // Can be removed.

    function close(e){
        var $settings = $("#settings"),
            $popover = $settings.siblings(".popover");
        if(!$.contains($popover[0], e.target)){
            $settings.popover('hide');
            $(document).off("click", close);
        }
    }
    $("#notification-link").click(function(){
        if ( $(window).width() > 767){
            $("#settings").popover('show');
            $(document).on("click", close);
            return false;
        }
    });

    $("#feed").slimscroll({
        height: 'auto',
        size: '5px',
        alwaysVisible: true
    });

    $("#chat-messages").slimscroll({
        height: '240px',
        size: '5px',
        alwaysVisible: true
    });
});

