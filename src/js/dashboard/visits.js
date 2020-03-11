$(function(){

    function initMap(){
        var $map = $('#map'),
            state;
        $map.mapael({
            map:{
                name : "usa_states",
                defaultArea : {
                    attrs: {
                        fill: '#474d84',
                        stroke: '#6979c9',
                    },
                    attrsHover: {
                        fill: '#354d84',
                        animDuration : 100
                    },
                    tooltip: {
                        content: function(){
                            return '<strong>' + state + '</strong>';
                        }
                    },
                    eventHandlers: {
                        mouseover: function(e, id){
                            state = id;
                        }
                    }
                },
                defaultPlot:{
                    size: 17,
                    attrs : {
                        fill : "#c7d0ff",
                        stroke : Sing.colors['white'],
                        "stroke-width" : 0,
                        "stroke-linejoin" : "round"
                    },
                    attrsHover : {
                        "stroke-width" : 1,
                        animDuration : 100
                    }
                },
                zoom : {
                    enabled : true,
                    step : 0.75
                }
            },
            plots:{
                'New York' : {
                    latitude: 40.717079,
                    longitude: -74.00116,
                    tooltip: {content : "New York"}
                },
                'on' : {
                    latitude: 33.145235,
                    longitude: -83.811834,
                    size: 18,
                    tooltip: {content : "Oconee National Forest"}
                },
                'sf' : {
                    latitude: 37.792032,
                    longitude: -122.394613,
                    size: 12,
                    tooltip: {content : "San Francisco"}
                },
                'la' : {
                    latitude: 26.935080,
                    longitude: -80.851766,
                    size: 26,
                    tooltip: {content : "Lake Okeechobee"}
                },
                'gc' : {
                    latitude: 36.331308,
                    longitude: -83.336050,
                    size: 10,
                    tooltip: {content : "Grainger County"}
                },
                'cc' : {
                    latitude: 36.269356,
                    longitude: -76.587477,
                    size: 22,
                    tooltip: {content : "Chowan County"}
                },
                'll' : {
                    latitude: 30.700644,
                    longitude: -95.145249,
                    tooltip: {content : "Lake Livingston"}
                },
                'tc' : {
                    latitude: 34.546708,
                    longitude: -90.211471,
                    size: 14,
                    tooltip: {content : "Tunica County"}
                },
                'lc' : {
                    latitude: 32.628599,
                    longitude: -103.675115,
                    tooltip: {content : "Lea County"}
                },
                'uc' : {
                    latitude: 40.456692,
                    longitude: -83.522688,
                    size: 11,
                    tooltip: {content : "Union County"}
                },
                'lm' : {
                    latitude: 33.844630,
                    longitude: -118.157483,
                    tooltip: {content : "Lakewood Mutual"}
                }
            }
        });

        //ie svg height fix
        function _fixMapHeight(){
            $map.find('svg').css('height', function(){
                return $(this).attr('height') + 'px';
            });
        }

        _fixMapHeight();
        SingApp.onResize(function(){
            setTimeout(function(){
                _fixMapHeight();
            }, 100)
        });
    }

    function initCalendar(){

        var monthNames = ["January", "February", "March", "April", "May", "June",  "July", "August", "September", "October", "November", "December"];

        var dayNames = ["S", "M", "T", "W", "T", "F", "S"];

        var now = new Date(),
            month = now.getMonth() + 1,
            year = now.getFullYear();

        var events = [
            [
                    "2/"+month+"/"+year,
                'The flower bed',
                '#',
                Sing.colors['brand-primary'],
                'Contents here'
            ],
            [
                    "5/"+month+"/"+year,
                'Stop world water pollution',
                '#',
                Sing.colors['brand-warning'],
                'Have a kick off meeting with .inc company'
            ],
            [
                    "18/"+month+"/"+year,
                'Light Blue 2.2 release',
                '#',
                Sing.colors['brand-success'],
                'Some contents here'
            ],
            [
                    "29/"+month+"/"+year,
                'A link',
                'http://www.flatlogic.com',
                Sing.colors['brand-danger']
            ]
        ];
        var $calendar = $('#events-calendar');
        $calendar.calendar({
            months: monthNames,
            days: dayNames,
            events: events,
            popover_options:{
                placement: 'top',
                html: true
            }
        });
        $calendar.find('.icon-arrow-left').addClass('fa fa-arrow-left');
        $calendar.find('.icon-arrow-right').addClass('fa fa-arrow-right');
        function restyleCalendar(){
            $calendar.find('.event').each(function(){
                var $this = $(this),
                    $eventIndicator = $('<span></span>');
                $eventIndicator.css('background-color', $this.css('background-color')).appendTo($this.find('a'));
                $this.css('background-color', '');
            })
        }
        $calendar.find('.icon-arrow-left, .icon-arrow-right').parent().on('click', restyleCalendar);
        restyleCalendar();
    }

    function initRickshaw(){
        "use strict";

        var seriesData = [ [], [] ];
        var random = new Rickshaw.Fixtures.RandomData(30);

        for (var i = 0; i < 30; i++) {
            random.addData(seriesData);
        }

        var graph = new Rickshaw.Graph( {
            element: document.getElementById("rickshaw"),
            height: 100,
            renderer: 'area',
            series: [
                {
                    color: Sing.colors['brand-primary'],
                    data: seriesData[0],
                    name: 'Uploads'
                }, {
                    color: Sing.colors['brand-success'],
                    data: seriesData[1],
                    name: 'Downloads'
                }
            ]
        } );

        function onResize(){
            var $chart = $('#rickshaw');
            graph.configure({
                width: $chart.width(),
                height: 100
            });
            graph.render();

            $chart.find('svg').css({height: '100px'})
        }

        SingApp.onResize(onResize);
        onResize();


        var hoverDetail = new Rickshaw.Graph.HoverDetail( {
            graph: graph,
            xFormatter: function(x) {
                return new Date(x * 1000).toString();
            }
        } );

        setInterval( function() {
            random.removeData(seriesData);
            random.addData(seriesData);
            graph.update();

        }, 1000 );
    }

    function initAnimations(){
        $('#geo-locations-number, #percent-1, #percent-2, #percent-3').each(function(){
            $(this).animateNumber({
                number: $(this).text().replace(/ /gi, ''),
                numberStep: $.animateNumber.numberStepFactories.separator(' '),
                easing: 'easeInQuad'
            }, 1000);
        });
        $('.js-progress-animate').animateProgressBar();
    }

    function pjaxPageLoad(){
        $('.widget').widgster();
        initMap();
        initCalendar();
        initRickshaw();
        initAnimations();
    }

    pjaxPageLoad();
    SingApp.onPageLoad(pjaxPageLoad);

});