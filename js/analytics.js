nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
        .margin({top: 0, bottom: 40, left: 40, right: 0})
        .color(keyColor);

    chart.yAxis
        .showMaxMin(false)
        .tickFormat(d3.format(',f'));
    chart.xAxis
        .showMaxMin(false)
        .tickFormat(d3.format(',f'));

    d3.select("#chart svg")
        .datum(testData(['Search', 'Referral', 'Direct']))
        .transition().duration(500).call(chart);
    nv.utils.windowResize(chart.update);

    return chart;
});