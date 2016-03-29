var manta = require('../');

// utility shorthands, so the commands remain readable
var utils = manta.utils;
var name = utils.name;
var single = utils.single;
var alias = utils.alias;
var bind = utils.bind;
var multi = utils.multi;

function Layout (options) {
	this.autoexec = manta.data.constants.layouts.initialText;
	this.autoexec = this.autoexec.replace('{version}', manta.version);
	this.autoexec = this.autoexec.replace('{date}', new Date());
	this.autoexec = this.autoexec.replace('{id}', options.id);
	this.keybinds = options.keybinds;
	this.preset = options.preset;
	this.depend = options.depend;
	this.custom = options.custom;
	this.id = options.id;
	this.needsUnloader = false;
}

Layout.prototype.append = function (s) {
	this.autoexec += s + '\n';
};

Layout.prototype.parse = function () {
	for (var j in this.keybinds) {
		this.bindKey(j, this.keybinds[j]);
	}
	if (this.custom) {
		this.append('');
		this.append(manta.data.constants.layouts.customText);
		this.append(this.custom);
	}

	// unloader
	if (this.needsUnloader) {
		this.createUnloader();
	}

	return this.autoexec;
};

Layout.prototype.createUnloader = function () {
	this.append('');
	this.append(manta.data.constants.layouts.unloaderText);

	var unloader = [];
	var length = 0;
	var splitAt = 5;
	for (var i in this.keybinds) {
		var index = Math.floor(length/splitAt);
		if (length % splitAt === 0) {
			unloader[index] = [];
		}
		unloader[index].push('unbind ' + i);
		length++;
	}
	this.append(
		alias(
			name('unload'),
			multi(
				unloader.map(
					function (item, index) {
						return name('unload', index);
					}
				).join('; ')
			)
		)
	);
	for (i = 0; i < unloader.length; i++) {
		this.append(alias(name('unload', i), multi(unloader[i].join('; '))));
	}
}

