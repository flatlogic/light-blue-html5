$(function() {
  var filters = {
    type: {items: ['Shoes', 'Boots', 'Trainers'], checked: ''},
    brands: {items: ['All', 'Nike', 'Adidas'], checked: ''},
    size: {items: ['All', '7', '8', '9', '10', '11', '12'], checked: ''},
    color: {items: ['All', 'White', 'Black'], checked: ''},
    range: {items: ['All', '0 - 49', '50 - 149', '150 - 499', '500+'], checked: ''},
    sort: {items: ['Favourite, Price, Popular']}
  };

  function showFiltersModal() {
    $('.product-filter-modal').addClass('show');
    $('.product-grid').addClass('hide');
  }

  function showFiltersList(list) {
    $(list).addClass('show').siblings().removeClass('show');
  }

  function declareModalFilterTitle(title) {
    $('.filter-modal-title > h5').html(title);
  }

  function showButton(id) {
    $('.filter-modal-title #' + id)
        .addClass('show')
        .removeClass('hide')
        .siblings()
        .removeClass('show')
        .addClass('hide');
  }

  function hideFiltersModal() {
    $('.product-filter-modal').removeClass('show');
    $('.product-grid').removeClass('hide');
  }

  function initFilterChecking(listName, listId) {
      $('#' + listId).find('li').on('click', function () {
          $(this).addClass('active').siblings().removeClass('active');
          filters[listName].checked = $(this).find('.name').html();
          console.log(filters[listName].checked);
      });
  }

  function generateSubFilterMenu(listObjectName) {
    var listObject = filters[listObjectName];
    var $list = '';
    listObject.items.forEach(function (l) {
      if (listObject.checked === l) {
        $list += '<li class="option active"><span class="filter-check"><img src="./demo/img/check.svg" alt="check" /></span><span class="name">'+ l +'</span></li>';
      } else {
        $list += '<li class="option"><span class="filter-check"><img src="./demo/img/check.svg" alt="check" /></span><span class="name">'+ l +'</span></li>';
      }

    });

    $('#type-subfilters-list').empty().append($list);
    initFilterChecking(listObjectName, 'type-subfilters-list');
  }


  function initFilter() {
    $('#sort-filters').on('click', function () {
      showFiltersModal();
      showFiltersList('#sort-filters-list');
      declareModalFilterTitle('Sort');
      showButton('close_modal');
    });
    initFilterChecking('sort', 'sort-filters-list');
    $('#other-filters').on('click', function () {
      showFiltersModal();
      showFiltersList('#type-filters-list');
      declareModalFilterTitle('Filters');
      showButton('close_modal');
    });
    $('#back_modal').on('click', function() {
      showFiltersList('#type-filters-list');
      declareModalFilterTitle('Filters');
      showButton('close_modal');
    });
    $('#close_modal').on('click', function() {
        hideFiltersModal();
    });
    $('ul#type-filters-list > li').on('click', function () {
      var list = $(this).html();
      showFiltersList('#type-subfilters-list');
      declareModalFilterTitle(list);
      showButton('back_modal');
      generateSubFilterMenu(list.toLowerCase());
    })
  }

  function pageLoad() {
    initFilter();

    $(".star").on("click", function() {
      var starred = $(this).hasClass("star--fill");

      if (starred) {
        $(this).removeClass("star--fill");
        $(this)
          .children()
          .removeClass("fa-star")
          .addClass("fa-star-o");
      } else {
        $(this).addClass("star--fill");
        $(this)
          .children()
          .removeClass("fa-star-o")
          .addClass("fa-star");
      }
    });
  }

  pageLoad();
  SingApp.onPageLoad(pageLoad);
});
