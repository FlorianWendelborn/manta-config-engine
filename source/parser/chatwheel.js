var manta = require('../');
var codements = require('codements');
var constants = manta.data.constants;
var prefix = constants.prefix;
var separator = constants.separator;

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
	var name = prefix + separator + 'chatwheel' + separator + id;
	var phrasePrefix = name + separator;
	this.codement.addLine(constants.chatwheels.chatwheelText.replace('{id}', id));
	this.codement.addLine('alias +' + name + ' "' + phrasePrefix + 0 + '"', 'Prepare Chatwheel');
	for (var i = 0; i < chatwheel.length; i++) {
		var phraseName = phrasePrefix + i;
		var nextCommand = (i === chatwheel.length - 1) ? '+chatwheel' : phrasePrefix + (i+1);
		this.codement.addLine('alias ' + phraseName + ' "chat_wheel_phrase_' + i + ' ' + chatwheel[i] + '; ' + nextCommand + '"', '▶ ' + manta.data.phrases[chatwheel[i]]);
	}
	this.codement.addLine('alias -' + name + ' "-chatwheel"', 'Close Chatwheel');
}

module.exports = ChatwheelParser;
