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