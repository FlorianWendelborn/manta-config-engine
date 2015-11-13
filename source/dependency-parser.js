var constants = require('./constants');

var prefix = constants.prefix;
var separator = constants.separator;
var positions = require('./positions.json');

function DependencyParser (options) {
	this.dependencies = options.dependencies;
	this.cycles = options.cycles;
	this.autoexec = constants.dependencies.initialText;
}

DependencyParser.prototype.parse = function () {
	for (i = 0; i < this.dependencies.length; i++) {
        var dep = this.dependencies[i];
        switch (dep[0]) {
            case "ability":
                switch (dep[1]) {
                    case "quick":
                        this.append('alias "' + prefix + separator + 'ability' + separator + 'quickcast' + separator + dep[2] + '" "dota_ability_quickcast ' + dep[2] + '"');
                    break;
                    case "self":
                        this.append('alias "' + prefix + separator + 'ability' + separator + 'selfcast' + separator + dep[2] + '" "dota_ability_execute ' + dep[2] + '; dota_ability_execute ' + dep[2] + '"');
                    break;
                    case "normal":
                        this.append('alias "' + prefix + separator + 'ability' + separator + 'normalcast' + separator + dep[2] + '" "dota_ability_execute ' + dep[2] + '"');
                    break;
                    case "smart":
                        var name = prefix + separator + 'ability' + separator + 'smartcast' + separator + dep[2];
                        this.append('alias "+' + name + '" "dota_ability_execute ' + dep[2] + '; alias -' + name + ' dota_ability_quickcast ' + dep[2] + '"');
                        this.append('alias "-' + name + '" "dota_ability_quickcast ' + dep[2] + '"');
                    break;
                }
            break;
            case "item":
                switch (dep[1]) {
                    case "quick":
                        this.append('alias "' + prefix + separator + 'item' + separator + 'quickcast' + separator + dep[2] + '" "dota_item_quick_cast ' + dep[2] + '"');
                    break;
                    case "self":
                        this.append('alias "' + prefix + separator + 'item' + separator + 'selfcast' + separator + dep[2] + '" "dota_item_execute ' + dep[2] + '; dota_item_execute ' + dep[2] + '"');
                    break;
                    case "normal":
                        this.append('alias "' + prefix + separator + 'item' + separator + 'normalcast' + separator + dep[2] + '" "dota_item_execute ' + dep[2] + '"');
                    break;
                    case "smart":
                        var name = prefix + separator + 'item' + separator + 'smartcast' + separator + dep[2];
                        this.append('alias "+' + name + '" "dota_item_execute ' + dep[2] + '; alias -' + name + ' dota_item_quick_cast ' + dep[2] + '"');
                        this.append('alias "-' + name + '" "dota_item_quick_cast ' + dep[2] + '"');
                    break;
                }
            break;
            case "cycle":
				this.append(constants.dependencies.cycleText.replace('{id}', dep[1]));
                var name = prefix + separator + 'cycle' + separator + dep[1];
                var cycle = this.cycles[dep[1]];
                for (var j = 0; j < cycle.length; j++) {
                    if (j !== cycle.length-1) { // not the last item
                        this.append('alias "' + name + separator + j + '" "alias ' + name + ' ' + name + separator + (j+1) + '; ' + name + separator + 'command' + separator + j + '"');
                    } else { // the last item
                        this.append('alias "' + name + separator + j + '" "alias ' + name + ' ' + name + separator + 0 + '; ' + name + separator + 'command' + separator + j + '"');
                    }
                }
                this.append('alias ' + name + ' ' + name + separator + 0);
            break;
            case "view":
                switch (dep[1]) {
                    case "rune":
                        switch (dep[2]) {
                            case "toggle":
                                var rune = prefix + separator + 'view' + separator + 'rune' + separator + 'toggle';
                                var topRune = rune + separator + 'top';
                                var bottomRune = rune + separator + 'bottom';
                                this.append('alias "+' + rune + '" "' + topRune + '"');
                                this.append('alias "-' + rune + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                                this.append('alias "' + topRune + '" "dota_camera_set_lookatpos ' + positions.rune.top + '; alias +' + rune + ' ' + bottomRune + '"');
                                this.append('alias "' + bottomRune + '" "dota_camera_set_lookatpos ' + positions.rune.bottom + '; alias +' + rune + ' ' + topRune + '"');
                            break;
                            case "top":
                                var rune = prefix + separator + 'view' + separator + 'rune' + separator + 'top';
                                this.append('alias "+' + rune + '" "dota_camera_set_lookatpos ' + positions.rune.top + '"');
                                this.append('alias "-' + rune + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                            break;
                            case "bottom":
                                var rune = prefix + separator + 'view' + separator + 'rune' + separator + 'bottom';
                                this.append('alias "+' + rune + '" "dota_camera_set_lookatpos ' + positions.rune.bottom + '"');
                                this.append('alias "-' + rune + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                            break;
                        }
                    break;
                    case "base":
                        switch (dep[2]) {
                            case "toggle":
                                var base = prefix + separator + 'view' + separator + 'base' + separator + 'toggle';
                                var direBase = base + separator + 'dire';
                                var radiantBase = base + separator + 'radiant';

                                this.append('alias "+' + base + '" "' + radiantBase + '"');
                                this.append('alias "-' + base + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                                this.append('alias "' + direBase + '" "dota_camera_set_lookatpos ' + positions.base.dire + '; alias +' + base + ' ' + radiantBase + '"');
                                this.append('alias "' + radiantBase + '" "dota_camera_set_lookatpos ' + positions.base.radiant + '; alias +' + base + ' ' + direBase + '"');
                            break;
                            case "radiant":
                                var base = prefix + separator + 'view' + separator + 'base' + separator + 'radiant';
                                this.append('alias "+' + base + '" "dota_camera_set_lookatpos ' + positions.base.radiant + '"');
                                this.append('alias "-' + base + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                            break;
                            case "dire":
                                var base = prefix + separator + 'view' + separator + 'base' + separator + 'dire';
                                this.append('alias "+' + base + '" "dota_camera_set_lookatpos ' + positions.base.dire + '"');
                                this.append('alias "-' + base + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                            break;
                        }
                    break;
                }
            break;
            case "layout":
                this.append('alias +' + prefix + separator + 'layout' + separator + dep[1] + ' "exec layout-' + dep[1] + '.cfg"');
                this.append('alias -' + prefix + separator + 'layout' + separator + dep[1] + ' "exec layout-0.cfg"');
            break;
            case "include":
                this.append(dep[1]);
            break;
            default:
                console.error('unresolved dependency', dep);
        }
    }
	return this.autoexec;
};

DependencyParser.prototype.append = function (text) {
	this.autoexec += text + '\n';
};

module.exports = DependencyParser;
