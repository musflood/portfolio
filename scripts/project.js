'use strict';

function Project(rawProjectObj) {
  this.img = rawProjectObj.img || 'default img';
  this.title = rawProjectObj.title;
  this.url = rawProjectObj.url;
  this.description = rawProjectObj.description;
}
