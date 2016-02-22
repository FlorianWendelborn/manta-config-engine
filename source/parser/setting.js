var codements = require('codements');
var manta = require('../');
var constants = manta.data.constants;
var prefix = constants.prefix;
var separator = constants.separator;

var name = manta.utils.name;
var alias = manta.utils.alias;
var single = manta.utils.single;

function SettingParser (options) {
	this.gameplay = options.gameplay;
	this.performance = options.performance;
	this.engine = options.engine;
	this.autoexec = constants.settings.initialText;
	this.indicator = '';
	this.codement = new codements.SplitView({
		newlineAtEnd: false
	});
}

SettingParser.prototype.parse = function () {
	if (this.gameplay) {
		this.parseCategory('gameplay');
	}

	this.append(this.codement.render());
	this.codement.reset();
	this.append('');

	if (this.performance) {
		this.parseCategory('performance');
	}

	this.append(this.codement.render());
	this.codement.reset();
	this.append('');

	if (this.engine) {
		this.parseEngine();
	}

	this.append(this.codement.render());

	return [this.autoexec, this.indicator];
};

SettingParser.prototype.parseCategory = function (current) {
	this.codement.addLine(manta.data.constants.settings[current + 'InitialText']);
	for (var i in this[current]) {
		var d = manta.data.settings[current][i];
		if (!d.commands || !d.commands.length) {
			console.error('unknown command', i);
		}

		for (var j = 0; j < d.commands.length; j++) {
			var c = d.commands[j];
			var s = c.split(':');
			switch (c[0]) {
				case "b": // boolean (! means inverted)
					this.parseBoolean(this[current][i], s[1].replace('!', ''), d.label, s[1][0] === '!');
				break;
				case "i": // integer (command:subtract:divide)
					this.parseNumber(this[current][i], s[1], d.label, s[2], s[3]);
				break;
				case "c": // two-cases
					this.parseNumber(this[current][i] ? s[1] : s[2], s[3], d.label);
				break;
			}
		}
	}
};

SettingParser.prototype.parseEngine = function () {
	this.append(constants.settings.engineInitialText);

	// input button code is scan code
	this.parseBoolean(
		this.engine.inputButtonCodeIsScanCode,
		manta.data.settings.engine.inputButtonCodeIsScanCode.commands[0],
		manta.data.settings.engine.inputButtonCodeIsScanCode.label
	);

	// alt-key
	if (this.engine.altKey.toUpperCase() !== 'ALT') {
		this.codement.addLine(
			'dota_remap_alt_key ' + this.engine.altKey,
			'Remap Alt Key'
		);
	}

	// load indicator
	if (this.engine.loadIndicator) {
		if (this.engine.loadIndicator[0] === 'sound') {
			this.codement.addLine(
				alias(name('load', 'indicator'), single('playsound', 'sounds/' + this.engine.loadIndicator[1])),
				'Load Indicator (Sound)'
			);
		} else if (this.engine.loadIndicator[0] === 'text') {
			this.codement.addLine(
				alias(name('load', 'indicator'), single('exec', this.engine.loadIndicator[1])),
				'Load Indicator (Text)'
			);
		}
		this.indicator = constants.settings.loadIndicator.initialText + name('load', 'indicator');
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
	if (value != null) {
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
