$(function(){
  function pageLoad(){
      $('.widget').widgster();
      $('.toast').toast();

      // you can copy the following code to some common js file in order to have
      // toasts available everywhere
      $('[data-toggle-toast]').on('click', function () {
          const $toast = $('#'+$(this).attr('data-toggle-toast'));
          if ($toast.length > 0 ){
              $toast.toast('show');
          }
      })
  }
  pageLoad();
  SingApp.onPageLoad(pageLoad);
});