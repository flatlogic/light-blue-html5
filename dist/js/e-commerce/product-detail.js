$(function () {
  function _initCarousel() {
    var $carousel = $('.product-carousel');
    var $prev = $('.carousel-left');
    var $next = $('.carousel-right');
    var slidesToShow = Sing.isScreen('xs') || Sing.isScreen('sm') ? 2 : 4;


    $carousel.slick({
      slidesToShow,
      prevArrow: $prev,
      nextArrow: $next,
    });
  }

  function pageLoad() {
    _initCarousel();
  }

  pageLoad();
  SingApp.onPageLoad(pageLoad);
});
