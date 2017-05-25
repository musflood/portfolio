'use strict';

var app = app || {};

(function(module) {

  const projectsController = {};

  projectsController.init = function() {
    $('html, body').animate({
      scrollTop: ($('#projects-card').offset().top),
    }, 250);
    $('.tab[data-locate="projects-card"]').focus();
  }

  module.projectsController = projectsController;
})(app);
