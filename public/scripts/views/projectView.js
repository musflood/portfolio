'use strict';

var app = app || {};

(function(module) {

  // create a library for funcitons on the project view
  const projectView = {};

  // fills the html project template with the information from the given Project object and returns a new DOM element
  const render = function(project) {
    let templateRender = Handlebars.compile($('#project-template').html());
    return templateRender(project);
  }

  // takes a string and retuns the same string as kabob case (lower case and with '-' instead of spaces)
  const toKabobCase = function(string) {
    return string.toLowerCase().replace(/ /g, '-');
  };

  // adds a helper block to Handlebars that converts a date into the number of days ago
  Handlebars.registerHelper('toDaysAgo', function(date) {
    return parseInt((new Date() - new Date(date))/1000/60/60/24);
  });

  // adds a helper block to Handlebars that converts a string to kabob case
  Handlebars.registerHelper('toKabobCase', function(string) {
    return toKabobCase(string);
  });

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
      app.Project.visible.forEach(function(project) {
        projectView.renderPixelImage(project);
      });
    });
  };

  projectView.populateFilter = function() {
    let template = Handlebars.compile($('#option-template').html());
    let options = app.Project.allLangs().map(function(lang) {
      return template({ val: lang ? lang.toUpperCase() : 'NONE' });
    });
    $('#projects-card .select-options').append(options);
  }

  // finds the canvas corresponding to the Project and pixelizes the image for the project and renders it to the canvas
  projectView.renderPixelImage = function(project) {
    let $canvas = $(`#img-${toKabobCase(project.title)}`);
    let ctx = $canvas[0].getContext('2d');
    let $img = $canvas.siblings('img');

    $canvas[0].height = $img.height() + 2; // add slight buffer to make sure image is covered
    $canvas[0].width = $img.width();

    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    let scalar = 40 / 100; // set the pixelization factor

    let shrunkWidth = scalar * $canvas.width();
    let shrunkHeight = scalar * $canvas.height();
    ctx.drawImage($img[0], 0, 0, shrunkWidth, shrunkHeight);
    ctx.drawImage($canvas[0], 0, 0, shrunkWidth, shrunkHeight, 0, 0, $canvas.width(), $canvas.height());
  };

  // initializes the projects portion of the page. adds each project to the DOM and adds the filters. also adds listeners to each project for the desciptions and for window resize.
  projectView.initProjects = function() {
    projectView.populateFilter();
    // add each of the projects to the DOM
    app.Project.visible.forEach(function(project) {
      $('#project-list').append(render(project));
      if (project.img === 'imgs/mouse.png') {
        $(`#img-${toKabobCase(project.title)}`).hide();
      } else {
        $(`#img-${toKabobCase(project.title)}`).siblings('img').on('load', function() {
          projectView.renderPixelImage(project);
        });
      }
    });
    // apply event listeners
    projectView.handleViewDesciptionClick();
    projectView.handleWindowResize();
  };

  module.projectView = projectView;
})(app);
