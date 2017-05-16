'use strict';

// constructs a new Project object from the raw data of a Project object
function Project(rawProjectObj) {
  this.img = rawProjectObj.img || 'imgs/mouse.png';
  this.title = rawProjectObj.title;
  this.url = rawProjectObj.url;
  this.dateUpdated = rawProjectObj.dateUpdated;
  this.description = rawProjectObj.description;
}

// list of all projects from raw data
Project.all = [];

// fills the html project template with the information from the Project object and returns a new DOM element
Project.prototype.toHtml = function() {
  let templateRender = Handlebars.compile($('#project-template').html());
  return templateRender(this);
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

// sorts the given array of raw project data and then instantiates the Projects and add them to the array of projects.
Project.loadAll = function(rawData) {
  rawData.sort(function(a,b) {
    return (new Date(b.dateUpdated)) - (new Date(a.dateUpdated));
  });
  rawData.forEach(function(projectDataObj) {
    Project.all.push(new Project(projectDataObj));
  });
}

// gets the raw data for the projects. if the data is stored in the localStorage, will retrieve it from there, else will get the data from the JSON file. after the data has been acquired, initializes the projects part of the page.
Project.fetchAll = function() {
  // quick check to see if the data in localStorage is up to date
  $.ajax({
    url: 'data/sampleProjects.json',
    method: 'HEAD',
    success: function(data, message, xhr) {
      let eTag = xhr.getResponseHeader('ETag');
      if (eTag === localStorage.eTag) {
        // localStorage up to date, retrieve
        Project.loadAll(JSON.parse(localStorage.rawData));
        projectView.initProjects();
      } else {
        // localStorage is not up to date, get new data
        $.getJSON('data/sampleProjects.json').then(
          function(data) {
            localStorage.eTag = eTag;
            localStorage.rawData = JSON.stringify(data);
            Project.loadAll(data);
            projectView.initProjects();
          },
          function(err) {console.error(err);}
        );
      }
    },
    error: function(err) {console.error(err);},
  })
}
