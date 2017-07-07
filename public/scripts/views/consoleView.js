'use strict';

var app = app || {};

(function(module) {

  // create a library for funcitons on the console view
  const consoleView = {};

  // empty new line for the console
  const newLine = `<br>${$('.console-line')[0].outerHTML}`;

  // all the commands that have been attempted
  const prevCommands = [];

  // the index of the current command, counting from the end of prevCommands
  let commandIdx = 0;

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
        e.preventDefault();
        commandIdx = 0;
        let result = nextConsoleLine($console);
        if (result.clear) {
          let $terminal = $console.parent();
          $terminal.children(':not(.cursor)').remove()
          $terminal.prepend(newLine.substring(4));
        } else {
          $console.removeClass('console-line').addClass('command').after(result);
        }
      } else if (key === 8) {
        // backspace key
        e.preventDefault();
        commandIdx = 0;
        if ($console.contents().length > 1) $console.contents().last().remove();
      } else if ((key >= 48 && key <= 90) || key === 32 || (key >= 186 && key !== 224)){
        // alphanumeric || space || punctuation
        if (key === 32) e.preventDefault();
        commandIdx = 0;
        $console.append(char);
      } else if (key === 38) {
        // up arrow
        e.preventDefault();
        if (commandIdx+1 <= prevCommands.length) commandIdx++;
        $console.empty().append(prevCommands[prevCommands.length - commandIdx].clone());
      } else if (key === 40) {
        // down arrow
        e.preventDefault();
        if (commandIdx-1 >= 0) commandIdx--;
        $console.empty().append(commandIdx ? prevCommands[prevCommands.length - commandIdx].clone() : $(newLine.substring(4)).text());
      }

      // scroll to include what you are typing
      if ($('.console').height() + $('h1').height() * 2 > $(window).height()) {
        $('html, body').animate({
          scrollTop: `${$('#name-card').height() - $(window).height() + $('h1').height() * 2}`,
        }, 50);
      }
    })
  }

  // takes a line from the console and returns the results from that line.
  const nextConsoleLine = function($line) {
    if ($line.contents().length === 1) {
      return newLine;
    }
    prevCommands.push($line.contents());
    let result = new app.Command($line.text().substring(2)).execute();
    if (result.clear) return result;
    return `<br><span class="result">${result}</span>${newLine}`;
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
