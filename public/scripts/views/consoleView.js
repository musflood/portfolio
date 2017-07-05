'use strict';

var app = app || {};

(function(module) {

  // create a library for funcitons on the console view
  const consoleView = {};

  let newLine = `<br>${$('.console-line')[0].outerHTML}`;

  consoleView.handleTyping = function() {
    $(document).on('keydown', function(e) {
      let $console = $('.console-line');
      if (e.keyCode === 13) {
        console.log('new line');
        $console.removeClass('console-line').after(newLine);
      }
    })
  }

  consoleView.initConsole = function() {
    $(document).on('keydown', function(e) {
      if (e.keyCode === 13 && $('h1:first').text().includes('m') && $('h1:first .cursor').css('animation').includes('blink')) {
        $(this).off('keydown');
        $('h1:first .cursor').css('animation', 'none').hide();
        $('.console').removeClass('hide');
        consoleView.handleTyping();
      }
    })
  };

  module.consoleView = consoleView;

})(app);
