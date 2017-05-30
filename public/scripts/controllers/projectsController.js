'use strict';

var app = app || {};

(function(module) {

  const projectsController = {};

  // opens the projects tab by scrolling to it and highlighting the projects nav item
  projectsController.open = function(ctx, next) {
    $('html, body').animate({
      scrollTop: ($('#projects-card').offset().top),
    }, 250);
    $('.tab[data-locate="projects-card"]').focus();
    next();
  }

  // loads all the projects that are supposed to be visible
  projectsController.loadAll = function(ctx, next) {
    if (app.Project.visible.length) {
      ctx.projects = app.Project.visible;
      next();
    } else {
      app.Project.fetchAll(function() {
        ctx.projects = app.Project.visible;
        next();
      })
    }
  };

  //loads all the projects of a given language
  projectsController.loadLang = function(ctx, next) {
    if (app.Project.visible.length) {
      ctx.projects = app.Project.with('language', ctx.params.language !== 'none' ? ctx.params.language : null);
      next();
    } else {
      app.Project.fetchAll(function() {
        ctx.projects = app.Project.with('language', ctx.params.language !== 'none' ? ctx.params.language : null);
        next();
      })
    }
  }

  // initailizes the projects tab adding the projects to the DOM
  projectsController.init = function(ctx) {
    app.mainView.renderProjectList(ctx.projects);
    app.mainView.setSelectOption($(`#projects-card .select-options a[data-val="${ctx.params.language}"]`));
  };

  module.projectsController = projectsController;
})(app);
