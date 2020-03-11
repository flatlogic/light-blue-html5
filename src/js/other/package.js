$(function(){
    function pjaxPageLoad(){
        $('.widget').widgster();
    }

    pjaxPageLoad();
    SingApp.onPageLoad(pjaxPageLoad);
});