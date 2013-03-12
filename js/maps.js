$(function(){
    $("#basic").width("100%").height("100%").gmap3();
    $('#location').width("100%").height("100%").gmap3({
        getgeoloc:{
            callback : function(latLng){
                if (latLng){
                    $(this).gmap3({
                        marker:{
                            latLng:latLng
                        },
                        map:{
                            options:{
                                zoom: 5
                            }
                        }
                    });
                } else {
                    $(this).html("Can't find your location. Sorry :(");
                }
            }
        }
    });

    $('#address').keypress(function(e) {
        if(e.which == 13) {
            var addr = $(this).val();
            if ( !addr || !addr.length ) return;
            $("#location").gmap3({
                getlatlng:{
                    address:  addr,
                    callback: function(results){
                        if ( !results ) return;
                        $(this).gmap3({
                            marker:{
                                latLng:results[0].geometry.location
                            },
                            map:{
                                options:{
                                    center: results[0].geometry.location,
                                    zoom: 5
                                }
                            }
                        });
                    }
                }
            });
        }
    })
});