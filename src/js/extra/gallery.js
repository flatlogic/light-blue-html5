$(function(){
    function pageLoad(){
        var DEMO = (function( $ ) {
            'use strict';

            var $grid = $('#grid'),
                $filterOptions = $('.js-filter-options > .filter'),
                $sizer = $grid.find('.js-shuffle-sizer'),
                shuffleInstance = new Shuffle($grid, {
                    itemSelector: '.gallery-item',
                    sizer: $sizer // could also be a selector: '.my-sizer-element'

                });

                var init = function() {
                    setupFilters();
                    setupSorting();

                    shuffleInstance.filter('all');
                },

            // Set up button clicks
                setupFilters = function() {
                    var $btns = $filterOptions;
                    $btns.on('click', function() {
                        var $this = $(this),
                            group = $this.data('group');

                        // Hide current label, show current label in title
                        $('.js-filter-options .active').removeClass('active');
                        $this.addClass('active');

                        shuffleInstance.filter(group);
                    });

                    $btns = null;
                },

                setupSorting = function() {
                    // Sorting options
                    $('.js-sort-options > .sort').on('click', function() {
                        var order = $(this).data('sort-order'),
                            opts = {
                            reverse: order === 'desc',
                            by: function($el) {
                                return $el.getAttribute('data-title').toLowerCase();
                            }

                        };
                        $('.js-sort-options .active').removeClass('active');

                        $(this).addClass('active');
                        shuffleInstance.sort(opts);
                    });
                };

            return {
                init: init
            };
        }( jQuery ));

        DEMO.init();

        $('#grid').magnificPopup({
            delegate: '.img-thumbnail > a', // child items selector, by clicking on it popup will open
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    }
    pageLoad();
    SingApp.onPageLoad(pageLoad);
});