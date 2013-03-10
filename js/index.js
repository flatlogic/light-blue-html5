nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
        .color(keyColor);

    chart.controlsColor([$textColor, $textColor, $textColor]);

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

nv.addGraph(function() {
    var testData = [
        {
            key: "Audio",
            y: Math.floor((Math.random()*900)+200),
            z: Math.floor((Math.random()*10)+1)
        },
        {
            key: "Video",
            y: Math.floor((Math.random()*500)+200),
            z: Math.floor((Math.random()*10)+1)
        },
        {
            key: "Photo",
            y: Math.floor((Math.random()*1000)+200),
            z: Math.floor((Math.random()*10)+1)
        }
    ];
    var colors = COLOR_VALUES.slice();
    colors[3] = "#bbb"; // gray for other

    var chart = nv.models.pieChartTotal()
        .x(function(d) { return d.key })
        .margin({top: 0, right: 20, bottom: 20, left: 20})
        .values(function(d) { return d })
        .z(function(d){return d.z})
        .color(colors)
        .showLabels(false)
        .showLegend(false)
        .tooltipContent(function(key, y, e, graph) {
            return '<h4>' + key + '</h4>' +
                '<p>' +  y + '</p>'
        })
        .total(function(count, z_count){
            return "<h4>"+ count + " files </h4>"
                + "<h3>" + z_count + "Gb </h3>"
        })
        .donut(true);
    chart.pie.margin({top: 10, bottom: -20});

    var sum = d3.sum(testData, function(d){
        return d.y;
    });
    d3.select("#data-chart-footer")
        .append("div")
        .classed("controls", true)
        .selectAll("div")
        .data(testData)
        .enter().append("div")
        .classed("control", true)
        .style("border-top", function(d, i){
            return "3px solid " + colors[i];
        })
        .html(function(d) {
            return "<h4>" + d.key + "</h4>"
                + "<p>" + Math.floor(100 * d.y / sum) + "%</p>";
        })
        .on('click', function(d) {
            d.disabled = !d.disabled;
            d3.select(this)
                .classed("disabled", d.disabled);
            if (!chart.pie.values()(testData).filter(function(d) { return !d.disabled }).length) {
                chart.pie.values()(testData).map(function(d) {
                    d.disabled = false;
                    return d;
                });
                d3.select("#data-chart-footer").selectAll('.control').classed('disabled', false);
            }
            d3.select("#data-chart svg").transition().call(chart)
        });

    d3.select("#data-chart svg")
        .datum([testData])
        .transition().call(chart);
    nv.utils.windowResize(chart.update);

    return chart;
});

$(function(){
    $("input:checkbox").uniform();
});