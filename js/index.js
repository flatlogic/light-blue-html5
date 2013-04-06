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
            return "<p class='files-count'>"+ count + " files </p>"
                + "<p class='files-size'>" + z_count + "Gb </p>"
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

    /* Sparklines can also take their values from the first argument
     passed to the sparkline() function */
    function randomValue(){
        return Math.floor( Math.random() * 40 );
    }
    var values = [[],[],[],[],[],[]],
        options = {
            width: '100%',
            height: '100%',
            lineColor: '#777',
            fillColor: 'white',
            lineWidth: '2',
            spotRadius: '4',
            maxSpotColor: $orange,
            minSpotColor: $green,
            spotColor: $red,
            highlightLineColor: '#777',
            highlightSpotColor: $blue
        };
    for (var i = 0; i < values.length; i++){
        values[i] = [10 + randomValue(), 15 + randomValue(), 20 + randomValue(), 15 + randomValue(), 25 + randomValue(),
            25 + randomValue(), 30 + randomValue(), 30 + randomValue(), 40 + randomValue()]
    }

    function drawSparkLines(){
        var i = 0;
        $('.sparkline').each(function(){
            $(this).sparkline(values[i], options );
            i++;
        });
    }
    var sparkResize;

    $(window).resize(function(e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(drawSparkLines, 200);
    });
    drawSparkLines();
    $("input:checkbox").uniform();
});