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
        .transition()
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
        .transition()
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
        .transition()
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
});

var lineResize,
    lineChart;
function lineChartOperaHack(){
    //lineChart is somehow not rendered correctly after updates. Need to reupdate
    if ($.browser.opera){
        clearTimeout(lineResize);
        lineResize = setTimeout(lineChart.update, 300);
    }
}
nv.addGraph(function() {
    var chart = nv.models.lineChart()
        .margin({top: 0, bottom: 25, left: 25, right: 0})
        //.showLegend(false)
        .color([$blue, $green, $orange]);

    chart.legend.margin({top: 3});

    chart.yAxis
        .showMaxMin(false)
        .tickFormat(d3.format(',.f'));

    chart.xAxis
        .showMaxMin(false)
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

    d3.select('#visits-chart svg')
        .datum(testData(['Visits', 'Unique', 'Pages'], 50))
        .transition().duration(500)
        .call(chart);

    nv.utils.windowResize(chart.update);

    chart.legend.dispatch.on('legendClick.updateExamples', function() {
        lineChartOperaHack();
    });

    lineChart = chart;

    lineChartOperaHack();

    return chart;
});

$(function(){
    /* Sparklines can also take their values from the first argument
     passed to the sparkline() function */
    function randomValue(){
        return Math.floor( Math.random() * 40 );
    }
    var values = [[],[],[]],
        options = {
            width: '80%',
            height: '40px',
            fillColor: 'white',
            lineWidth: '2',
            spotRadius: '2',
            maxSpotColor: $gray,
            minSpotColor: $gray,
            spotColor: $gray,
            highlightLineColor: $gray,
            highlightSpotColor: $gray
        };
    for (var i = 0; i < values.length; i++){
        values[i] = [10 + randomValue(), 15 + randomValue(), 20 + randomValue(), 15 + randomValue(), 25 + randomValue(),
            25 + randomValue(), 30 + randomValue(), 30 + randomValue(), 40 + randomValue()]
    }

    function drawSparkLines(){
        options.lineColor = $blue;
        $('#growth-rate').sparkline(values[0], options );
        options.lineColor = $green;
        $('#conversion-rate').sparkline(values[1], options );
        options.lineColor = $orange;
        $('#test').sparkline(values[2], options );
    }
    var sparkResize;

    $(window).resize(function(e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(drawSparkLines, 200);
    });
    drawSparkLines();

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

