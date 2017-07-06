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
      if ($(window).scrollTop() > ($('#name-card h1').height() / 2)) {
        $('#social li:not(:last-child)').toggleClass('hide');
      }
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

  // event handler for clicking on the select menu to show and hide the menu and change the selected option
  mainView.handleSelectClick = function() {
    $('.select-btn').on('click', function(e) {
      e.preventDefault();
    });
    // open/close menu
    $('.select').on('click', function() {
      $(this).find('.select-options').slideToggle(TYPING_SPEED);
    });
    // close on click off
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.select').length) {
        $('.select-options:visible').slideUp(TYPING_SPEED);
      }
    });
    // change selected option
    $('.select-options').on('click', 'a', function() {
      mainView.setSelectOption($(this));
    })
  }

  // changes a select menu so that the chosen option is on the button and hidden from the menu
  mainView.setSelectOption = function(option) {
    option.parents('.select').find('.select-btn-text').text(option.text());
    option.siblings().attr('data-selected', false);
    option.attr('data-selected', true);
  }

  // event handler that checks where on the page the scroll is
  mainView.handlePageScroll = function() {
    $(window).on('scroll', function() {
      let triggerHeight = $('#name-card h1').height() / 2;
      if ($(window).scrollTop() < triggerHeight) {
        $('.tab[data-locate="name-card"]').focus();
        $('#social li:not(:last-child)').removeClass('hide');
      }
      if ($(window).scrollTop() >= (triggerHeight + $('.console:first').height() / 2)) {
        $(document).off('keydown');
        mainView.displayInfoCard();
        $('.tab[data-locate="info-card"]').focus();
        if (!$('.fa-chevron-circle-up').hasClass('down')) {
          $('#social li:not(:last-child)').addClass('hide');
        }
      }
      if ($(window).scrollTop() >= (triggerHeight + $('#name-card').height())) {
        mainView.displayProjectCard();
        $('.tab[data-locate="projects-card"]').focus();
      }
    });
  };

  // types out the info title then prints the text block
  mainView.displayInfoCard = function() {
    if ($('#info-card h1:not(.bottom):hidden').length) {
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
    if ($('#projects-card h1:not(.bottom):hidden').length) {
      $('#info-card .cursor').css('animation', 'none').css('opacity', '0');
      $('#projects-card h1:not(.bottom)').show();
      mainView.typeOutWords($('#projects-card .text-to-write'), TYPING_PAUSE, TYPING_SPEED);

      setTimeout(function() {
        $('#projects-card h1:first-child .cursor').css('animation', 'none').css('opacity', '0');
        $('#projects-card main').slideDown(BOX_RENDER_SPEED,'linear');
        app.Project.viewable.forEach(function(project) {
          app.projectView.renderPixelImage(project);
        })
        setTimeout(function() {
          $('#projects-card h1.bottom').show();
        }, BOX_RENDER_SPEED);
      }, TYPING_PAUSE * 3 + $('#projects-card h1').text().length * TYPING_SPEED)
    }
  }

  // renders the list of projects with the given array of Projects
  mainView.renderProjectList = function(projects) {
    $('#project-list').hide();
    $('#projects-card h1.bottom').hide();
    app.projectView.initProjects(projects);
    setTimeout(function() {
      $('#project-list').slideDown(BOX_RENDER_SPEED);
      app.Project.viewable.forEach(function(project) {
        app.projectView.renderPixelImage(project);
      })
      setTimeout(function() {
        if ($('#project-list:visible').length) { $('#projects-card h1.bottom').show(); }
      }, BOX_RENDER_SPEED);
    }, TYPING_SPEED)
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
      $element.siblings('.cursor').css('animation-name', 'none');
      let i = 0;
      let interval = setInterval(function() {
        $element.html(letters.slice(0, i).join(''));
        if (i === letters.length) {
          clearInterval(interval);
          $element.siblings('.cursor').css('animation-name', 'blink');
        }
        i++;
      }, speed);
    }, delay)
  };

  // initializes the entire main page (index.html). adds listeners to the menus and types out the name at the top of the page. also fetches the data for the projects and prints them.
  mainView.initMainPage = function() {
    mainView.handleSocialClick();
    mainView.handleMenuArrowClick();
    mainView.handleSelectClick();
    mainView.handlePageScroll();
    mainView.typeOutWords($('#name-card .text-to-write'), TYPING_PAUSE, TYPING_SPEED);
    app.Project.fetchAll(function() {app.projectView.initProjects(app.Project.viewable)});
    $('#info-card h1, #info-card div').hide();
    $('#projects-card h1, #projects-card main').hide();
    app.consoleView.initConsole();
  };

  mainView.initMainPage();

  module.mainView = mainView;
})(app);
