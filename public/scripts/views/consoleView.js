'use strict';

var app = app || {};

(function(module) {

  // create a library for funcitons on the console view
  const consoleView = {};

  let newLine = `<br>${$('.console-line')[0].outerHTML}`;

  consoleView.handleTyping = function() {
    let lastTimePressed;
    $(document).on('keydown', function(e) {
      $('.console .cursor').css('animation-name', 'none');
      let $console = $('.console-line');
      let key = e.keyCode;
      let char = e.key;
      lastTimePressed = e.timeStamp;
      if (key === 13) {
        // enter key
        $console.removeClass('console-line').after(newLine);
      } else if (key === 8) {
        // backspace key
        e.preventDefault()
        if ($console.contents().length > 1) $console.contents().last().remove();
      } else if ((key >= 48 && key <= 90) || key === 32 || (key >= 186 && key !== 224)){
        // alphanumeric || space || punctuation
        if (key === 32) e.preventDefault();
        $console.append(char);
      }
    })
  }

  consoleView.initConsole = function() {
    $(document).on('keydown', function(e) {
      if (e.keyCode === 13 && $('h1:first').text().includes('d')) {
        $(this).off('keydown');
        $('h1:first .cursor').css('animation', 'none').hide();
        $('.console').removeClass('hide');
        consoleView.handleTyping();
      }
    })
  };

  module.consoleView = consoleView;

})(app);
