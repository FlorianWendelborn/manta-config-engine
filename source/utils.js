var manta = require('./');
var constants = manta.data.constants;
var prefix = constants.prefix;
var separator = constants.separator;

function bind (key, command) {
	return 'bind "' + key + '" ' + command;
}

function name (options) {
	var args = [];
	if (typeof options === 'string') {
		for (var i = 0; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
	} else {
		args = options;
	}

	// ignore nested names, allows nested naming
	if (args[0].substring(0, prefix.length) === prefix) {
		return args.join(separator);
	} else {
		return prefix + separator + args.join(separator);
	}
}

function multi (options) {
	var args = [];
	if (typeof options === 'string') {
		for (var i = 0; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
	} else {
		args = options;
	}
	if (args.length > 1 || args[0].indexOf(' ') !== -1) {
		// don't place double quotes
		var quote = args[0][0] === '"' ? '' : '"';
		return quote + args.join('; ') + quote;
	} else {
		return args[0] || '';
	}
}

function single (command, value) {
	return '"' + command + ' ' + value + '"';
}

function alias (name, command) {
	return 'alias ' + name + ' ' + command;
}

function oneMore (stuff) {
	return parseInt(stuff, 10) + 1;
}

function macro (name, min, max) {
	var result = [];
	for (var i = min; i <= max; i++) {
		result.push(name + ' ' + i);
	}
	return multi(result);
}

module.exports = {
	  alias: alias
	, bind: bind
	, name: name
	, macro: macro
	, multi: multi
	, oneMore: oneMore
	, single: single
};
