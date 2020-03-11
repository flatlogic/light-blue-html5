$(function(){

    function pageLoad(){
        $('#print').click(function(){
            window.print();
        })
    }

    pageLoad();
    SingApp.onPageLoad(pageLoad);

});