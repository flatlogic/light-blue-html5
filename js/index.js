nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
        .color(keyColor);

    chart.yAxis
        .showMaxMin(false)
        .tickFormat(d3.format(',f'));
    chart.xAxis
        .showMaxMin(false)
        .tickFormat(d3.format(',f'));

    d3.select("#overview-chart svg")
        .datum(testData(['Search', 'Referral', 'Direct']))
        .transition().duration(500).call(chart);
    nv.utils.windowResize(chart.update);

    return chart;
});