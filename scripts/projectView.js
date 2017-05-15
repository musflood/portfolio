'use strict';

// create a library for funcitons on the project view
var projectView = {};

projectView.handleViewDesciptionClick = function() {
  $('.project').on('click', '.more', function(e) {
    e.preventDefault();
    $(this).siblings('.desciption').slideToggle(300, 'linear');
    $(this).text()[0] === 'R' ? $(this).text('< Hide description') : $(this).text('Read description >');
  });
}

$(document).ready(function() {
  projectView.handleViewDesciptionClick();
});
