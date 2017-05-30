'use strict';

var app = app || {};

(function(module) {

  const nameController = {};

  // opens the name tab by scrolling to it and highlighting the projects nav item
  nameController.open = function() {
    $('html, body').animate({
      scrollTop: ($('#name-card').offset().top),
    }, 250);
    $('.tab[data-locate="name-card"]').focus();
  }

  module.nameController = nameController;
})(app);
