'use strict';

// list of all projects from raw data
var projects = [];

// constructs a new Project object from the raw data of a Project object
function Project(rawProjectObj) {
  this.img = rawProjectObj.img || 'imgs/mouse.png';
  this.title = rawProjectObj.title;
  this.url = rawProjectObj.url;
  this.dateUpdated = rawProjectObj.dateUpdated;
  this.description = rawProjectObj.description;
}

// fills the html project template with the information from the Project object and returns a new DOM element
Project.prototype.toHtml = function() {
  var templateRender = Handlebars.compile($('#project-template').html());
  return templateRender(this);
};

// finds the canvas corresponding to the Project and pixelizes the image for the project and renders it to the canvas
Project.prototype.renderPixelImage = function() {
  var $canvas = $(`#img-${Project.toKabobCase(this.title)}`);
  var ctx = $canvas[0].getContext('2d');
  var $img = $canvas.siblings('img');

  $canvas[0].height = $img.height();
  $canvas[0].width = $img.width();

  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  var scalar = 40 / 100; // set the pixelization factor

  var shrunkWidth = scalar * $canvas.width();
  var shrunkHeight = scalar * $canvas.height();
  ctx.drawImage($img[0], 0, 0, shrunkWidth, shrunkHeight);
  ctx.drawImage($canvas[0], 0, 0, shrunkWidth, shrunkHeight, 0, 0, $canvas.width(), $canvas.height());
};

// takes a string and retuns the same string as kabob case (lower case and with '-' instead of spaces)
Project.toKabobCase = function(string) {
  return string.toLowerCase().replace(/ /g, '-');
}

// adds a helper block to Handlebars that converts a date into the number of days ago
Handlebars.registerHelper('toDaysAgo', function(date) {
  return parseInt((new Date() - new Date(date))/1000/60/60/24);
});

// adds a helper block to Handlebars that converts a string to kabob case
Handlebars.registerHelper('toKabobCase', function(string) {
  return Project.toKabobCase(string);
});

// sorts the list of raw projects by the last date they were updated
rawData.sort(function(a,b) {
  return (new Date(b.dateUpdated)) - (new Date(a.dateUpdated));
});

// copy the raw data into new Project objects
rawData.forEach(function(projectDataObj) {
  projects.push(new Project(projectDataObj));
});

// add each of the projects to the DOM
projects.forEach(function(project) {
  $('#project-list').append(project.toHtml());
  if (project.img === 'imgs/mouse.png') {
    $(`#img-${Project.toKabobCase(project.title)}`).hide();
  } else {
    $(`#img-${Project.toKabobCase(project.title)}`).siblings('img').on('load', function() {
      project.renderPixelImage();
    });
  }
});
