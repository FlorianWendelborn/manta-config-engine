var manta = require('../');
var codements = require('codements');
var constants = manta.data.constants;

var prefix = constants.prefix;
var separator = constants.separator;
var positions = manta.data.positions;

function DependencyParser (options) {
	this.dependencies = options.dependencies;
	this.cycles = options.cycles;
	this.autoexec = constants.dependencies.initialText;
	this.codement = new codements.SplitView({
		newLineAtEnd: false
	});
}

DependencyParser.prototype.parse = function () {
	this.codement.reset();
	for (var i = 0; i < this.dependencies.length; i++) {
		var dep = this.dependencies[i];
		switch (dep[0]) {
			case "ability":
				switch (dep[1]) {
					case "normal":
						this.codement.addLine('alias "' + prefix + separator + 'ability' + separator + 'normalcast' + separator + dep[2] + '" "dota_ability_execute ' + dep[2] + '"', 'Normal-Cast Ability ' + (dep[2] + 1));
					break;
					case "quick":
						this.codement.addLine('alias "' + prefix + separator + 'ability' + separator + 'quickcast' + separator + dep[2] + '" "dota_ability_quickcast ' + dep[2] + '"', 'Quick-Cast Ability ' + (dep[2] + 1));
					break;
					case "self":
						this.codement.addLine('alias "' + prefix + separator + 'ability' + separator + 'selfcast' + separator + dep[2] + '" "dota_ability_execute ' + dep[2] + '; dota_ability_execute ' + dep[2] + '"', 'Self-Cast Ability ' + (dep[2] + 1));
					break;
					case "smart":
						var name = prefix + separator + 'ability' + separator + 'smartcast' + separator + dep[2];
						this.codement.addLine('alias "+' + name + '" "dota_ability_execute ' + dep[2] + '; alias -' + name + ' dota_ability_quickcast ' + dep[2] + '"', 'Smart-Cast Ability ' + (dep[2] + 1));
						this.codement.addLine('alias "-' + name + '" "dota_ability_quickcast ' + dep[2] + '"', 'Smart-Cast Ability ' + (dep[2] + 1));
					break;
				}
			break;
			case "cycle":
				var name = prefix + separator + 'cycle' + separator + dep[1];
				var cycle = this.cycles[dep[1]];
				this.append(this.codement.render());
				this.codement.reset();
				this.codement.addLine(constants.dependencies.cycleText.replace('{id}', dep[1]));
				this.codement.addLine('alias ' + name + ' ' + name + separator + 0, 'Prepare Cycle');
				for (var j = 0; j < cycle.length; j++) {
					if (j !== cycle.length-1) { // not the last item
						this.codement.addLine('alias "' + name + separator + j + '" "alias ' + name + ' ' + name + separator + (j+1) + '; ' + name + separator + 'command' + separator + j + '"', 'Cycle Through');
					} else { // the last item
						this.codement.addLine('alias "' + name + separator + j + '" "alias ' + name + ' ' + name + separator + 0 + '; ' + name + separator + 'command' + separator + j + '"', 'Finish Cycle');
					}
				}
				for (var j = 0; j < dep[2].length; j++) {
					this.codement.addLine('alias "' + name + separator + 'command' + separator + j + '" ' + dep[2][j], 'Command ' + (j + 1));
				}
				this.append(this.codement.render());
				this.codement.reset();
			break;
			case "include":
				this.codement.addLine(dep[1]);
			break;
			case "item":
				switch (dep[1]) {
					case "normal":
						this.codement.addLine('alias "' + prefix + separator + 'item' + separator + 'normalcast' + separator + dep[2] + '" "dota_item_execute ' + dep[2] + '"', 'Normal-Cast Item ' + (dep[2] + 1));
					break;
					case "quick":
						this.codement.addLine('alias "' + prefix + separator + 'item' + separator + 'quickcast' + separator + dep[2] + '" "dota_item_quick_cast ' + dep[2] + '"', 'Quick-Cast Item ' + (dep[2] + 1));
					break;
					case "self":
						this.codement.addLine('alias "' + prefix + separator + 'item' + separator + 'selfcast' + separator + dep[2] + '" "dota_item_execute ' + dep[2] + '; dota_item_execute ' + dep[2] + '"', 'Self-Cast Item ' + (dep[2] + 1));
					break;
					case "smart":
						var name = prefix + separator + 'item' + separator + 'smartcast' + separator + dep[2];
						this.codement.addLine('alias "+' + name + '" "dota_item_execute ' + dep[2] + '; alias -' + name + ' dota_item_quick_cast ' + dep[2] + '"', 'Smart-Cast Item ' + (dep[2] + 1));
						this.codement.addLine('alias "-' + name + '" "dota_item_quick_cast ' + dep[2] + '"', 'Smart-Cast Item ' + (dep[2] + 1));
					break;
				}
			break;
			case "layout":
				this.codement.addLine('alias +' + prefix + separator + 'layout' + separator + dep[1] + ' "exec layout-' + dep[1] + '.cfg"', 'Load Layout ' + (dep[1] + 1));
				this.codement.addLine('alias -' + prefix + separator + 'layout' + separator + dep[1] + ' "exec layout-0.cfg"', 'Unload Layout ' + (dep[1] + 1));
			break;
			case "view":
				this.append(this.codement.render());
				this.codement.reset();
				switch (dep[1]) {
					case "rune":
						switch (dep[2]) {
							case "toggle":
								this.codement.addLine(constants.dependencies.viewText.replace('{type}', 'Rune (Toggle)'));
								var rune = prefix + separator + 'view' + separator + 'rune' + separator + 'toggle';
								var topRune = rune + separator + 'top';
								var bottomRune = rune + separator + 'bottom';

								this.codement.addLine('alias "+' + rune + '" "' + topRune + '"', 'Set Default Rune To Top');
								this.codement.addLine('alias "' + topRune + '" "dota_camera_set_lookatpos ' + positions.rune.top.join(' ') + '; ' + rune + separator + 0 + '"', 'Look At Top Rune');
								this.codement.addLine('alias "' + bottomRune + '" "dota_camera_set_lookatpos ' + positions.rune.bottom.join(' ') + '; ' + rune + separator + 1 + '"', 'Look At Bottom Rune');
								this.codement.addLine('alias "' + rune + separator + 0 + '" "alias +' + rune + ' ' + bottomRune + '"', 'Set Bottom As Next Rune');
								this.codement.addLine('alias "' + rune + separator + 1 + '" "alias +' + rune + ' ' + topRune + '"', 'Set Top As Next Rune');
								this.codement.addLine('alias "-' + rune + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"', 'Jump Back');
							break;
							case "top":
								this.codement.addLine(constants.dependencies.viewText.replace('{type}', 'Top Rune'));
								var rune = prefix + separator + 'view' + separator + 'rune' + separator + 'top';
								this.codement.addLine('alias "+' + rune + '" "dota_camera_set_lookatpos ' + positions.rune.top.join(' ') + '"');
								this.codement.addLine('alias "-' + rune + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
							break;
							case "bottom":
								this.codement.addLine(constants.dependencies.viewText.replace('{type}', 'Bottom Rune'));
								var rune = prefix + separator + 'view' + separator + 'rune' + separator + 'bottom';
								this.codement.addLine('alias "+' + rune + '" "dota_camera_set_lookatpos ' + positions.rune.bottom.join(' ') + '"');
								this.codement.addLine('alias "-' + rune + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
							break;
						}
					break;
					case "base":
						switch (dep[2]) {
							case "toggle":
								this.codement.addLine(constants.dependencies.viewText.replace('{type}', 'Base (Toggle)'));
								var base = prefix + separator + 'view' + separator + 'base' + separator + 'toggle';
								var direBase = base + separator + 'dire';
								var radiantBase = base + separator + 'radiant';

								this.codement.addLine('alias "+' + base + '" "' + radiantBase + '"', 'Set Default Base To Radiant');
								this.codement.addLine('alias "' + direBase + '" "dota_camera_set_lookatpos ' + positions.base.dire.join(' ') + '; ' + base + separator + 0 + '"', 'Look At Dire Base');
								this.codement.addLine('alias "' + radiantBase + '" "dota_camera_set_lookatpos ' + positions.base.radiant.join(' ') + '; ' + base + separator + 1 + '"', 'Look At Radiant Base');
								this.codement.addLine('alias "' + base + separator + 0 + '" "alias +' + base + ' ' + radiantBase + '"', 'Set Radiant As Next Base');
								this.codement.addLine('alias "' + base + separator + 1 + '" "alias +' + base + ' ' + direBase + '"', 'Set Dire As Next Base');
								this.codement.addLine('alias "-' + base + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"', 'Jump Back');
							break;
							case "radiant":
								this.codement.addLine(constants.dependencies.viewText.replace('{type}', 'Radiant Base'));
								var base = prefix + separator + 'view' + separator + 'base' + separator + 'radiant';
								this.codement.addLine('alias "+' + base + '" "dota_camera_set_lookatpos ' + positions.base.radiant.join(' ') + '"', 'Look At Radiant Base');
								this.codement.addLine('alias "-' + base + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"', 'Jump Back');
							break;
							case "dire":
								this.codement.addLine(constants.dependencies.viewText.replace('{type}', 'Dire Base'));
								var base = prefix + separator + 'view' + separator + 'base' + separator + 'dire';
								this.codement.addLine('alias "+' + base + '" "dota_camera_set_lookatpos ' + positions.base.dire.join(' ') + '"', 'Look At Dire Base');
								this.codement.addLine('alias "-' + base + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"', 'Jump Back');
							break;
						}
					break;
				}
				this.append(this.codement.render());
				this.codement.reset();
			break;
			default:
				console.error('unresolved dependency', dep);
		}
	}
	this.append(this.codement.render());
	return this.autoexec;
};

DependencyParser.prototype.append = function (text) {
	this.autoexec += text + '\n';
};

module.exports = DependencyParser;
