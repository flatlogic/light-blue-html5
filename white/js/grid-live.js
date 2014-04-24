$(function(){
    function pageLoad(){
        $(".widget-container").sortable({
            connectWith: '.widget-container',
            handle: '.widget:not(.fullscreened) > header, .widget:not(.fullscreened) .handle',
            cursor: 'move',
            iframeFix: false,
            items: '.widget:not(.locked)',
            opacity: 0.8,
            helper: 'original',
            revert: true,
            forceHelperSize: true,
            placeholder: 'widget widget-placeholder',
            forcePlaceholderSize: true,
            tolerance: 'pointer'
        });

        /**
         * fade out background when widget fullscreened
         */
        var $widgets = $('.widget'),
            $newsWidget = $('#news-widget'),
            $sharesWidget = $('#shares-widget');
        $widgets.on("fullscreen.widgster", function(){
            $('.widget, .sidebar, .logo, .page-header, .page-title').not($(this)).fadeTo(150, 0);
        }).on("restore.widgster", function(){
            $('.widget, .sidebar, .logo, .page-header, .page-title').not($(this)).fadeTo(150, 1);
        });

        /**
         * Make refresh button spin when loading
         */
        $newsWidget.on("load.widgster", function(){
            $(this).find('[data-widgster="load"] > i').addClass('fa-spin')
        }).on("loaded.widgster", function(){
            $(this).find('[data-widgster="load"] > i').removeClass('fa-spin')
        });

        /**
         * Custom close prompt for news widget
         */
        $newsWidget.widgster({
            showLoader: false,
            closePrompt: function(callback){
                $('#news-close-modal').modal('show');
                $('#news-widget-remove').on('click', function(){
                    $('#news-close-modal').on('hidden.bs.modal', callback).modal('hide');
                });
            }
        });

        $sharesWidget.widgster({
            loaderTemplate: '<div class="loader animated fadeIn">' +
                '   <span class="spinner"><i class="fa fa-spinner fa-spin"></i></span>' +
                '</div>'
        });

        /**
         * Init all other widgets with default settings & settings retrieved from data-* attributes
         */
        $widgets.widgster();

        /**
         * Init tooltips for all widget controls on page
         */
        $('.widget-controls > a').tooltip({placement: 'bottom'});
    }

    pageLoad();

    PjaxApp.onPageLoad(pageLoad);
});