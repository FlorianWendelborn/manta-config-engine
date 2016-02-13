var manta = require('../');

// utility shorthands, so the commands remain readable
var utils = manta.utils;
var name = utils.name;
var single = utils.single;
var alias = utils.alias;
var bind = utils.bind;

function Layout (options) {
	this.autoexec = manta.data.constants.layouts.initialText.replace('{id}', options.id);
	this.keybinds = options.keybinds;
	this.preset = options.preset;
	this.depend = options.depend;
	this.custom = options.custom;
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
	return this.autoexec;
};

Layout.prototype.bindKey = function (key, options) {
	var command = '';
	switch (options[0]) {
		case "ability":
			if (options[1] === 'smart') {
				command = '+' + name(options);
				this.depend([options[0], 'quick', options[2]]);
				this.depend([options[0], 'normal', options[2]]);
			} else {
				command = name(options);
			}
			this.depend(options);
		break;
		case "item":
			switch (options[1]) {
				case "action":
					command = 'use_item_client actions action_item';
				break;
				case "taunt":
					command = 'use_item_client current_hero taunt';
				break;
				case "smart":
					command = '+' + name(options);
					this.depend([options[0], 'quick', options[2]]);
					this.depend([options[0], 'normal', options[2]]);
					this.depend(options);
				break;
				default:
					command = name(options);
					this.depend(options);
			}
		break;
		case "health":
			command = 'dota_health_per_vertical_marker ' + options[1];
		break;
		case "layout":
			command = '+' + name(options);
			this.depend(options);
		break;
		case "chatwheel":
			command = '+' + name(options);
		break;
		case "reload":
			command = single('exec', 'autoexec.cfg');
		break;
		case "command":
			command = '\"' + options[1] + '\"';
		break;
		case "cycle":
			if (options[2] === 'reset') {
				command = alias(name(options), name(options, 0));
			} else {
				command = name(options);
				options[2] = [];
				for (var i = 0; i < this.preset.cycles[options[1]].length; i++) {
					options[2].push(this.bindKey(false, this.preset.cycles[options[1]][i]));
				}
				this.depend(options);
			}
		break;
		case "open":
			switch (options[1]) {
				case "console":
					command = 'toggleconsole';
				break;
				case "chat":
					command = 'say';
				break;
				case "shop":
					command = 'show_sf_shop';
				break;
				case "shared-units":
					command = 'show_shared_units';
				break;
				case "scoreboard":
					command = '+showscores';
				break;
			}
		break;
		case "voice":
			switch (options[1]) {
				case "team":
					command = '+voicerecord';
				break;
			}
		break;
		case "select":
			switch (options[1]) {
				case "hero":
					command = '+dota_camera_follow';
				break;
				case "all-units":
					command = 'dota_select_all';
				break;
				case "other-units":
					command = 'dota_select_all_others';
				break;
				case "courier":
					command = 'dota_select_courier';
				break;
				case "controlgroup":
					command = single('+dota_control_group ', options[2]);
				break;
				case "next-unit":
					command = 'dota_cycle_selected';
				break;
			}
		break;
		case "courier":
			switch (options[1]) {
				case "deliver":
					command = 'dota_courier_deliver';
				break;
				case "burst":
					command = 'dota_courier_burst';
				break;
			}
		break;
		case "buy":
			switch (options[1]) {
				case "quick":
					command = 'dota_purchase_quickbuy';
				break;
				case "sticky":
					command = 'dota_purchase_stickybuy';
				break;
			}
		break;
		case "pause":
			command = 'dota_pause';
		break;
		case "stop":
			command = 'dota_stop';
		break;
		case "attack":
			command = 'mc_attack';
		break;
		case "hold":
			command = 'dota_hold';
		break;
		case "move":
			command = 'mc_move';
		break;
		case "glyph":
			command = 'dota_glyph';
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
		case "chat":
			switch (options[1]) {
				case "all":
					command = single('say', options[2]);
				break;
				case "team":
					command = single('say_team', options[2]);
				break;
				case "student":
					command = single('say_student', options[2]);
				break;
			}
		break;
		case "camera":
			switch (options[1]) {
				case "up":
					command = '+forward';
				break;
				case "left":
					command = '+moveleft';
				break;
				case "down":
					command = '+back';
				break;
				case "right":
					command = '+moveright';
				break;
			}
		break;
		case "phrase":
			command = single('chatwheel_say', options[1]);
		break;
		case "view":
			command = '+' + name(options);
			this.depend(options);
		break;
	}

	if (key !== false) {
		this.append(bind(key, command));
	}

	return command;
};

module.exports = Layout;
