var constants = require('./constants');
var prefix = constants.prefix;
var separator = constants.separator;

function ChatwheelParser (options) {
	this.chatwheels = options.chatwheels;
	this.autoexec = constants.chatwheels.initialText;
}

ChatwheelParser.prototype.parse = function () {
	for (var i = 0; i < this.chatwheels.length; i++) {
        this.parseOne(i);
    }
	return this.autoexec;
};

ChatwheelParser.prototype.parseOne = function (id) {
	var chatwheel = this.chatwheels[id];
	var command = '';
	for (var i = 0; i < chatwheel.length; i++) {
		command += 'chat_wheel_phrase_' + i + ' ' + chatwheel[i] + ';';
		if (i === chatwheel.length-1) {
			command += ' +chatwheel';
		}
	}
	this.append(constants.chatwheels.chatwheelText.replace('{id}', id));
	this.append('alias +' + prefix + separator + 'chatwheel' + separator + id + ' "' + command + '"');
	this.append('alias -' + prefix + separator + 'chatwheel' + separator + id + ' "-chatwheel"');
}

ChatwheelParser.prototype.append = function (text) {
	this.autoexec += text + '\n';
};

module.exports = ChatwheelParser;
