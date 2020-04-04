$(function () {
    "use strict";

    // create a custom bar renderer that has gaps
    Rickshaw.Graph.Renderer.BarNoGap = Rickshaw.Class.create( Rickshaw.Graph.Renderer.Bar, {
        name: 'bar_with_gaps',
        barWidth: function (series) {
            let frequentInterval = this._frequentInterval(series.stack);
            let barWidth = this.graph.x(series.stack[0].x + frequentInterval.magnitude / 2);
            return barWidth;
        }
    });

    class AbstractRickshawChart {
        constructor(seriesAmount = 1, seriesLength = 10, colors = Object.values(Sing.palette), bias = 1) {
            let data = getData(seriesAmount, seriesLength, bias);

            this._dataSeries = data.series;
            this._randomGenerator = data.random;
            this.colors = colors;
        }

        bindChartTo(container) {
            this.chartContainer = container;
            this.createChart(this._dataSeries);
            this.renderChart();
        }

        createChart(data) {}

        renderChart() {
            if (!this.chart)
                return;

            this.chart.render();
        }

        static resize(item) {
            let element = item.chartContainer;

            item.chart.configure({
                width: element.closest('.widget-body').getBoundingClientRect().width
            });
            item.chart.render();
        }
    }

    // --------------------- Scatterplot Chart ------------------------------

    class RickshawScatterplotChart extends AbstractRickshawChart {
        constructor(seriesAmount, seriesLength, colors) {
            super(seriesAmount, seriesLength, colors, 150);
        }

        bindOptionsToChart(series) {
            return new Rickshaw.Graph( {
                element: this.chartContainer,
                height: 250,
                renderer: 'scatterplot',
                series: series
            } );
        }

        createChart(data) {
            let series = data.map((item, i) => {
                return {
                    name: `Series ${i + 1}`,
                    color: this.colors[i % this.colors.length],
                    data: item,
                };
            });
            this.chart = this.bindOptionsToChart(series);
            this.chart.renderer.dotSize = 4;

            new Rickshaw.Graph.HoverDetail({ graph: this.chart });
        }

    }

    // --------------------- Area Chart ------------------------------

    class RickshawAreaChart extends AbstractRickshawChart {
        constructor(seriesAmount, seriesLength, colors) {
            super(seriesAmount, seriesLength, colors, 30);
        }

        createChart(data) {
            let series = data.map((item, i) => {
                return {
                    name: i ? 'Downloads' : 'Uploads',
                    color: this.colors[i % this.colors.length],
                    data: item,
                };
            });
            this.chart = this.bindOptionsToChart(series);

            let hoverDetail = new Rickshaw.Graph.HoverDetail({
                graph: this.chart,
                xFormatter: function (x) {
                    return new Date(x * 1000).toString();
                }
            });

            this.updateInterval = setInterval(() => {
                this._randomGenerator.removeData(data);
                this._randomGenerator.addData(data);
                this.chart.update();
            }, 1000);
        }

        bindOptionsToChart(series) {
            let self = this;

            return new Rickshaw.Graph( {
                element: self.chartContainer,
                height: 80,
                renderer: 'area',
                series: series
            } );
        }
    }

    // --------------------- Bar Chart ------------------------------

    class BarChart extends AbstractRickshawChart {
        constructor(seriesAmount, seriesLength, colors, options) {
            super(seriesAmount, seriesLength, colors, 150);

            this.options = options || {};
        }

        bindOptionsToChart(series) {
            let self = this;

            return new Rickshaw.Graph( {
                padding: this.options.padding || {},
                element: self.chartContainer,
                height: 180,
                renderer: 'bar_with_gaps',
                stack: this.options.stacked,
                series: series
            } );
        }

        createChart(data) {
            let series = data.map((item, i) => {
                return {
                    name: `Series ${i + 1}`,
                    color: this.colors[i % this.colors.length],
                    data: item,
                };
            });
            this.chart = this.bindOptionsToChart(series);

            new Rickshaw.Graph.HoverDetail({ graph: this.chart });
        }

    }

    // --------------------- Line Chart ------------------------------

    class LineChart extends AbstractRickshawChart {
        constructor(seriesAmount, seriesLength, colors) {
            super(seriesAmount, seriesLength, colors, 15);
        }

        bindOptionsToChart(series) {
            let self = this;

            return new Rickshaw.Graph({
                element: self.chartContainer,
                height: 200,
                renderer: 'line',
                min: 45,
                series: series
            });
        }

        createChart(data) {
            let series = data.map((item, i) => {
                return {
                    name: `Series ${i + 1}`,
                    color: this.colors[i % this.colors.length],
                    data: item,
                };
            });
            this.chart = this.bindOptionsToChart(series);

            new Rickshaw.Graph.HoverDetail({ graph: this.chart });
            new Rickshaw.Graph.Axis.Y( {
                graph: this.chart,
                orientation: 'left',
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                element: document.getElementById('y_axis')
            });
        }
    }

    let charts = [];

    function init() {
        $('.widget').widgster();

        let scatterplotChart = new RickshawScatterplotChart(2, 200, [
            Sing.colors['brand-danger'],
            Sing.colors['brand-primary']
        ]);
        let areaChart = new RickshawAreaChart(2, 30, [
            Sing.colors['brand-primary'],
            Sing.colors['brand-danger'],
        ]);
        let stackedBarChart = new BarChart(3, 10, [
            Sing.colors['brand-primary'],
            Sing.colors['brand-success'],
            Sing.colors['brand-danger']
        ], {stacked: true, padding: {left: 0.03}});
        let barChart = new BarChart(2, 15, [
            Sing.colors['brand-success'],
            Sing.colors['brand-danger']
        ], {padding: {left: 0.02}});
        let lineChart = new LineChart(2, 50, [
            Sing.colors['brand-primary'],
            Sing.colors['brand-primary']
        ]);

        scatterplotChart
            .bindChartTo(document.getElementById("rickshaw"));
        areaChart
            .bindChartTo(document.getElementById("rickshaw2"));
        stackedBarChart
            .bindChartTo(document.getElementById("rickshaw3"));
        barChart
            .bindChartTo(document.getElementById("rickshaw4"));
        lineChart
            .bindChartTo(document.getElementById("rickshaw5"));

        charts = [scatterplotChart, areaChart, stackedBarChart, barChart, lineChart];
    }

    SingApp.onPageLoad(init);
    SingApp.onResize(() => {
        charts.forEach(AbstractRickshawChart.resize);
    });
    init();

});

function getData(seriesAmount, seriesLength, bias = 1) {
    let series = [];
    let random = new Rickshaw.Fixtures.RandomData(bias);

    while (seriesAmount > 0) {
        series.push([]);
        seriesAmount--;
    }

    for (let i = 0; i < seriesLength; i++) {
        random.addData(series);
    }

    return {series, random};
}
