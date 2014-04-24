$(function(){
    function pageLoad(){
        $(".widget-container").sortable({
            connectWith: '.widget-container',
            handle: 'header, .handle',
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
        $('.widget').on("fullscreen.widgster", function(){
            $('.widget, .sidebar, .logo, .page-header, .page-title').not($(this)).fadeTo(150, 0);
        }).on("restore.widgster", function(){
            $('.widget, .sidebar, .logo, .page-header, .page-title').not($(this)).fadeTo(150, 1);
        });

        $('#default-widget').widgster();

        $('#news-widget').widgster({
            showLoader: false
        }).on("load.widgster", function(){
            $(this).find('[data-widgster="load"] > i').addClass('fa-spin')
        }).on("loaded.widgster", function(){
            $(this).find('[data-widgster="load"] > i').removeClass('fa-spin')
        });

        $('.widget-controls > a').tooltip({placement: 'bottom'});
    }

    pageLoad();

    PjaxApp.onPageLoad(pageLoad);
});