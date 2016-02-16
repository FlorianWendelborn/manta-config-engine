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
		]
	}
});

module.exports = function (preset) {
	return patcher.run(preset);
};
