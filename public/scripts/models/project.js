'use strict';

var app = app || {};

(function(module) {

  // takes a string and retuns the same string as kabob case (lower case and with '-' instead of spaces)
  const fromKabobCase = function(string) {
    return string.replace(/-/g, ' ').replace(/\b\S/g, function(ch) {return ch.toUpperCase();});
  };

  // constructs a new Project object from the raw data of a Project object
  function Project(rawProjectObj) {
    this.img = Project.imgDictionary[rawProjectObj.name] || '/imgs/mouse.png';
    this.title = fromKabobCase(rawProjectObj.name);
    this.url = rawProjectObj.homepage || rawProjectObj.html_url;
    this.dateUpdated = rawProjectObj.pushed_at;
    this.description = rawProjectObj.description;
    this.language = rawProjectObj.language;
    this.isOwner = rawProjectObj.permissions.admin;
  }

  // list of all projects from raw data
  Project.all = [];

  // list of projects to display in projects section
  Project.visible = [];

  // dictionary of the available images
  Project.imgDictionary = {};

  // filters out the projects that are just lab assignments from the list of all projects
  const removeLabs = function(projects) {
    return projects.filter(function(project) { return !/\d\d\s/.test(project.title); })
  }

  // filters out projects that were not created by me
  const removeOthersProjects = function(projects) {
    return projects.filter(function(project) { return project.isOwner });
  }

  // gets rid of the learning journal
  const removeJournal = function(projects) {
    return projects.filter(function(project) { return project.title !== 'Learning Journal'; });
  }

  // sorts the given array of raw project data and then instantiates the Projects and adds them to the array of projects.
  Project.loadAll = function(rawData) {
    rawData.sort(function(a,b) {
      return (new Date(b.pushed_at)) - (new Date(a.pushed_at));
    });
    Project.all = rawData.map(project => new Project(project));
    Project.visible = removeJournal(removeLabs(removeOthersProjects(Project.all)));
  };

  // gets the raw data for the projects. if the data is stored in the localStorage, will retrieve it from there, else will get the data from the GitHub API. after the data has been acquired, initializes the projects part of the page.
  Project.fetchAll = function(callback) {
    // quick check to see if the data in localStorage is up to date
    $.ajax({
      url: '/github/user/repos',
      method: 'HEAD',
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
          $.get('/github/user/repos')
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
      url: '/data/imgDict.json',
      method: 'HEAD',
      success: function(data, message, xhr) {
        let imgETag = xhr.getResponseHeader('ETag');
        if (imgETag === localStorage.imgETag) {
          // localStorage up to date, retrieve
          Project.imgDictionary = JSON.parse(localStorage.imgDictionary);
          callback();
        } else {
          // localStorage is not up to date, get new data
          $.getJSON('/data/imgDict.json')
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

  // returns a list of Projects that have the given value for the given property
  Project.with = function(prop, val) {
    return Project.visible.filter(function(project) {
      return project[prop] === val;
    })
  }

  // returns a list of all the languages the Projects have been written in
  Project.allLangs = function() {
    return Project.visible.reduce(function(uniqueLangs, project) {
      if (!uniqueLangs.includes(project.language)) uniqueLangs.push(project.language);
      return uniqueLangs;
    }, []).sort();
  }

  module.Project = Project;
})(app);
