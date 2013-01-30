nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
        .color(keyColor);

    chart.yAxis
        .showMaxMin(false)
        .tickFormat(d3.format(',f'));
    chart.xAxis
        .showMaxMin(false)
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

    d3.select("#overview-chart svg")
        .datum(testData(['US', 'Canada', 'Belarus', 'Australia']))
        .transition().duration(500).call(chart);
    nv.utils.windowResize(chart.update);

    return chart;
});

nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
        .margin({left: 0, right: 0, top: 0, bottom: 0})
        //todo this is the problem. stackedAreaChart shouldn't have some default margin. It's bad
        .color(keyColor)
        .showLegend(false)
        .showControls(false)
        .showAxes(false)
        .tooltip(function(key, x, y) {
            return '<p>' +  y + '</p>'
        });

    d3.select("#chart-visits svg")
        .datum(testData(['Visits'], 8))
        .transition().call(chart);
    nv.utils.windowResize(chart.update);

    return chart;
});

nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
        .margin({left: 0, right: 0, top: 0, bottom: 0})
        //todo this is the problem. stackedAreaChart shouldn't have some default margin. It's bad
        .color(keyColor)
        .showLegend(false)
        .showControls(false)
        .showAxes(false)
        .tooltip(function(key, x, y) {
            return '<p>' +  y + '</p>'
        });

    d3.select("#chart-unique svg")
        .datum(testData(['Unique'], 8))
        .transition().call(chart);
    nv.utils.windowResize(chart.update);

    return chart;
});

nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
        .margin({left: 0, right: 0, top: 0, bottom: 0})
        //todo this is the problem. stackedAreaChart shouldn't have some default margin. It's bad
        .color(keyColor)
        .showLegend(false)
        .showControls(false)
        .showAxes(false)
        .tooltip(function(key, x, y) {
            return '<p>' +  y + '</p>'
        });

    d3.select("#chart-pageviews svg")
        .datum(testData(['Pageviews'], 8))
        .transition().call(chart);
    nv.utils.windowResize(chart.update);

    return chart;
});

nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
        .margin({left: 0, right: 0, top: 0, bottom: 0})
        //todo this is the problem. stackedAreaChart shouldn't have some default margin. It's bad
        .color(keyColor)
        .showLegend(false)
        .showControls(false)
        .showAxes(false)
        .tooltip(function(key, x, y) {
            return '<p>' +  y + '</p>'
        });

    d3.select("#chart-duration svg")
        .datum(testData(['Duration'], 8))
        .transition().call(chart);
    nv.utils.windowResize(chart.update);

    return chart;
});

nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
        .margin({left: 0, right: 0, top: 0, bottom: 0})
        //todo this is the problem. stackedAreaChart shouldn't have some default margin. It's bad
        .color(keyColor)
        .showLegend(false)
        .showControls(false)
        .showAxes(false)
        .tooltip(function(key, x, y) {
            return '<p>' +  y + '</p>'
        });

    d3.select("#chart-bounce svg")
        .datum(testData(['Bounce'], 8))
        .transition().call(chart);
    nv.utils.windowResize(chart.update);

    return chart;
});