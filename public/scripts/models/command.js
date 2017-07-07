'use strict';

var app = app || {};

(function(module) {

  function Command(text) {
    this.exe = text.split(' ')[0];
    this.arg = text.includes(' ') ? text.substring(text.indexOf(' ') + 1) : '';
  }

  Command.lib = {};

  // use eval for js
  // Command.lib[input command]() will invoke the function
  Command.prototype.execute = function() {
    // simple math
    console.log(this.exe);
    console.log(this.arg);
    return evalMath(this.arg);
    return `-bash: ${this.text.split(' ')[0]}: command not found`;
  }

  const evalMath = function(c) {
    let result = `-bash: not a decimal number: ${c.split(' ')[0]}`;
    if (/\d\s*[\+\/\-\*%()]/.test(c) && !/[A-Za-z_]/.test(c)) {
      try {
        result = eval(c);
      } catch (e) {
        console.log(e);
        result = '-bash: syntax error near unexpected token `';
        if (e.message.toLowerCase().includes('unexpected token')) result += e.message.substring(17);
        else if (e.message.toLowerCase().includes('missing')) result += '(';
        else if (e.message.toLowerCase().includes('invalid')) result += /\D/.exec(c);
        result += '\'';
      }
    }
    return result;
  }

  module.Command = Command;

})(app);
