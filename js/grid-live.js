$(function(){
    function pageLoad(){
        $(".widget-container").sortable({
            connectWith: '.widget-container',
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

        $('.widget').widgster({
            showLoader: false
        }).on("load.widgster", function(){
            $('[data-widgster="load"] > i').addClass('fa-spin')
        }).on("loaded.widgster", function(){
            $('[data-widgster="load"] > i').removeClass('fa-spin')
        });

        $('.widget-controls > a').tooltip({placement: 'bottom'});
    }

    pageLoad();

    PjaxApp.onPageLoad(pageLoad);
});