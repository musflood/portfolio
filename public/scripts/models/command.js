'use strict';

var app = app || {};

(function(module) {

  // given a string that consists of a command and the arguments for that command separated by spaces, creates a new Command object that stores the command and the arguments.
  function Command(text) {
    this.exe = text.split(' ')[0];
    this.arg = text.includes(' ') ? text.substring(text.indexOf(' ') + 1) : '';
  }

  // library of the valid bash commands for the console
  const lib = {};

  // bash command help desplays information about the given command
  lib.help = function(c) {
    if (!c) return `These shell commands are defined internally.  Type \`help' to see this list.<br>Type \`help name' to find out more about the function \`name'.<br><br><span class="col-list">${Object.keys(lib).join('<br>')}</span>`
  }

  lib.clear = function() {
    return { clear: true };
  }

  // bash command expr evaluates a simple mathematical expression
  lib.expr = function(c) {
    if (!c) return 'expr: syntax error';
    let result = `expr: not a decimal number: ${c.split(' ')[0]}`;
    if (/\d\s*[\+\/\-\*%()]/.test(c) && !/[A-Za-z_]/.test(c)) {
      try {
        result = eval(c);
      } catch (e) {
        result = 'expr: syntax error near unexpected token `';
        if (e.message.toLowerCase().includes('unexpected token')) result += e.message.substring(17);
        else if (e.message.toLowerCase().includes('missing')) result += '(';
        else if (e.message.toLowerCase().includes('invalid')) result += /\D/.exec(c);
        result += '\'';
      }
    }
    return result;
  }

  // use eval for js
  // Command.lib[input command]() will invoke the function
  Command.prototype.execute = function() {
    // simple math
    console.log('entered command:', this.exe);
    console.log('with the argument:',this.arg);
    try {
      return lib[this.exe.toLowerCase()](this.arg);
    } catch (e){
      return `-bash: ${this.exe}: command not found`;
    }
  }

  module.Command = Command;

})(app);
