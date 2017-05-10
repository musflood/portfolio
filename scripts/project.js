'use strict';

$(document).ready(function() {

  $('.fa-chevron-circle-up').click(function() {
    $('nav').toggleClass('hide');
  });

  function Project(rawProjectObj) {
    this.img = rawProjectObj.img || 'default img';
    this.title = rawProjectObj.title;
    this.url = rawProjectObj.url;
    this.description = rawProjectObj.description;
  }
});
