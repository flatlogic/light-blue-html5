$(function() {
  function initPointSparkline($el, data) {
    $el.sparkline(data, {
      type: "line",
      width: "100%",
      height: "60",
      lineColor: Sing.colors["brand-primary"],
      fillColor: "transparent",
      spotRadius: 5,
      spotColor: Sing.colors["brand-success"],
      valueSpots: { "0:": Sing.colors["brand-success"] },
      highlightSpotColor: Sing.colors["brand-success"],
      highlightLineColor: Sing.colors["brand-success"],
      minSpotColor: Sing.colors["brand-success"],
      maxSpotColor: Sing.colors["brand-danger"],
      tooltipFormat: new $.SPFormatClass(
        '<span style="color: #58d777">&#9679;</span> {{prefix}}{{y}}{{suffix}}'
      ),
      chartRangeMin: _(data).min() - 1
    });
  }

  function initSimpleChart() {
    initPointSparkline($("#chart-simple"), [4, 6, 5, 7, 5]);
    SingApp.onResize(function() {
      initPointSparkline($("#chart-simple"), [4, 6, 5, 7, 5]);
    });
  }

  function initChangesChart() {
    var chartHeight = 100;
    var seriesData = [[], [], [], [], []];
    var random = new Rickshaw.Fixtures.RandomData(10000);

    for (var i = 0; i < 32; i++) {
      random.addData(seriesData);
    }

    var graph = new Rickshaw.Graph({
      element: document.getElementById("chart-changes"),
      renderer: "multi",
      height: chartHeight,
      series: [
        {
          name: "pop",
          data: seriesData.shift().map(function(d) {
            return { x: d.x, y: d.y };
          }),
          color: Sing.colors["brand-primary"],
          renderer: "bar"
        },
        {
          name: "humidity",
          data: seriesData.shift().map(function(d) {
            return { x: d.x, y: d.y * (Math.random() * 0.1 + 1.1) };
          }),
          renderer: "line",
          color: Sing.colors["white"]
        }
      ]
    });

    function onResize() {
      var $chart = $("#chart-changes");
      graph.configure({
        width: $chart.width(),
        height: chartHeight,
        gapSize: 0.5,
        min: "auto",
        strokeWidth: 3
      });
      graph.render();

      $chart.find("svg").css({ height: chartHeight + "px" });
    }

    SingApp.onResize(onResize);
    onResize();

    var detail = new Rickshaw.Graph.HoverDetail({
      graph: graph
    });

    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
      graph: graph
    });

    var yAxis = new Rickshaw.Graph.Axis.Y({
      graph: graph,
      ticksTreatment: "hide",
      pixelsPerTick: chartHeight
    });

    yAxis.render();
  }

  function initChangesYearChart() {
    var $el = $("#chart-changes-year"),
      data = [3, 6, 2, 4, 5, 8, 6, 8],
      dataMax = _(data).max(),
      backgroundData = data.map(function() {
        return dataMax;
      });

    $el.sparkline(backgroundData, {
      type: "bar",
      height: 26,
      barColor: 'transparent',
      barWidth: 7,
      barSpacing: 5,
      chartRangeMin: _(data).min(),
      tooltipFormat: new $.SPFormatClass("")
    });

    $el.sparkline(data, {
      composite: true,
      type: "bar",
      barColor: Sing.colors["brand-success"],
      barWidth: 7,
      barSpacing: 5
    });
  }

  function initSalesChart() {
    //todo rewrite
    function random() {
      return Math.floor(Math.random() * 30) + 10;
    }
    var data1 = [],
      data2 = [];

    for (var i = 0; i < 25; i++) {
      data1.push([i, Math.floor(5 * i) + random()]);
    }
    for (i = 0; i < 25; i++) {
      data2.push([i, Math.floor(4 * i) + random()]);
    }

    function _initChart() {
      $.plot(
        $("#chart-stats-simple"),
        [
          {
            data: data2,
            showLabels: true,
            label: "Visitors",
            labelPlacement: "below",
            canvasRender: true,
            cColor: "#FFFFFF"
          },
          {
            data: data1,
            showLabels: true,
            label: "Test Visitors",
            labelPlacement: "below",
            canvasRender: true,
            cColor: "#FFFFFF"
          }
        ],
        {
          series: {
            lines: {
              show: true,
              lineWidth: 1,
              fill: false,
              fillColor: { colors: [{ opacity: 0.001 }, { opacity: 0.5 }] }
            },
            points: {
              show: false,
              fill: true
            },
            shadowSize: 0
          },
          legend: false,
          grid: {
            show: false,
            margin: 0,
            labelMargin: 0,
            axisMargin: 0,
            hoverable: true,
            clickable: true,
            tickColor: "rgba(255,255,255,1)",
            borderWidth: 0
          },
          colors: [
            Sing.darken(Sing.colors["brand-success"], 0.05),
            Sing.colors["brand-primary"]
          ]
        }
      );
    }

    _initChart();

    SingApp.onResize(_initChart);
  }

  function initSalesChart2() {
    //todo rewrite
    function random() {
      return Math.floor(Math.random() * 30) + 10;
    }
    var data1 = [],
      data2 = [];

    for (var i = 0; i < 25; i++) {
      data1.push([i, Math.floor(5 * i) + random()]);
    }
    for (i = 0; i < 25; i++) {
      data2.push([i, Math.floor(4 * i) + random()]);
    }
    function _initChart() {
      $.plot(
        $("#chart-stats-simple-2"),
        [
          {
            data: data2,
            showLabels: true,
            label: "Visitors",
            labelPlacement: "below",
            canvasRender: true,
            cColor: "#FFFFFF"
          },
          {
            data: data1,
            showLabels: true,
            label: "Test Visitors",
            labelPlacement: "below",
            canvasRender: true,
            cColor: "#FFFFFF"
          }
        ],
        {
          series: {
            lines: {
              show: true,
              lineWidth: 1,
              fill: false,
              fillColor: { colors: [{ opacity: 0.001 }, { opacity: 0.5 }] }
            },
            points: {
              show: false,
              fill: true
            },
            shadowSize: 0
          },
          legend: false,
          grid: {
            show: false,
            margin: 0,
            labelMargin: 0,
            axisMargin: 0,
            hoverable: true,
            clickable: true,
            tickColor: "rgba(255,255,255,1)",
            borderWidth: 0
          },
          colors: [Sing.colors["brand-success"], Sing.colors["brand-danger"]]
        }
      );
    }

    _initChart();

    SingApp.onResize(_initChart);
  }

  function initRealTime1() {
    "use strict";

    var seriesData = [[], []];
    var random = new Rickshaw.Fixtures.RandomData(30);

    for (var i = 0; i < 30; i++) {
      random.addData(seriesData);
    }

    var graph = new Rickshaw.Graph({
      element: document.getElementById("realtime1"),
      height: 130,
      renderer: "area",
      series: [
        {
          color: Sing.colors["brand-success"],
          data: seriesData[0],
          name: "Uploads"
        },
        {
          color: Sing.colors["brand-primary"],
          data: seriesData[1],
          name: "Downloads"
        }
      ]
    });

    function onResize() {
      var $chart = $("#realtime1");
      graph.configure({
        width: $chart.width(),
        height: 130
      });
      graph.render();

      //safari svg height fix
      $chart.find("svg").css({ height: "130px" });
    }

    SingApp.onResize(onResize);
    onResize();

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: graph,
      xFormatter: function(x) {
        return new Date(x * 1000).toString();
      }
    });

    setInterval(function() {
      random.removeData(seriesData);
      random.addData(seriesData);
      graph.update();
    }, 1000);
  }

  function initYearsMap() {
    var $map = $("#map-years-mapael");
    $map
      .css("height", 394)
      .css("margin-bottom", -20)
      .find(".map")
      .css("height", parseInt($map.parents(".widget").css("height")) - 40);
    $map.mapael({
      map: {
        name: "world_countries",
        defaultArea: {
          attrs: {
            fill: "#354d84",
            stroke: "#6979c9",
            "stroke-width": 0.25
          },
          attrsHover: {
            fill: "#6473bf",
            animDuration: 100
          }
        },
        defaultPlot: {
          size: 17,
          attrs: {
            fill: Sing.colors["brand-warning"],
            stroke: Sing.colors["white"],
            "stroke-width": 0,
            "stroke-linejoin": "round"
          },
          attrsHover: {
            "stroke-width": 1,
            animDuration: 100
          }
        },
        zoom: {
          enabled: true,
          step: 1,
          maxLevel: 10
        }
      },
      legend: {
        area: {
          display: false,
          slices: [
            {
              max: 5000000,
              attrs: {
                fill: "#4a518b"
              },
              label: "Less than 5M"
            },
            {
              min: 5000000,
              max: 10000000,
              attrs: {
                fill: "#4265a9"
              },
              label: "Between 5M and 10M"
            },
            {
              min: 10000000,
              max: 50000000,
              attrs: {
                fill: "#41548f"
              },
              label: "Between 10M and 50M"
            },
            {
              min: 50000000,
              attrs: {
                fill: "#354d84"
              },
              label: "More than 50M"
            }
          ]
        }
      },
      areas: fakeWorldData[2009]["areas"]
    });
    var coords = $.fn.mapael.maps["world_countries"].getCoords(
      59.599254,
      8.863224
    );
    $map.trigger("zoom", [6, coords.x, coords.y]);

    $map.find(".map-controls > li > a").on("click", function() {
      $(".map-controls > li").removeClass("active");
      $(this)
        .parents("li")
        .addClass("active");
      $map.trigger("update", [
        fakeWorldData[$(this).data("years-map-year")],
        {},
        {},
        { animDuration: 300 }
      ]);
      return false;
    });
  }

  function initTiles() {
    $(".live-tile")
      .css("height", function() {
        return $(this).data("height");
      })
      .liveTile();

    $(document).one("pjax:beforeReplace", function() {
      $(".live-tile")
        .liveTile("destroy", true)
        .each(function() {
          var data = $(this).data("LiveTile");
          if (typeof data === "undefined") return;
          clearTimeout(data.eventTimeout);
          clearTimeout(data.flCompleteTimeout);
          clearTimeout(data.completeTimeout);
        });
    });
  }

  function initWeather() {
    var icons = new Skycons({ color: Sing.colors["white"] });
    icons.set("clear-day", "clear-day");
    icons.play();

    icons = new Skycons({ color: Sing.colors["white"] });
    icons.set("partly-cloudy-day", "partly-cloudy-day");
    icons.play();

    icons = new Skycons({ color: Sing.colors["white"] });
    icons.set("rain", "rain");
    icons.play();

    icons = new Skycons({
      color: Sing.lighten(Sing.colors["brand-danger"], 0.4)
    });
    icons.set("clear-day-3", "clear-day");
    icons.play();

    icons = new Skycons({ color: Sing.colors["white"] });
    icons.set("partly-cloudy-day-3", "partly-cloudy-day");
    icons.play();

    icons = new Skycons({ color: Sing.colors["white"] });
    icons.set("clear-day-1", "clear-day");
    icons.play();

    icons = new Skycons({ color: Sing.colors["brand-success"] });
    icons.set("partly-cloudy-day-1", "partly-cloudy-day");
    icons.play();

    icons = new Skycons({ color: Sing.colors["gray-600"] });
    icons.set("clear-day-2", "clear-day");
    icons.play();

    icons = new Skycons({ color: Sing.colors["gray-400"] });
    icons.set("wind-1", "wind");
    icons.play();

    icons = new Skycons({ color: Sing.colors["gray-400"] });
    icons.set("rain-1", "rain");
    icons.play();
  }

  function pageLoad() {
    $(".widget").widgster();
    initSimpleChart();
    initChangesChart();
    initChangesYearChart();
    initSalesChart();
    initSalesChart2();
    initRealTime1();
    initYearsMap();
    initTiles();
    initWeather();
  }

  pageLoad();
  SingApp.onPageLoad(pageLoad);
});
