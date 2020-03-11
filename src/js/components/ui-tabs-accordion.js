$(function () {

    function pageLoad() {
        removeActiveClass();
    }

    function removeActiveClass() {
        $('.nav-tabs').on('shown.bs.tab', 'a', function (e) {
            if (e.relatedTarget) {
                $(e.relatedTarget).removeClass('active');
            }
        });
    }

    pageLoad();
    SingApp.onPageLoad(pageLoad);
});