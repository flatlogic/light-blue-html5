$(function() {

    class MorrisCharts {
        constructor() {

        }

        init() {
            this.createBarChart();
            this.createAreaChart();
            this.createDonutChart();
            this.createLineChart();
            this.createStackedBarChart();
            this.createBarChart2();
        }

        createAreaChart() {
            new Morris.Area({
                element: 'morris2',
                resize: true,
                data: [
                    {y: '2006', a: 100, b: 90},
                    {y: '2007', a: 75, b: 65},
                    {y: '2008', a: 50, b: 40},
                    {y: '2009', a: 75, b: 65},
                    {y: '2010', a: 50, b: 40},
                    {y: '2011', a: 75, b: 65},
                    {y: '2012', a: 100, b: 90}
                ],
                xkey: 'y',
                ykeys: ['a', 'b'],
                labels: ['Users A', 'Series B'],
                lineColors: [
                    Sing.colors['brand-info'],
                    Sing.colors['brand-warning']
                ],
                lineWidth: 0
            });
        }

        createLineChart() {
            new Morris.Line({
                element: 'morris1',
                resize: true,
                data: [
                    {y: '2006', a: 100, b: 90},
                    {y: '2007', a: 75, b: 65},
                    {y: '2008', a: 50, b: 40},
                    {y: '2009', a: 75, b: 65},
                    {y: '2010', a: 50, b: 40},
                    {y: '2011', a: 75, b: 65},
                    {y: '2012', a: 100, b: 90}
                ],
                xkey: 'y',
                ykeys: ['a', 'b'],
                labels: ['Series A', 'Series B'],
                lineColors: [
                    Sing.colors['brand-info'],
                    Sing.colors['brand-warning']
                ]
            });
        }

        createDonutChart() {
            new Morris.Donut({
                element: 'morris3',
                resize: true,
                data: [
                    {label: "Download Sales", value: 12},
                    {label: "In-Store Sales", value: 30},
                    {label: "Mail-Order Sales", value: 20}
                ],
                colors:[
                    Sing.colors['brand-danger'],
                    Sing.colors['brand-warning'],
                    Sing.colors['brand-info']
                ]
            });
        }

        createBarChart() {
            new Morris.Bar({
                element: 'morris4',
                resize: true,
                grid: false,
                data: [
                    {y: 4, x: 'Linux'},
                    {y: 12, x: 'MacOS'},
                    {y: 29, x: 'Windows'}
                ],
                xkey: 'x',
                ykeys: ['y'],
                labels: ['OS Users, %'],
                barColors: [Sing.colors['brand-info']],
                gridTextColor: Sing.colors['gray-400']
            });
        }

        createBarChart2() {
            new Morris.Bar({
                element: 'morris6',
                resize: true,
                grid: false,
                data: [
                    { y: '2014', a: 50, b: 90},
                    { y: '2015', a: 65,  b: 75},
                    { y: '2016', a: 50,  b: 50},
                    { y: '2017', a: 75,  b: 60},
                    { y: '2018', a: 80,  b: 65},
                    { y: '2019', a: 90,  b: 70},
                    { y: '2020', a: 100, b: 75},
                    { y: '2021', a: 115, b: 75},
                    { y: '2022', a: 120, b: 85},
                    { y: '2023', a: 145, b: 85},
                    { y: '2024', a: 160, b: 95}
                ],
                xkey: 'y',
                ykeys: ['a', 'b'],
                labels: ['Total Income', 'Total Outcome'],
                hideHover: 'auto',
                barColors: [
                    Sing.colors['brand-info'],
                    Sing.colors['brand-danger']
                ],
                gridTextColor: Sing.colors['gray-100']
            });
        }

        createStackedBarChart() {
            Morris.Bar({
                element: 'morris5',
                stacked: true,
                resize: true,
                data: [
                    { y: '2012', a: 3, c: 90, d: 0  },
                    { y: '2013', a: 2, c: 75, d: 14 },
                    { y: '2014', a: 3, c: 65, d: 4  },
                    { y: '2015', a: 3, c: 56, d: 20 },
                    { y: '2016', a: 5, c: 49, d: 30 },
                    { y: '2017', a: 4, c: 40, d: 36 },
                    { y: '2018', a: 5, c: 40, d: 35 }
                ],
                xkey: 'y',
                ykeys: ['a', 'b', 'c', 'd'],
                barColors: [
                    Sing.colors['brand-info'],
                    Sing.colors['brand-primary'],
                    Sing.colors['brand-warning'],
                    Sing.colors['brand-danger']
                ],
                labels: ['Linux', 'MacOS', 'Windows', 'Other'],
                hoverCallback: function (index, options, content, row) {
                    let keys = Object.keys(row).splice(1).sort();
                    let tooltip = `
                    <div class="card" style="width: 11rem;"><div class="card-body">
                        <h5 class="card-title">${row.y} OS Shares</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Statistics for most popular Operation Systems Usage</h6>`;

                    let rows = [];
                    keys.forEach((value, index) => {
                        rows.push(
                            (`<tr>
                              <td>${options.labels[index]}: </td>
                              <td>${row[value]}%</td>
                            </tr>`).trim()
                        )
                    });

                    tooltip += `<table class="table"><tbody>`;
                    tooltip += rows.join('');
                    tooltip += `</tbody></table></div></div>`;

                    return tooltip;
                },
                hideHover: 'auto'
            });
        }
    }

    function pageLoad() {
        $('.widget').widgster();

        let charts = new MorrisCharts();
        charts.init();
    }
    pageLoad();
    SingApp.onPageLoad(pageLoad);
});
