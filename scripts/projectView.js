'use strict';

var menuView = {}

menuView.handleArrowClick = function() {
  $('.fa-chevron-circle-up').on('click',function(e) {
    e.preventDefault();
    $('nav').toggleClass('hide');
  });
};

menuView.handleTabClick = function() {
  $('nav').on('click', '.tab',function(e) {
    e.preventDefault();
    console.log('click', $(this).data('locate'));
    $('html, body').animate({
      scrollTop: ($(`#${$(this).data('locate')}`).offset().top)
    }, 100);
  });
};

$(document).ready(function() {
  menuView.handleArrowClick();
  menuView.handleTabClick();
});
