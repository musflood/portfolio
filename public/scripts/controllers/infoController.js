'use strict';

var app = app || {};

(function(module) {

  const infoController = {};

  // opens the info tab by scrolling to it and highlighting the projects nav item
  infoController.open = function() {
    $('html, body').animate({
      scrollTop: ($('#info-card').offset().top),
    }, 250);
    $('.tab[data-locate="info-card"]').focus();
  }

  module.infoController = infoController;
})(app);
