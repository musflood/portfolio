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
    // no arguments - display full list
    if (!c || (c.split(' ')[0] === '-s' && c.split(' ').length === 1)) {
      return `These shell commands are defined internally.  Type \`help' to see this list.<br>Type \`help name' to find out more about the function \`name'.<br><br><span class="col-list">${Object.keys(lib).map(e => `${e} ${lib[e].args}`).join('<br>')}</span>`;
    }
    // check for proper options
    let opt, patt = c.split(' ');
    if (patt[0][0] === '-') {
      opt = patt.shift().substring(1);
    }
    if (opt && opt !== 's') return `help: -${/[^s]/.exec(opt)}: invalid option`;
    // build the help section
    let message = '';
    patt.forEach(function(p, i) {
      if (lib[p]) {
        if (i) message += '<br>';
        message += `${p}: ${p} ${lib[p].args}`;
        if (!opt) message += `<br><span class='help-text'>${lib[p].help}</span>`;
      }
    })
    if (message) return message;
    // not in library
    return `help: no help topics match \`${patt[patt.length - 1]}'.  Try \`help help'.`;
  }
  lib.help.args = '[-s] [pattern ...]';
  lib.help.help = 'Display helpful information about builtin commands.  If PATTERN is specified, gives detailed help on all commands matching PATTERN, otherwise a list of the builtins is printed.  The -s option restricts the output for each builtin command matching PATTERN to a short usage synopsis.';

  // bash command clear clears the current terminal
  lib.clear = function() {
    return { clear: true };
  }
  lib.clear.args = '';
  lib.clear.help = 'Clear the terminal screen.';

  // bash command expr evaluates a simple mathematical expression
  lib.expr = function(c) {
    if (!c) return 'expr: syntax error';
    let result = `expr: not a decimal number: ${c.split(' ')[0]}`;
    if (/\d\s*[\+\/\-\*%()]/.test(c) && !/[A-Za-z_]/.test(c)) {
      try {
        result = eval(c);
      } catch (e) {
        console.alert('expr error:', e.message);
        result = 'expr: syntax error near unexpected token `';
        if (e.message.toLowerCase().includes('unexpected token')) result += e.message.substring(17) + '\'';
        else if (e.message.toLowerCase().includes('missing')) result += '(\'';
        else if (e.message.toLowerCase().includes('invalid')) result += /\D/.exec(c) + '\'';
        else result = 'expr: syntax error';
      }
    }
    return result;
  }
  lib.expr.args = '[expression]';
  lib.expr.help = 'Evaluate mathematical EXPRESSION.';

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
