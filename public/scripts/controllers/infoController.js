'use strict';

var app = app || {};

(function(module) {

  const infoController = {};

  infoController.init = function() {
    $('html, body').animate({
      scrollTop: ($('#info-card').offset().top),
    }, 250);
    $('.tab[data-locate="info-card"]').focus();
  }

  module.infoController = infoController;
})(app);