Layout.prototype.bindKey = function (key, originalOptions) {
	var options = originalOptions.slice(0);
	var command = '';
	switch (options[0]) {
		case 'ability':
			if (options[1] === 'smart') {
				command = '+' + name(options);
				this.depend([options[0], 'quick', options[2]]);
				this.depend([options[0], 'normal', options[2]]);
			} else if (options[1] === 'self') {
				this.depend(['enable-selfcast']);
				command = name(options);
			} else {
				command = name(options);
			}
			this.depend(options);
		break;

		case 'buy':
			switch (options[1]) {
				case 'quick':
					command = 'dota_purchase_quickbuy';
				break;
				case 'sticky':
					command = 'dota_purchase_stickybuy';
				break;
				default:
					var tab = manta.data.items[options[1]].tab;
					var row = manta.data.items[options[1]].row;
					command = multi('dota_shop_force_hotkeys 1', 'toggleshoppanel', 'shop_nav_to_tab ' + tab, 'shop_select_itemrow ' + row, 'toggleshoppanel', 'dota_shop_force_hotkeys 0');
			}
		break;

		case 'camera':
			switch (options[1]) {
				case 'up':
					command = '+forward';
				break;
				case 'left':
					command = '+moveleft';
				break;
				case 'down':
					command = '+back';
				break;
				case 'right':
					command = '+moveright';
				break;
				case 'inspect':
					command = 'inspectheroinworld';
				break;
			}
		break;

		case 'chat':
			var message = options[2] || '';

			// apply emoticons
			for (var i in manta.data.emoticons) {
				message = message.replace(
					new RegExp(':' + i + ':', 'g'),
					manta.data.emoticons[i].code
				);
			}

			switch (options[1]) {
				case 'all':
					command = single('say', message);
				break;
				case 'team':
					command = single('say_team', message);
				break;
				case 'student':
					command = single('say_student', message);
				break;
			}
		break;

		case 'chatwheel':
			command = '+' + name(options);
		break;

		case 'command':
			command = '\"' + options[1] + '\"';
		break;

		case 'courier':
			switch (options[1]) {
				case 'deliver':
					command = 'dota_courier_deliver';
				break;
				case 'burst':
					command = 'dota_courier_burst';
				break;
			}
		break;

		case 'cycle':
			if (options[2] === 'reset') {
				command = alias(name(options), name(options, 0));
			} else {
				command = '+' + name(options[0], options[1]);
				options[2] = [];
				for (var i = 0; i < this.preset.cycles[options[1]].length; i++) {
					options[2].push(this.bindKey(false, this.preset.cycles[options[1]][i]));
				}
				this.depend(options);
			}
		break;

		case 'health':
			command = 'dota_health_per_vertical_marker ' + options[1];
		break;

		case 'item':
			switch (options[1]) {
				case 'action':
					command = 'use_item_client actions action_item';
				break;

				case 'smart':
					command = '+' + name(options);
					this.depend([options[0], 'quick', options[2]]);
					this.depend([options[0], 'normal', options[2]]);
					this.depend(options);
				break;

				case 'taunt':
					command = 'use_item_client current_hero taunt';
				break;

				default:
					command = name(options);
					this.depend(options);
			}
		break;

		case 'layout':
			this.needsUnloader = true;
			command = '+' + name(options);
			this.depend(options);
		break;

		case 'learn':
			switch (options[1]) {
				case 'ability':
					command = 'dota_ability_learn_mode';
				break;
				case 'stats':
					command = 'dota_learn_stats';
				break;
				default:
					command = 'dota_ability_learn_mode; dota_ability_execute ' + options[1] + '; dota_ability_learn_mode';
			}
		break;

		case 'open':
			switch (options[1]) {
				case 'console':
					command = 'toggleconsole';
					this.depend(['console']);
				break;
				case 'chat':
					command = 'say';
				break;
				case 'shop':
					command = 'toggleshoppanel';
				break;
				case 'shared-units':
					command = 'show_shared_units';
				break;
				case 'scoreboard':
					command = '+showscores';
				break;
			}
		break;

		case 'phrase':
			command = single('chatwheel_say', options[1]);
		break;

		case 'select':
			switch (options[1]) {
				case 'hero':
					command = '+dota_camera_follow';
				break;
				case 'all-units':
					command = 'dota_select_all';
				break;
				case 'other-units':
					command = 'dota_select_all_others';
				break;
				case 'courier':
					command = 'dota_select_courier';
				break;
				case 'controlgroup':
					command = single('+dota_control_group', options[2]);
				break;
				case 'next-unit':
					command = 'dota_cycle_selected';
				break;
			}
		break;

		case 'view':
			switch (options[1]) {
				case 'recent-event':
					command = 'dota_recent_event';
				break;
				default:
					command = '+' + name(options);
					this.depend(options);
			}
		break;

		case 'voice':
			switch (options[1]) {
				case 'team':
					command = '+voicerecord';
				break;
			}
		break;

		// basic

		case 'attack':
			command = 'mc_attack';
		break;

		case 'buyback':
			command = 'dota_test_buyback';
		break;

		case 'glyph':
			command = 'dota_glyph';
		break;

		case 'grab-stash':
			command = 'stash_grab_all';
		break;

		case 'hold':
			command = 'dota_hold';
		break;

		case 'move':
			command = 'mc_move';
		break;

		case 'patrol':
			command = 'mc_patrol';
		break;

		case 'pause':
			command = 'dota_pause';
		break;

		case 'reload':
			command = single('exec', 'autoexec.cfg');
		break;

		case 'screenshot':
			command = 'jpeg';
		break;

		case 'stop':
			command = 'dota_stop';
		break;
	}

	if (key !== false) {
		this.append(bind(key, command));
	}

	return command;
};

module.exports = Layout;
