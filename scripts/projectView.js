'use strict';

var menuView = {}

menuView.handleArrowClick = function() {
  $('.fa-chevron-circle-up').on('click',function(e) {
    e.preventDefault();
    $('nav').toggleClass('hide');
    $(this).toggleClass('down');
  });
};

menuView.handleTabClick = function() {
  $('nav').on('click', '.tab',function() {
    $('html, body').animate({
      scrollTop: ($(`#${$(this).data('locate')}`).offset().top),
    }, 250);
  });
};

menuView.typeOutWords = function($element) {
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
    }, 300);
  }, 2500)
}

$(document).ready(function() {
  menuView.handleArrowClick();
  menuView.handleTabClick();
  menuView.typeOutWords($('#name-card .text-to-write'));
});
