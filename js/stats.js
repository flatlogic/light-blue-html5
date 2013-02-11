// test Data.
//use if needed
function sinAndCos() {
    var sin = [],
        cos = [];

    for (var i = 0; i < 100; i++) {
        sin.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) }); //the nulls are to show how defined works
        cos.push({x: i, y: .5 * Math.cos(i/10)});
    }

    return [
        {
            area: true,
            values: sin,
            key: "Sine Wave"
        },
        {
            values: cos,
            key: "Cosine Wave"
        }
    ];
}
var testData = testData(['Search', 'Referral', 'Direct']),
    stackedChart,
    lineChart;

nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
        .margin({top: 0, bottom: 40, left: 40, right: 0})
        .color(keyColor)
        .controlsColor([$textColor, $textColor, $textColor]);

    chart.yAxis
        .showMaxMin(false)
        .tickFormat(d3.format(',f'));

    chart.xAxis
        .showMaxMin(false)
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

    d3.select("#sources-chart-stacked svg")
        .datum(testData)
        .transition().duration(500).call(chart);
    nv.utils.windowResize(chart.update);

    chart.legend.dispatch.on('legendClick.updateExamples', function() {
        setTimeout(function() {
            lineChart.update();
        }, 100);
    });

    chart.stacked.dispatch.on('areaClick.updateExamples', function(e) {
        setTimeout(function() {
            lineChart.update();
        }, 100);
    });

    stackedChart = chart;

    return chart;
});

nv.addGraph(function() {
    var chart = nv.models.lineChart()
        .margin({top: 0, bottom: 40, left: 40, right: 0})
        .showLegend(false)
        .color(keyColor);

    chart.yAxis
        .showMaxMin(false)
        .tickFormat(d3.format(',.f'));

    chart.xAxis
        .showMaxMin(false)
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

    //just to make it look different
    testData[0].area = true;

    d3.select('#sources-chart-line svg')
        //.datum(sinAndCos())
        .datum(testData)
        .transition().duration(500)
        .call(chart);

    nv.utils.windowResize(chart.update);

    chart.legend.dispatch.on('legendClick.updateExamples', function() {
        setTimeout(function() {
            stackedChart.update();
        }, 100);
    });

    lineChart = chart;

    return chart;
});

nv.addGraph(function() {
    var chart = nv.models.pieChartTotal()
        .x(function(d) {return d.key })
        .margin({top: 0, right: 20, bottom: 20, left: 20})
        .values(function(d) {return [
            {
                key: "Audio",
                y: Math.floor((Math.random()*900)+200)
            },
            {
                key: "Video",
                y: Math.floor((Math.random()*500)+200)
            },
            {
                key: "Photo",
                y: Math.floor((Math.random()*1000)+200),
                z: Math.floor((Math.random()*10)+1)
            }
        ] })
        //.z(function(d){console.log(d); return d.z})
        .color(COLOR_VALUES)
        .showLabels(false)
        .showLegend(false)
        .tooltipContent(function(key, y, e, graph) {
            return '<h4>' + key + '</h4>' +
                '<p>' +  y + '</p>'
        })
//        .total(function(count, z_count){
//            return "<h4>"+ count + " files </h4>"
//                + "<h3>" + z_count + "Gb </h3>"
//        })
        .donut(true);
    chart.pie.margin({top: 10, bottom: -20});

    var sum = d3.sum(testData, function(d){
        return d.y;
    });
    d3.select("#sources-chart-pie")
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
            console.log(d);
            d.disabled = !d.disabled;
            d3.select(this)
                .classed("disabled", d.disabled);
            if (!chart.pie.values()(testData).filter(function(d) { return !d.disabled }).length) {
                chart.pie.values()(testData).map(function(d) {
                    d.disabled = false;
                    return d;
                });
                d3.select("#sources-chart-pie").selectAll('.control').classed('disabled', false);
            }
            d3.select("#sources-chart-pie svg").transition().call(chart)
        });

    d3.select("#sources-chart-pie svg")
        .datum([testData])
        .transition().call(chart);
    nv.utils.windowResize(chart.update);

    return chart;
});