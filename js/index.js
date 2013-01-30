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
        .color(keyColor)
        .showLegend(false)
        .showControls(false)
        .showAxes(false)
        .tooltip(function(key, x, y) {
            return '<p>' +  y + '</p>'
        });

    d3.select("#chart-visits svg")
        .datum(
        //Test data. Just to see it's really simple
        [{
            "key" : "Visits",
            "values" : [{
                "x" : 1,
                "y" : 0
            },{
                "x" : 2,
                "y" : 2
            },{
                "x" : 3,
                "y" : 3
            },{
                "x" : 4,
                "y" : 2
            },{
                "x" : 5,
                "y" : 1
            },{
                "x" : 6,
                "y" : 4
            },{
                "x" : 7,
                "y" : 5
            },{
                "x" : 8,
                "y" : 6
            }]
        }]
    )
        .transition().call(chart);
    nv.utils.windowResize(chart.update);

    return chart;
});

nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
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