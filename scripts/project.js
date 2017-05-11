'use strict';

var projects = [];

function Project(rawProjectObj) {
  this.img = rawProjectObj.img || 'mouse.png';
  this.title = rawProjectObj.title;
  this.url = rawProjectObj.url;
  this.dateUpdated = rawProjectObj.dateUpdated;
  this.description = rawProjectObj.description;
}

Project.prototype.toHtml = function () {
  var $newProject = $('.project.template').clone();
};

rawData.sort(function(a,b) {
  return (new Date(b.dateUpdated)) - (new Date(a.dateUpdated));
});

rawData.forEach(function(projectDataObj) {
  projects.push(new Project(projectDataObj));
});

projects.forEach(function(project) {
  $('#project-list').append(project.toHtml());
});
