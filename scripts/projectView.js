'use strict';

$(document).ready(function() {

  $('.fa-chevron-circle-up').on('click',function(e) {
    e.preventDefault();
    $('nav').toggleClass('hide');
  });

});
