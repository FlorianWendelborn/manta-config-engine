var verjson = require('verjson');

var patcher = new verjson.Patcher({
	formats: {
		'1.5.0': [
			{
				type: 'create',
				keys: {
					cycles: [],
					settings: {},
					'settings.gameplay': {},
					'settings.performance': {},
					'settings.engine': {},
					'settings.engine.altKey': 'ALT',
					'settings.engine.keyboardLayout': 'en-US'
				}
			}, {
				type: 'add-to-array',
				when: 'empty',
				keys: {
					layouts: {
						keybinds: {}
					}
				}
			}
		],
		'1.6.0': [{
			type: 'custom',
			run: function (preset) {
				for (var i = 1; i < preset.layouts.length; i++) {
					for (var j in preset.layouts[i].keybinds) {
						if (preset.layouts[i].keybinds[j][0] === 'layout') {
							preset.layouts[i].keybinds[j][1] = 0;
						}
					}
				}
				return preset;
			}
		}],
		'1.6.5': [{
			type: 'move',
			from: 'settings.engine.loadIndicator.0',
			to: 'settings.engine.loadIndicatorType'
		}, {
			type: 'move',
			from: 'settings.engine.loadIndicator.1',
			to: 'settings.engine.loadIndicator'
		}, {
			type: 'custom',
			run: function (preset) {
				preset.settings.engine.loadIndicator = 'sounds/' + preset.settings.engine.loadIndicator;
				return preset;
			}
		}],
		'1.7.1': [{
			type: 'create',
			keys: {
				'title': 'No Title Entered',
				'description': 'No Description Entered'
			}
		}]
	}
});

module.exports = function (preset) {
	return patcher.run(preset);
};
