'use strict';

var app = app || {};

(function(module) {

  // create a library for funcitons on the console view
  const consoleView = {};

  // empty new line for the console
  const newLine = `<br>${$('.console-line')[0].outerHTML}`;

  // handler for a keydown event, prints anything the user types on the keyboard to the screen's 'console'. if the 'enter' key is pressed, makes a new line on the 'console'. if the backspace is pressed, removes the last character from the 'console'. also, cursor stops blinking while typing and then starts again once typing has stopped.
  consoleView.handleConsoleTyping = function() {
    let startBlinking;
    $(document).on('keydown', function(e) {
      // stop blinking cursor while typing
      $('.console .cursor').css('animation-name', 'none');
      if (startBlinking) clearTimeout(startBlinking);
      startBlinking = setTimeout(function() {
        $('.console .cursor').css('animation-name', 'blink');
        startBlinking = undefined;
      }, 300);

      // handle the keystroke
      let $console = $('.console-line');
      let key = e.keyCode;
      let char = e.key;
      if (key === 13) {
        // enter key
        e.preventDefault()
        $console.removeClass('console-line').after(nextConsoleLine($console));
        if ($('.console').height() + $('h1').height() * 2 > $(window).height()) {
          $('html, body').animate({
            scrollTop: `+=${$('h1').height() * 1.25}`,
          }, 100);
        }
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

  const nextConsoleLine = function($currLine) {
    if ($currLine.contents().length === 1) {
      return newLine;
    }
    return '<br>' + $currLine.text().substring(2) + newLine;
  }

  // initializes the 'console' on the page. adds a listener to start the console if the user presses 'enter' once the first line has finished typing out itself.
  consoleView.initConsole = function() {
    $(document).on('keydown', function(e) {
      if (e.keyCode === 13 && $('h1:first').text().includes('d')) {
        $(this).off('keydown');
        $('h1:first .cursor').css('animation', 'none').hide();
        $('.console').removeClass('hide');
        consoleView.handleConsoleTyping();
      }
    })
  };

  module.consoleView = consoleView;

})(app);
