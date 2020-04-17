$(function(){
  function pageLoad(){
    $('.carousel').carousel()
  }
  pageLoad();
  SingApp.onPageLoad(pageLoad);
});