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
  $newProject.removeClass('template');
  $newProject.find('a').attr('href', this.url);
  $newProject.find('img').attr('src', this.img).attr('alt', this.title);
  $newProject.find('h3').html(this.title);
  $newProject.find('time').attr('datetime', this.dateUpdated).html('updated ' + parseInt((new Date() - new Date(this.dateUpdated))/1000/60/60/24) + ' days ago');
  $newProject.find('div').html(this.description);
  return $newProject;
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
