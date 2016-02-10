var manta = require('../');
var codements = require('codements');
var dependencies = manta.data.constants.dependencies;

var positions = manta.data.positions;

// utility shorthands, so the commands remain readable
var utils = manta.utils;
var multi = utils.multi;
var alias = utils.alias;
var name = utils.name;
var macro = utils.macro;
var single = utils.single;
var oneMore = utils.oneMore;

function DependencyParser (options) {
	this.dependencies = options.dependencies;
	this.cycles = options.cycles;
	this.autoexec = dependencies.initialText;
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
						this.codement.addLine(alias(name(dep), single('dota_ability_execute', dep[2])), 'Normal-Cast Ability ' + oneMore(dep[2]));
					break;
					case "auto":
						switch (dep[2]) {
							case "toggle":
								this.codement.addLine(alias(name(dep), macro('dota_ability_autocast', 0, 3)), 'Toggle Auto-Cast');
							break;
							default:
								this.codement.addLine(alias(name(dep), single('dota_ability_autocast', dep[2])), 'Toggle Auto-Cast For Ability ' + oneMore(dep[2]));
						}
					break;
					case "quick":
						this.codement.addLine(alias(name(dep), single('dota_ability_quickcast', dep[2])), 'Quick-Cast Ability ' + oneMore(dep[2]));
					break;
					case "self":
						this.codement.addLine(alias(name(dep), multi('dota_ability_execute ' + dep[2], 'dota_ability_execute ' + dep[2])), 'Self-Cast Ability ' + oneMore(dep[2]));
					break;
					case "smart":
						this.codement.addLine(alias('+' + name(dep), multi(name(dep[0], 'normal', dep[2]), alias('-' + name(dep), name(dep[0], 'normal', dep[2])))), 'Smart-Cast Ability ' + oneMore(dep[2]));
						this.codement.addLine(alias('-' + name(dep), name(dep[0], 'quick', dep[2])), 'Smart-Cast Ability ' + oneMore(dep[2]));
					break;
				}
			break;
			case "cycle":
				var cycle = this.cycles[dep[1]];
				this.append(this.codement.render());
				this.codement.reset();
				this.codement.addLine(dependencies.cycleText.replace('{id}', dep[1]));
				this.codement.addLine(alias(name(dep[0], dep[1]), name(dep[0], dep[1], 0)), 'Prepare Cycle');
				for (var j = 0; j < cycle.length; j++) {
					if (j !== cycle.length - 1) { // not the last item
						this.codement.addLine(alias(name(dep[0], dep[1], j), multi(alias(name(dep[0], dep[1]), name(dep[0], dep[1], j + 1)), name(dep[0], dep[1], 'command', j))), 'Cycle Through');
					} else { // the last item
						this.codement.addLine(alias(name(dep[0], dep[1], j), multi(alias(name(dep[0], dep[1]), name(dep[0], dep[1], 0)), name(dep[0], dep[1], 'command', j))), 'Finish Cycle');
					}
				}
				for (var j = 0; j < dep[2].length; j++) {
					this.codement.addLine(alias(name(dep[0], dep[1], 'command', j), multi(dep[2][j])), 'Command ' + oneMore(j));
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
						this.codement.addLine(alias(name(dep), single('dota_item_execute', dep[2])), 'Normal-Cast Item ' + oneMore(dep[2]));
					break;
					case "quick":
						this.codement.addLine(alias(name(dep), single('dota_item_quick_cast', dep[2])), 'Quick-Cast Item ' + oneMore(dep[2]));
					break;
					case "self":
						this.codement.addLine(alias(name(dep), multi('dota_item_execute ' + dep[2], 'dota_item_execute ' + dep[2])), 'Self-Cast Item ' + oneMore(dep[2]));
					break;
					case "smart":
						this.codement.addLine(alias('+' + name(dep), multi(name(dep[0], 'normal', dep[2]), alias('-' + name(dep), name(dep[0], 'normal', dep[2])))), 'Smart-Cast Item ' + oneMore(dep[2]));
						this.codement.addLine(alias('-' + name(dep), name(dep[0], 'quick', dep[2])), 'Smart-Cast Item ' + oneMore(dep[2]));
					break;
				}
			break;
			case "layout":
				this.codement.addLine(alias('+' + name(dep), single('exec', 'layout-' + dep[1] + '.cfg')), 'Load Layout ' + oneMore(dep[1]));
				this.codement.addLine(alias('-' + name(dep), single('exec', 'layout-0.cfg')), 'Unload Layout ' + oneMore(dep[1]));
			break;
			case "view":
				this.append(this.codement.render());
				this.codement.reset();
				switch (dep[1]) {
					case "rune":
						var rune = name(dep);
						switch (dep[2]) {
							case "toggle":
								this.codement.addLine(dependencies.viewText.replace('{type}', 'Rune (Toggle)'));
								this.codement.addLine(alias('+' + rune, name(rune, 'top')), 'Set Default Rune To Top');
								this.codement.addLine(alias(name(rune, 'top'), multi('dota_camera_set_lookatpos ' + positions.rune.top.join(' '), name(rune, 0))), 'Look At Top Rune');
								this.codement.addLine(alias(name(rune, 'bottom'), multi('dota_camera_set_lookatpos ' + positions.rune.bottom.join(' '), name(rune, 1))), 'Look At Bottom Rune');
								this.codement.addLine(alias(name(rune, 0), multi(alias('+' + rune, name(rune, 'bottom')))), 'Set Bottom As Next Rune');
								this.codement.addLine(alias(name(rune, 1), multi(alias('+' + rune, name(rune, 'top')))), 'Set Top As Next Rune');
								this.codement.addLine(alias('-' + rune, multi('dota_recent_event', 'dota_recent_event', '+dota_camera_follow')), 'Jump Back');
							break;
							case "top":
								this.codement.addLine(dependencies.viewText.replace('{type}', 'Top Rune'));
								this.codement.addLine(alias('+' + rune, multi('dota_camera_set_lookatpos ' + positions.rune.top.join(' '))), 'Look At Top Rune');
								this.codement.addLine(alias('-' + rune, multi('dota_recent_event', 'dota_recent_event', '+dota_camera_follow')), 'Jump Back');
							break;
							case "bottom":
								this.codement.addLine(dependencies.viewText.replace('{type}', 'Bottom Rune'));
								this.codement.addLine(alias('+' + rune, multi('dota_camera_set_lookatpos ' + positions.rune.bottom.join(' '))), 'Look At Bottom Rune');
								this.codement.addLine(alias('-' + rune, multi('dota_recent_event', 'dota_recent_event', '+dota_camera_follow')), 'Jump Back');
							break;
						}
					break;
					case "base":
						var base = name(dep);
						switch (dep[2]) {
							case "toggle":
								this.codement.addLine(dependencies.viewText.replace('{type}', 'Base (Toggle)'));
								this.codement.addLine(alias('+' + base, name(base, 'radiant')), 'Set Default Base To Radiant');
								this.codement.addLine(alias(name(base, 'dire'), multi('dota_camera_set_lookatpos ' + positions.base.dire.join(' '), name(base, 0))), 'Look At Dire Base');
								this.codement.addLine(alias(name(base, 'radiant'), multi('dota_camera_set_lookatpos ' + positions.base.radiant.join(' '), name(base, 1))), 'Look At Radiant Base');
								this.codement.addLine(alias(name(base, 0), multi(alias('+' + base, name(base, 'radiant')))), 'Set Radiant As Next Base');
								this.codement.addLine(alias(name(base, 1), multi(alias('+' + base, name(base, 'dire')))), 'Set Dire As Next Base');
								this.codement.addLine(alias('-' + base, multi('dota_recent_event', 'dota_recent_event', '+dota_camera_follow')), 'Jump Back');
							break;
							case "radiant":
								this.codement.addLine(dependencies.viewText.replace('{type}', 'Radiant Base'));
								this.codement.addLine(alias('+' + base, multi('dota_camera_set_lookatpos ' + positions.base.radiant.join(' '))), 'Look At Radiant Base');
								this.codement.addLine(alias('-' + base, multi('dota_recent_event', 'dota_recent_event', '+dota_camera_follow')), 'Jump Back');
							break;
							case "dire":
								this.codement.addLine(dependencies.viewText.replace('{type}', 'Dire Base'));
								this.codement.addLine(alias('+' + base, multi('dota_camera_set_lookatpos ' + positions.base.dire.join(' '))), 'Look At Dire Base');
								this.codement.addLine(alias('-' + base, multi('dota_recent_event', 'dota_recent_event', '+dota_camera_follow')), 'Jump Back');
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
