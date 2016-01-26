var manta = require('./');

module.exports = function (preset, callback) {
	// initialize variables
	var result = {};
	var autoexec = manta.data.constants.initialText;
		dependencies = [];

	// helper functions
	function append (s) {
		autoexec += s + '\n';
	}

	function depend (options) {
		for (var i = 0; i < dependencies.length; i++) {
			var score = 0;
			for (var j = 0; j < dependencies[i].length; j++) {
				if (dependencies[i][j] === options[j]) {
					score++;
				}
			}
			if (score === dependencies[i].length) {
				return;
			}
		}
		dependencies.push(options);
	}

	function sort (o) {
		// I know this could be done recursively, however, I refuse
		return o.sort(function (a, b) {
			if (a[0] < b[0]) {
				return -1;
			} else if (a[0] > b[0]) {
				return 1;
			} else {
				if (a[1] < b[1]) {
					return -1;
				} else if (a[1] > b[1]) {
					return 1;
				} else {
					if (a[2] < b[2]) {
						return -1;
					} else if (a[2] > b[2]) {
						return 1;
					} else {
						return 0;
					}
				}
			}
		});
	}

	// ### parsing
	// settings
	var settingParser = new manta.parser.Setting(preset.settings);
	var settings = settingParser.parse();

	// chatwheels
	var chatwheelParser = new manta.parser.Chatwheel({
		chatwheels: preset.chatwheels
	});

	// keyboard layouts
	for (var i = 0; i < preset.layouts.length; i++) {
		var layout = new manta.parser.Layout({
			keybinds: preset.layouts[i].keybinds,
			preset: preset,
			depend: depend,
			id: i
		});

		var layoutResult = layout.parse();

		result['layout-' + i + '.cfg'] = layoutResult;
	}

	dependencies = sort(dependencies);

	// dependencies
	var dependencyParser = new manta.parser.Dependency({
		dependencies: dependencies,
		cycles: preset.cycles
	});

	// ### assembling
	// settings, chatwheels, dependencies
	append(settings[0]);
	append(chatwheelParser.parse());
	append(dependencyParser.parse());

	// primary layout
	append(manta.data.constants.bindPrimaryLayout.initialText);

	// load indicator
	append(settings[1]);

	// merge multiple empty lines to one
	autoexec = autoexec.replace(/\n{3,}/g, '\n\n');
	result['autoexec.cfg'] = autoexec;

	setTimeout(function () {
		callback(null, result);
	}, 0);
}
