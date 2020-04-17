$(function () {

  function pageLoad() {
    $('.widget').widgster();
    $('[data-toggle=tooltip]').tooltip();
    $('[data-toggle=popover]').popover({trigger: 'focus'});
  }

  pageLoad();
  SingApp.onPageLoad(pageLoad);
});