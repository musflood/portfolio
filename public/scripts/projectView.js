'use strict';

// create a library for funcitons on the project view
const projectView = {};

// toggles the description of a project when the 'read description' link is clicked
projectView.handleViewDesciptionClick = function() {
  $('.project').on('click', '.more', function(e) {
    e.preventDefault();
    $(this).siblings('.desciption').slideToggle(300, 'linear');
    $(this).text()[0] === 'R' ? $(this).text('< Hide description') : $(this).text('Read description >');
  });
};

// when the browser window is resized, also resizes the canvas elements with the filters applied.
projectView.handleWindowResize = function() {
  $(window).on('resize', function() {
    Project.all.forEach(function(project) {
      project.renderPixelImage();
    });
  });
};

// initializes the projects portion of the page. adds each project to the DOM and adds the filters. also adds listeners to each project for the desciptions and for window resize.
projectView.initProjects = function() {
  // add each of the projects to the DOM
  Project.all.forEach(function(project) {
    $('#project-list').append(project.toHtml());
    if (project.img === 'imgs/mouse.png') {
      $(`#img-${Project.toKabobCase(project.title)}`).hide();
    } else {
      $(`#img-${Project.toKabobCase(project.title)}`).siblings('img').on('load', function() {
        project.renderPixelImage();
      });
    }
  });
  // apply event listeners
  projectView.handleViewDesciptionClick();
  projectView.handleWindowResize();
};
