'use strict';

var app = app || {};

(function(module) {

  // constructs a new Project object from the raw data of a Project object
  function Project(rawProjectObj) {
    this.img = Project.imgDictionary[rawProjectObj.name] || 'imgs/mouse.png';
    this.title = Project.fromKabobCase(rawProjectObj.name);
    this.url = rawProjectObj.homepage || rawProjectObj.html_url;
    this.dateUpdated = rawProjectObj.pushed_at;
    this.description = rawProjectObj.description;
    this.language = rawProjectObj.language;
  }

  // list of all projects from raw data
  Project.all = [];

  // list of projects to display in projects section
  Project.visible = [];

  // dictionary of the available images
  Project.imgDictionary = {};

  // fills the html project template with the information from the Project object and returns a new DOM element
  Project.prototype.toHtml = function() {
    let templateRender = Handlebars.compile($('#project-template').html());
    return templateRender(this);
  };

  // takes a string and retuns the same string as kabob case (lower case and with '-' instead of spaces)
  Project.toKabobCase = function(string) {
    return string.toLowerCase().replace(/ /g, '-');
  };

  // takes a string and retuns the same string as kabob case (lower case and with '-' instead of spaces)
  Project.fromKabobCase = function(string) {
    return string.replace(/-/g, ' ').replace(/\b\S/g, function(ch) {return ch.toUpperCase();});
  };

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
    let $canvas = $(`#img-${Project.toKabobCase(this.title)}`);
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

  // filters out the projects that are just lab assignments from the list of all projects
  Project.removeLabs = function() {
    return app.Project.all.filter(function(project) { return !/\d\d\s/.test(project.title); })
  }

  // sorts the given array of raw project data and then instantiates the Projects and adds them to the array of projects.
  Project.loadAll = function(rawData) {
    rawData.sort(function(a,b) {
      return (new Date(b.pushed_at)) - (new Date(a.pushed_at));
    });
    Project.all = rawData.map(project => new Project(project));
    Project.visible = Project.removeLabs();
  };

  // gets the raw data for the projects. if the data is stored in the localStorage, will retrieve it from there, else will get the data from the GitHub API. after the data has been acquired, initializes the projects part of the page.
  Project.fetchAll = function(callback) {
    // quick check to see if the data in localStorage is up to date
    $.ajax({
      url: 'https://api.github.com/user/repos',
      method: 'HEAD',
      headers: {
        Authorization: `token ${githubToken}`
      },
      success: function(data, message, xhr) {
        let eTag = xhr.getResponseHeader('ETag');
        if (eTag === localStorage.eTag) {
          // localStorage up to date, retrieve
          Project.fetchImages(function() {
            Project.loadAll(JSON.parse(localStorage.rawData));
            callback();
          });
        } else {
          // localStorage is not up to date, get new data
          $.ajax({
            url: 'https://api.github.com/user/repos',
            method: 'GET',
            headers: {
              Authorization: `token ${githubToken}`
            }
          })
          .then(
            function(data) {
              localStorage.eTag = eTag;
              localStorage.rawData = JSON.stringify(data);
              Project.fetchImages(function() {
                Project.loadAll(data);
                callback();
              });
            },
            function(err) { console.error(err); }
          );
        }
      },
      error: function(err) { console.error(err); },
    })
  };

  // gets the dictionary of available images from the JSON file, which matches the name of a project with a screen shot of the page itself
  Project.fetchImages = function(callback) {
    // quick check to see if the data in localStorage is up to date
    $.ajax({
      url: 'data/imgDict.json',
      method: 'HEAD',
      success: function(data, message, xhr) {
        let imgETag = xhr.getResponseHeader('ETag');
        if (imgETag === localStorage.imgETag) {
          // localStorage up to date, retrieve
          Project.imgDictionary = JSON.parse(localStorage.imgDictionary);
          callback();
        } else {
          // localStorage is not up to date, get new data
          $.getJSON('data/imgDict.json')
          .then(
            function(data) {
              localStorage.imgETag = imgETag;
              localStorage.imgDictionary = JSON.stringify(data);
              Project.imgDictionary = data;
              callback();
            },
            function(err) { console.error(err); }
          );
        }
      },
      error: function(err) { console.error(err); },
    })
  }

  module.Project = Project;
})(app);
