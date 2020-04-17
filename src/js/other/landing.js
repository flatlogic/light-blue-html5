$(function(){
  function pageLoad(){
    $('.owl-carousel').owlCarousel({
      items: 1,
      loop :true,
      margin: 10,
      nav: false,
      dots: true,
      navText: ['<img src="../img/landing/arrow.svg">', '<img src="../img/landing/arrow.svg">'],
      responsive: [{
        breakpoint: 992,
        nav: true,
      }],
    })
  }

  pageLoad();
  SingApp.onPageLoad(pageLoad);
});