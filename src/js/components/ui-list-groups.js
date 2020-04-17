$(function(){
    function pageLoad(){
        $('.widget').widgster();
        $("#sortable").sortable({
            placeholder: 'list-group-item list-group-item-placeholder',
            forcePlaceholderSize: true
        });
        $("#nestable1").nestable({
            group: 1
        });
        $("#nestable2").nestable({
            group: 1
        });
    }
    pageLoad();
    SingApp.onPageLoad(pageLoad);
});