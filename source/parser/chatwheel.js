var manta = require('../');
var codements = require('codements');
var constants = manta.data.constants;

// utility shorthands, so the commands remain readable
var utils = manta.utils;
var multi = utils.multi;
var alias = utils.alias;
var name = utils.name;
var oneMore = utils.oneMore;

function ChatwheelParser (options) {
	this.chatwheels = options.chatwheels;
	this.autoexec = constants.chatwheels.initialText;
	this.codement = new codements.SplitView();
}

ChatwheelParser.prototype.parse = function () {
	this.codement.reset();
	for (var i = 0; i < this.chatwheels.length; i++) {
		this.parseOne(i);
		// add newline between chatwheels
		if (i !== this.chatwheels.length-1) {
			this.codement.addLine();
		}
	}
	return this.autoexec + this.codement.render();
};

ChatwheelParser.prototype.parseOne = function (id) {
	var chatwheel = this.chatwheels[id];
	var command = '';
	var cname = name('chatwheel', id);
	this.codement.addLine(constants.chatwheels.chatwheelText.replace('{id}', id));
	this.codement.addLine(alias('+' + name('chatwheel', id), name('chatwheel', id, 0)), 'Prepare Chatwheel');
	for (var i = 0; i < chatwheel.length; i++) {
		var nextCommand = (i === chatwheel.length - 1) ? '+chatwheel' : name('chatwheel', id, oneMore(i));
		this.codement.addLine(alias(name('chatwheel', id, i), multi('chat_wheel_phrase_' + i + ' ' + chatwheel[i], nextCommand)), '▶ ' + manta.data.phrases[chatwheel[i]]);
	}
	this.codement.addLine(alias('-' + name('chatwheel', id), '-chatwheel'), 'Close Chatwheel');
}

module.exports = ChatwheelParser;
