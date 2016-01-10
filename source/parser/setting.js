var codements = require('codements');
var manta = require('../');
var constants = manta.data.constants;
var prefix = constants.prefix;
var separator = constants.separator;

function SettingParser (options) {
	this.gameplay = options.gameplay;
	this.performance = options.performance;
	this.engine = options.engine;
	this.autoexec = constants.settings.initialText;
	this.indicator = '';
	this.appendList = [];
	this.codement = new codements.SplitView({
		newlineAtEnd: false
	});
}

SettingParser.prototype.parse = function () {
	if (this.gameplay) {
		this.parseCategory('gameplay');
	}

	if (this.performance) {
		this.parseCategory('performance', 'gameplay');
	}

	if (this.engine) {
		this.parseEngine()
	}

	return [this.autoexec, this.indicator];
}

SettingParser.prototype.parseCategory = function (current, last) {
	if (this[last]) {
		this.append('');
	}
	this.append(manta.data.constants.settings[current + 'InitialText']);
	for (var i in this[current]) {
		var d = manta.data.settings[current][i];
		if (!d.commands || !d.commands.length) {
			console.log('#TODO', i);
		}

		for (var j = 0; j < d.commands.length; j++) {
			var c = d.commands[j];
			var s = c.split(':');
			switch (c[0]) {
				case "b": // boolean (! means inverted)
					this.parseBoolean(this[current][i], s[1].replace('!',''), d.label, s[1][0] === '!');
				break;
				case "i": // integer (command:subtract:divide)
					this.parseNumber(this[current][i], s[1], d.label, s[2], s[3]);
				break;
				case "c": // two-cases
					this.parseNumber(this[current][i] ? s[1] : s[2], s[3], d.label)
				break;
			}
		}
	}

	this.append(this.codement.render());
};

SettingParser.prototype.parseEngine = function () {
	if (this.gameplay || this.performance) {
		this.append('');
	}
	this.append(constants.settings.engineInitialText);

	this.parseBoolean(this.engine.inputButtonCodeIsScanCode, 'input_button_code_is_scan_code');

	// alt-key
	if (this.engine.altKey.toUpperCase() !== 'ALT') {
		this.append('dota_remap_alt_key "' + this.engine.altKey + '"');
	}

	// load indicator
	if (this.engine.loadIndicator) {
		var name = prefix + separator + 'load' + separator + 'indicator';
		if (this.engine.loadIndicator[0] === 'sound') {
			this.append('alias ' + name + ' "playsound sounds/' + this.engine.loadIndicator[1] + '"');
		} else if (this.engine.loadIndicator[0] === 'text') {
			this.append('alias ' + name + ' "exec ' + this.engine.loadIndicator[1] + '"');
		}
		this.indicator = constants.settings.loadIndicator.initialText + name;
	}
};

SettingParser.prototype.parseBoolean = function (condition, command, comment, inverse) {
	if (condition !== undefined) {
		if (!inverse && condition || inverse && !condition) {
			this.codement.addLine(command + ' 1', comment);
		} else {
			this.codement.addLine(command + ' 0', comment);
		}
	}
};

SettingParser.prototype.parseNumber = function (value, command, comment, inverse, unit) {
	if (value !== undefined && value !== null) {
		if (inverse) {
			value = inverse - value;
		}
		if (unit) {
			value /= unit;
		}
		this.codement.addLine(command + ' ' + value, comment);
	}
};

SettingParser.prototype.append = function (text) {
	this.autoexec += text + '\n';
};

module.exports = SettingParser;
