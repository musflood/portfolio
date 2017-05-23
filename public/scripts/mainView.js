'use strict';

var app = app || {};

(function(module) {

  // create a library for funcitons on the main view
  const mainView = {};

  // remove green highlight on click for the social icons
  mainView.handleSocialClick = function() {
    $('#social').on('click', 'a', function() {
      $(this).blur();
    });
  };

  // event handler for clicking on the menu arrow button to show and hide the nav menu
  mainView.handleMenuArrowClick = function() {
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
    $('nav').on('click', '.tab', function(e) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: ($(`#${$(this).data('locate')}`).offset().top),
      }, 250);
    });
    $('.tab[data-locate="name-card"]').focus();
  };

  // given a text element that is siblings with an element with the class of 'cursor', prints each letter to the DOM one at a time at a given speed after a given delay, both in milliseconds
  mainView.typeOutWords = function($element, delay, speed) {
    let allText = $element.html();

    let foundTag = 0;
    let letterWithBreak = '';

    let letters = allText.split('').reduce(function(letters, letter, i) {
      foundTag += allText[i+1] === '<' ? 1 : 0;
      if(!foundTag) {
        letters.push(letter);
      } else {
        letterWithBreak += letter;
        if (foundTag === 2 && letter === '>') {
          letters.push(letterWithBreak);
          letterWithBreak = '';
          foundTag = 0;
        }
      }
      return letters;
    }, []);

    $element.html('');
    setTimeout(function() {
      $element.siblings('.cursor').css('animation', 'none');
      let i = 0;
      let interval = setInterval(function() {
        $element.html(letters.slice(0, i).join(''));
        if (i === letters.length) {
          clearInterval(interval);
          $element.siblings('.cursor').css('animation', '2.5s blink infinite');
        }
        i++;
      }, speed);
    }, delay)
  };

  // initializes the entire main page (index.html). adds listeners to the menus and types out the name at the top of the page. also fetches the data for the projects and prints them.
  mainView.initMainPage = function() {
    mainView.handleSocialClick();
    mainView.handleMenuArrowClick();
    mainView.handleMenuTabClick();
    mainView.typeOutWords($('#name-card .text-to-write'), 1000, 300);
    app.Project.fetchAll(app.projectView.initProjects);
  };

  module.mainView = mainView;
})(app);
