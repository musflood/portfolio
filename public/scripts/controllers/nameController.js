'use strict';

var app = app || {};

(function(module) {

  const nameController = {};

  nameController.init = function() {
    $('html, body').animate({
      scrollTop: ($('#name-card').offset().top),
    }, 250);
    $('.tab[data-locate="name-card"]').focus();
  }

  module.nameController = nameController;
})(app);
