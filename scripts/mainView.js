'use strict';

// create a library for funcitons on the main view
var mainView = {}

// event handler for clicking on the menu arrow button to show and hide the nav menu
mainView.handleMenuArrowClick = function() {
  // remove green highlight on click for the icons
  $('#social').on('click', 'a', function() {
    $(this).blur();
  });

  $('.fa-chevron-circle-up').on('click', function(e) {
    e.preventDefault();
    $('nav').toggleClass('hide');
    $(this).toggleClass('down');
    if ($(this).hasClass('down')) {
      $('#social').animate({
        bottom: `+=${$('nav').height()}`,
      }, 100);
    } else {
      $('#social').animate({
        bottom: `-=${$('nav').height()}`,
      }, 100);
    }
  });
};

// event handler for clicking on the nav to scroll to the section clicked
mainView.handleMenuTabClick = function() {
  $('nav').on('click', '.tab', function() {
    $('html, body').animate({
      scrollTop: ($(`#${$(this).data('locate')}`).offset().top),
    }, 250);
  });
  $('.tab[data-locate="name-card"]').focus();
};

// given a text element that is siblings with an element with the class of 'cursor', prints each letter to the DOM one at a time at a given speed after a given delay, both in milliseconds
mainView.typeOutWords = function($element, delay, speed) {
  var allText = $element.html();
  var letters = [];
  var foundTag = 0;
  var letterWithBreak = '';
  for (var i = 0; i < allText.length; i++) {
    foundTag += allText[i+1] === '<' ? 1 : 0;
    if(!foundTag) {
      letters.push(allText[i]);
    } else {
      letterWithBreak += allText[i];
      if (foundTag === 2 && allText[i] === '>') {
        letters.push(letterWithBreak);
        letterWithBreak = '';
        foundTag = 0;
      }
    }
  }
  $element.html('');
  setTimeout(function() {
    $element.siblings('.cursor').css('animation', 'none');
    i = 0;
    var interval = setInterval(function() {
      $element.html(letters.slice(0, i).join(''));
      if (i === letters.length) {
        clearInterval(interval);
        $element.siblings('.cursor').css('animation', '3s blink infinite');
      }
      i++;
    }, speed);
  }, delay)
}

// add listeners and print the home page on page ready.
$(document).ready(function() {
  mainView.handleMenuArrowClick();
  mainView.handleMenuTabClick();
  mainView.typeOutWords($('#name-card .text-to-write'), 2000, 300);
});
