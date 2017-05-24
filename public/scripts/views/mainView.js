'use strict';

var app = app || {};

(function(module) {

  // create a library for funcitons on the main view
  const mainView = {};

  const TYPING_SPEED = 300;
  const TYPING_PAUSE = 1000;
  const BOX_RENDER_SPEED = 2000;

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

  // event handler that checks where on the page the scroll is
  mainView.handlePageScroll = function() {
    $(window).on('scroll', function() {
      let triggerHeight = $('#name-card h1').height() / 2;
      if ($(window).scrollTop() < triggerHeight) {
        $('.tab[data-locate="name-card"]').focus();
      }
      if ($(window).scrollTop() >= triggerHeight) {
        mainView.displayInfoCard();
        $('.tab[data-locate="info-card"]').focus();
      }
      if ($(window).scrollTop() >= (triggerHeight + $('#name-card').height())) {
        mainView.displayProjectCard();
        $('.tab[data-locate="projects-card"]').focus();
      }
    });
  };

  // types out the info title then prints the text block
  mainView.displayInfoCard = function() {
    if ($('#info-card h1:not(.bottom):hidden').length > 0) {
      $('#name-card .cursor').css('animation', 'none').css('opacity', '0');
      $('#info-card h1:not(.bottom)').show();
      mainView.typeOutWords($('#info-card .text-to-write'), TYPING_PAUSE, TYPING_SPEED);

      setTimeout(function() {
        $('#info-card h1:first-child .cursor').css('animation', 'none').css('opacity', '0');
        $('#info-card div').slideDown(BOX_RENDER_SPEED,'linear');
        setTimeout(function() {
          $('#info-card h1.bottom').show();
        }, BOX_RENDER_SPEED);
      }, TYPING_PAUSE * 2 + $('#info-card h1').text().length * TYPING_SPEED);
    }
  };

  // types out the projects title then prints the project blocks
  mainView.displayProjectCard = function() {
    if ($('#projects-card h1:not(.bottom):hidden').length > 0) {
      $('#info-card .cursor').css('animation', 'none').css('opacity', '0');
      $('#projects-card h1:not(.bottom)').show();
      mainView.typeOutWords($('#projects-card .text-to-write'), TYPING_PAUSE, TYPING_SPEED);

      setTimeout(function() {
        $('#projects-card h1:first-child .cursor').css('animation', 'none').css('opacity', '0');
        $('#project-list').slideDown(BOX_RENDER_SPEED,'linear');
        app.Project.all.forEach(function(project) {
          project.renderPixelImage();
        })
        setTimeout(function() {
          $('#projects-card h1.bottom').show();
        }, BOX_RENDER_SPEED);
      }, TYPING_PAUSE * 3 + $('#projects-card h1').text().length * TYPING_SPEED)
    }
  }

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
    mainView.handlePageScroll();
    mainView.typeOutWords($('#name-card .text-to-write'), TYPING_PAUSE, TYPING_SPEED);
    app.Project.fetchAll(app.projectView.initProjects);
    $('#info-card h1, #info-card div').hide();
    $('#projects-card h1, #project-list').hide();
  };

  mainView.initMainPage();

  module.mainView = mainView;
})(app);
