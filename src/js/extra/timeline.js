$(function(){
    function initGmap(){
        var map = new GMaps({
            el: '#gmap',
            lat: -37.813179,
            lng: 144.950259,
            zoomControl : false,
            panControl : false,
            streetViewControl : false,
            mapTypeControl: false,
            overviewMapControl: false
        });

        setTimeout( function(){
            map.addMarker({
                lat: -37.813179,
                lng: 144.950259,
                animation: google.maps.Animation.DROP,
                draggable: true,
                title: 'Here we are'
            });
        }, 3000);
    }

    function pageLoad(){
        initGmap();

        $('.event-image > a').magnificPopup({
            type: 'image'
        });
    }

    pageLoad();
    SingApp.onPageLoad(pageLoad);
});