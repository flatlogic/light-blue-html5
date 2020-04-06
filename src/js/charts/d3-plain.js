$(function () {

    'use strict';

    const COLORS = Object.values(Sing.newPalette);

    function initD3_2(d3) {
        let container = document.getElementById('d3-2');
        let dataset = [53245, 28479, 19697, 24037, 40245];

        let width = container.getBoundingClientRect().width,
            height = container.getBoundingClientRect().height,
            radius = Math.min(width, height) / 2;

        let enterClockwise = {
            startAngle: 0,
            endAngle: 0
        };

        let pie = d3.pie()
            .sort(null);

        let arc = d3.arc()
            .innerRadius(radius * 0.8)
            .outerRadius(radius * 0.6);

        let svg = d3.select('#d3-2').append('svg')
            .attr("width", '100%')
            .attr("height", '100%')
            .attr('viewBox', (-width / 2) + ' ' + (-height / 2) + ' ' + width + ' ' + height)
            .attr('preserveAspectRatio', 'xMinYMin');

        let path = svg.selectAll("path")
            .data(pie(dataset))
            .enter().append("path")
            .attr("fill", function (d, i) {
                return COLORS[(i + 2) % COLORS.length];
            })
            .attr("d", arc(enterClockwise))
            .each(function (d) {
                this._current = {
                    data: d.data,
                    value: d.value,
                    startAngle: enterClockwise.startAngle,
                    endAngle: enterClockwise.endAngle
                }
            });

        path.transition()
            .duration(750)
            .attrTween("d", arcTween);

        function arcTween(a) {
            let i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        }
    }

    function initD3_3(d3) {
        let n = 8, // number of layers
            m = 100, // number of samples per layer
            k = 3; // number of bumps per layer

        let stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetWiggle),
            layers0 = stack(d3.transpose(d3.range(n).map(function () {
                return bumps(m, k);
            }))),
            layers1 = stack(d3.transpose(d3.range(n).map(function () {
                return bumps(m, k);
            }))),
            layers = layers0.concat(layers1);

        let svg = d3.select("#d3-3 svg"),
            width = +svg.node().getBoundingClientRect().width,
            height = +svg.attr("height");

        let x = d3.scaleLinear()
            .domain([0, m - 1])
            .range([0, width]);

        let y = d3.scaleLinear()
            .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
            .range([height, 0]);

        let area = d3.area()
            .x(function (d, i) {
                return x(i);
            })
            .y0(function (d) {
                return y(d[0]);
            })
            .y1(function (d) {
                return y(d[1]);
            });

        svg.append('g').attr('class', 'areas');
        svg.append('g').attr('class', 'labelName');

        svg.select('.areas').selectAll("path")
            .data(layers0)
            .enter().append("path")
            .attr("d", area)
            .attr("fill", function (data, index, path) {
                return COLORS[(COLORS.length - index) % COLORS.length];
            });

        function stackMax(layer) {
            return d3.max(layer, function (d) {
                return d[1];
            });
        }

        function stackMin(layer) {
            return d3.min(layer, function (d) {
                return d[0];
            });
        }

        function transition() {
            let t;
            d3.select('.areas').selectAll("path")
                .data((t = layers1, layers1 = layers0, layers0 = t))
                .transition()
                .duration(2500)
                .attr("d", area);
        }

        // Inspired by Lee Byron’s test data generator.
        function bumps(n, m) {
            let a = [], i;
            for (i = 0; i < n; ++i) a[i] = 0;
            for (i = 0; i < m; ++i) bump(a, n);
            return a;
        }

        function bump(a, n) {
            let x = 1 / (0.1 + Math.random()),
                y = 2 * Math.random() - 0.5,
                z = 10 / (0.1 + Math.random());
            for (let i = 0; i < n; i++) {
                let w = (i / n - y) * z;
                a[i] += x * Math.exp(-w * w);
            }
        }

        let updateInterval = setInterval(() => {
            transition();
        }, 5000);

        $(document).on('pjax:start', () => {
            clearInterval(updateInterval);
        });
    }

    function initD3_4(d3) {
        let chartContainer = d3.select("#d3-4");

        let margin = {top: 30, right: 10, bottom: 50, left: 60},
            width = chartContainer.node().getBoundingClientRect().width - margin.left - margin.right,
            height = chartContainer.node().getBoundingClientRect().height - margin.top - margin.bottom,
            padding = 0.3;

        let xScale = d3.scaleBand()
            .rangeRound([0, width])
            .padding(padding);

        let yScale = d3.scaleLinear()
            .range([height, 0]);

        let xAxis = d3.axisBottom()
            .scale(xScale);

        let yAxis = d3.axisLeft()
            .scale(yScale)
            .tickFormat(function (d) {
                return dollarFormatter(d);
            });

        let chart = chartContainer
            .select('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let data = [
            {name: 'Product Revenue', value: 420000},
            {name: 'Services Revenue', value: 210000},
            {name: 'Fixed Costs', value: -170000},
            {name: 'Variable Costs', value: -140000},
        ];

        // Transform data (i.e., finding cumulative values and total) for easier charting
        let cumulative = 0;
        for (let i = 0; i < data.length; i++) {
            data[i].start = cumulative;
            cumulative += data[i].value;
            data[i].end = cumulative;

            data[i].class = (data[i].value >= 0) ? 'positive' : 'negative'
        }
        data.push({
            name: 'Total',
            end: cumulative,
            start: 0,
            class: 'total'
        });

        xScale.domain(data.map(function (d) {
            return d.name;
        }));
        yScale.domain([0, d3.max(data, function (d) {
            return d.end;
        })]);

        chart.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll(".tick text")
            .call(wrap, xScale.bandwidth())
            .style("font", "100 0.8rem Montserrat")
            .style("fill", Sing.colors['gray-500']);

        chart.append("g")
            .attr("class", "y-axis")
            .call(yAxis.ticks(5))
            .selectAll('text')
            .style("font", "100 0.8rem Montserrat")
            .style("fill", Sing.colors['gray-500']);

        let bar = chart.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", function (d) {
                return "bar " + d.class
            })
            .attr("transform", function (d) {
                return "translate(" + xScale(d.name) + ",0)";
            });

        bar.append("rect")
            .attr("y", function (d) {
                return yScale(Math.max(d.start, d.end));
            })
            .attr("height", function (d) {
                return Math.abs(yScale(d.start) - yScale(d.end));
            })
            .attr("width", xScale.bandwidth());

        bar.append("text")
            .attr("x", xScale.bandwidth() / 2)
            .attr("y", function (d) {
                return (d.class === 'negative') ? yScale(d.start) : yScale(d.end);
            })
            .attr("dy", function (d) {
                return -margin.top / 2;
            })
            .text(function (d) {
                return dollarFormatter(d.end - d.start);
            })
            .style("font", "100 1.1rem Montserrat")
            .style("fill", Sing.colors['gray-500']);

        bar.selectAll('text')
            .attr('text-anchor', 'middle');

        bar.filter(function (d) {
            return d.class !== "total"
        }).append("line")
            .attr("class", "connector")
            .attr("x1", xScale.bandwidth() + 5)
            .attr("y1", function (d) {
                return yScale(d.end)
            })
            .attr("x2", xScale.bandwidth() / (1 - padding) - 5)
            .attr("y2", function (d) {
                return yScale(d.end)
            });

        bar.filter((d) => d.class === "positive")
            .selectAll("rect")
            .attr("fill", () => Sing.colors['brand-primary']);

        bar.filter((d) => d.class === "negative")
            .selectAll("rect")
            .attr("fill", () => Sing.colors['brand-success']);

        bar.filter((d) => d.class === "total")
            .selectAll("rect")
            .attr("fill", () => Sing.colors['brand-danger']);

        bar.selectAll("line.connector")
            .attr("stroke", () => Sing.colors['gray-400'])
            .attr("stroke-dasharray", 3);

        function dollarFormatter(n) {
            n = Math.round(n);
            let result = n;
            if (Math.abs(n) > 1000) {
                result = Math.round(n / 1000) + 'K';
            }
            return '$' + result;
        }

        function wrap(text, width) {
            text.each(function() {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }

    }

    function initD3_5(d3) {
        let chartContainer = d3.select('#d3-5');
        let data = [[
            {date: '1-May-17', close: '58.13'},
            {date: '1-Jun-17', close: '53.98'},
            {date: '1-Jul-17', close: '67.00'},
            {date: '1-Aug-17', close: '89.70'},
            {date: '1-Sep-17', close: '99.00'},
            {date: '1-Oct-17', close: '130.28'},
            {date: '1-Nov-17', close: '166.70'},
            {date: '1-Dec-17', close: '234.98'},
            {date: '1-Jan-18', close: '205.44'},
            {date: '1-Feb-18', close: '443.34'}
        ], [
            {date: '1-May-17', close: '198.73'},
            {date: '1-Jun-17', close: '183.08'},
            {date: '1-Jul-17', close: '177.60'},
            {date: '1-Aug-17', close: '300.70'},
            {date: '1-Sep-17', close: '345.00'},
            {date: '1-Oct-17', close: '350.28'},
            {date: '1-Nov-17', close: '350.70'},
            {date: '1-Dec-17', close: '230.98'},
            {date: '1-Jan-18', close: '260.44'},
            {date: '1-Feb-18', close: '380.34'}
        ]];
        // set the dimensions and margins of the graph
        let margin = {top: 10, right: 10, bottom: 20, left: 60},
            width = chartContainer.node().getBoundingClientRect().width - margin.left - margin.right,
            height = chartContainer.node().getBoundingClientRect().height - margin.top - margin.bottom;

        // parse the date / time
        let parseTime = d3.timeParse("%d-%b-%y");

        // set the ranges
        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        // define the first line
        let valueline = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.close);
            });

        // define the second line
        let valueline2 = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.close);
            });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        let svg = chartContainer.select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // format the data
        data.forEach((item) => {
            item.forEach(function (d) {
                d.date = parseTime(d.date);
                d.close = +d.close;
            });
        });

        // Scale the range of the data
        x.domain(d3.extent(data[0], function (d) {
            return d.date;
        }));
        y.domain([0, d3.max(data[0], function (d) {
            return d.close;
        })]);

        // Add the valueline path.
        svg.append("path")
            .data([data[0]])
            .attr("class", "line")
            .attr("d", valueline)
            .attr('fill', 'none')
            .attr('stroke', Sing.colors['brand-primary'])
            .attr('stroke-width', 2);

        // Add the valueline2 path.
        svg.append("path")
            .data([data[1]])
            .attr("class", "line2")
            .attr("d", valueline2)
            .attr('fill', 'none')
            .attr('stroke', Sing.colors['brand-info'])
            .attr('stroke-width', 2);

        // Add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(width < 600 ? 5 : 10))
            .selectAll('text')
            .style("font", "100 1rem Montserrat")
            .style("fill", Sing.colors['gray-500']);

        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Date");

        // Add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y).ticks(4))
            .selectAll('text')
            .style("font", "100 1rem Montserrat")
            .style("fill", Sing.colors['gray-500']);

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1rem")
            .style("text-anchor", "middle")
            .style("font", "100 1rem Montserrat")
            .style("fill", Sing.colors['gray-500'])
            .text("Value");
    }

    function initD3_6(d3) {
        let chartContainer = document.getElementById('d3-6');
        let dataset = [
            {title: 'Engineers', amount: '58.13'},
            {title: 'Managers', amount: '53.98'},
            {title: 'Sales', amount: '67.00'},
            {title: 'Market Researchers', amount: '89.70'},
            {title: 'BA', amount: '99.00'},
            {title: 'Other Employees', amount: '130.28'}
        ];

        let width = chartContainer.getBoundingClientRect().width,
            height = chartContainer.getBoundingClientRect().height,
            radius = Math.min(width, height) / 2;

        let enterClockwise = {
            startAngle: 0,
            endAngle: 0
        };

        let pie = d3.pie()
            .sort(null)
            .value(function (d) {
                return d.amount;
            });

        let arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius * 0.8);

        let svg = d3.select('#d3-6').append('svg')
            .attr("width", '100%')
            .attr("height", '100%')
            .attr('viewBox', (-width / 2) + ' ' + (-height / 2) + ' ' + width + ' ' + height)
            .attr('preserveAspectRatio', 'xMinYMin');

        svg.append("g")
            .attr("class", "slices");
        svg.append("g")
            .attr("class", "labels");
        svg.append("g")
            .attr("class", "lines");

        let path = svg.select(".slices")
            .selectAll("path.slice")
            .data(pie(dataset))
            .enter().append("path")
            .attr("class", function (d) {
                return "slice-" + d.index
            })
            .attr("fill", function (d, i) {
                return COLORS[(COLORS.length - i) % COLORS.length];
            })
            .attr("d", arc(enterClockwise))
            .each(function (d) {
                this._current = {
                    data: d.data,
                    value: d.value,
                    startAngle: enterClockwise.startAngle,
                    endAngle: enterClockwise.endAngle
                }
            });

        path.transition()
            .duration(750)
            .attrTween("d", arcTween);

        function arcTween(a) {
            let i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        }

    }

    function initD3_1(d3) {
        let chartContainer = d3.select('#d3-1');
        let svg = chartContainer.select("svg"),
            margin = {top: 30, right: 20, bottom: 30, left: 50},
            width = chartContainer.node().getBoundingClientRect().width - margin.left - margin.right,
            height = chartContainer.node().getBoundingClientRect().height - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let rows =
            `CA TX NY FL IL PA OH MI GA NC NJ VA WA AZ MA IN TN MO MD WI MN CO AL SC LA`.split(' ');
        let columns =
            `Under 5 Years,5 to 13 Years,14 to 17 Years,18 to 24 Years,25 to 44 Years,45 to 64 Years,65 Years and Over`.split(',');
        let data = rows.map((state, i) => {
            let population = [310504, 552339, 259034, 450818, 1231572, 1215966, 641667].map((n) => {
                return n / (i || 1) * Math.random();
            });

            let dataSeries = {};

            columns.forEach((group, j) => {
                dataSeries[group] = population[j]
            });

            dataSeries['state'] = state;

            dataSeries.total = population.reduce((previousValue, currentValue) => {
                return previousValue + currentValue;
            }, 0);

            return dataSeries;
        }).sort((a, b) => (b.total - a.total));

        if (width < 800)
            data.splice(data.length / 2);

        let x = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.05)
            .align(0.1);

        let y = d3.scaleLinear()
            .rangeRound([height, 0]);

        let z = d3.scaleOrdinal()
            .range(COLORS.slice(0,5).concat(COLORS.slice(5)));

        x.domain(data.map(function (d) {
            return d.state;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.total;
        })]).nice();
        z.domain(columns);

        let stack = d3.stack().keys(columns);

        g.append("g")
            .selectAll("g")
            .data(stack(data))
            .enter().append("g")
            .attr("fill", function (d) {
                return z(d.key);
            })
            .selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return x(d.data.state);
            })
            .attr("y", function (d) {
                return y(d[1]);
            })
            .attr("height", function (d) {
                return y(d[0]) - y(d[1]);
            })
            .attr("width", x.bandwidth() - 10);

        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style("font", "100 0.95rem Montserrat")
            .style("fill", Sing.colors['gray-500']);

        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).ticks(5, "s"))
            .selectAll('text')
            .style("font", "100 0.95rem Montserrat")
            .style("fill", Sing.colors['gray-500']);

        g.select(".y-axis").append("text")
            .attr("x", 26)
            .attr("y", y(y.ticks().pop()) - 30)
            .attr("dy", "1rem")
            .style("font", "300 0.95rem Montserrat")
            .style("fill", Sing.colors['gray-600'])
            .attr("text-anchor", "end")
            .text("Population");

        let legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", '1rem')
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(columns.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 30 + ")";
            });

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .style("font", "300 0.95rem Montserrat")
            .style("fill", Sing.colors['gray-500'])
            .text(function (d) {
                return d;
            });
    }

    function init() {
        const d3v5 = window.d3VersionWrapper.d3v5;

        $('.widget').widgster();

        initD3_1(d3v5);
        initD3_2(d3v5);
        initD3_3(d3v5);
        initD3_4(d3v5);
        initD3_5(d3v5);
        initD3_6(d3v5);

        // Set colors for yScale and xScale
        d3v5.selectAll('.domain')
            .attr("stroke", Sing.colors['gray-400']);

        // Set colors for yScale ticks and xScale ticks
        d3v5.selectAll('.tick line')
            .attr("stroke", Sing.colors['gray-400']);
    }

    SingApp.onResize(() => {
        setTimeout(() => {
            document.querySelectorAll(".chart-container").forEach((el) => {
                el.innerHTML = '';
            });

            init();
        }, 500);
    });
    SingApp.onPageLoad(init);
    init();
});