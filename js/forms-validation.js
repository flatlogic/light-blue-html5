//This js is not needed if you're not using pjax.
//Parsley has its own onLoad handler. There is no need to attach it
//So this code is only used when page gets loaded via pjax

$(function(){
    function pageLoaded(){
        //init parsley for pjax requests
        $( '[data-validate="parsley"]' ).each( function () {
            $( this ).parsley();
        } );
    }

    pageLoaded();

    PjaxApp.onPageLoad(pageLoaded);
});