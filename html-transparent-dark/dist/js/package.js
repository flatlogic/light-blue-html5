$(function(){
    function pageLoad(){
        $('.widget').widgster();
    }

    pageLoad();
    PjaxApp.onPageLoad(pageLoad);
});