var fs = require('fs');
var name = process.argv[2] || 'dodekeract';
var config = require('./presets/' + name + '.json');

// clear log
process.stdout.write('\033c');

// global variables

var pDestination = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota\\cfg';

var autoexec = '', dependencies = [];

var i, j;

var layout, key;

var prefix = 'custom';
var separator = '_';

// preparing functions used for parsing

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
        if (score == dependencies[i].length) {
            console.log('already depending on', options);
            return;
        }
    }
    dependencies.push(options);
}

function addChatwheel (id, options) {
    var command = '';
    for (var i = 0; i < options.length; i++) {
        command += 'chat_wheel_phrase_' + i + ' ' + options[i] + ';';
        if (i === options.length-1) {
            command += ' +chatwheel';
        }
    }
    append('alias +' + prefix + separator + 'chatwheel' + separator + id + ' "' + command + '"');
    append('alias -' + prefix + separator + 'chatwheel' + separator + id + ' "-chatwheel"');
}

function Layout (options) {
    this.text = 'unbindall\n';
    this.keybinds = options.keybinds;
}

Layout.prototype.append = function (s) {
    this.text += s + '\n';
}

Layout.prototype.bindKey = function (key, options) {
    var command = '';
    switch (options[0]) {
        case "ability":
            command = prefix + separator + options[1] + separator + 'ability' + separator + options[2];
            depend(options);
        break;
        case "item":
            command = prefix + separator + options[1] + separator + 'item' + separator + options[2];
            depend(options);
        break;
        case "layout":
            command = '"+' + prefix + separator + 'layout' + separator + options[1] + '"';
            depend(options);
        break;
        case "chatwheel":
            command = '+' + prefix + separator + 'chatwheel' + separator + options[1];
        break;
        case "reload":
            command = '"exec autoexec.cfg"';
        break;
        case "command":
            command = options[1];
        break;
        case "view":
            command = '+' + prefix + separator + 'view' + separator + options[1];
            depend(options);
        break;
    }
    this.append('bind "' + key + '" ' + command);
}

function setting (condition, command, inverse) {
    if (!inverse && condition || inverse && !condition) {
        append(command + ' 1');
    } else {
        append(command + ' 0');
    }
}

function settingValue (value, command) {
    if (value !== undefined && value !== null) {
        append(command + ' ' + value);
    }
}

// start parsing

// game settings
setting(config.netgraph, 'dota_hud_netgraph');
setting(config.autoRepeatRightMouse, 'dota_player_auto_repeat_right_mouse');
setting(config.forceMovementDirection, 'cl_dota_alt_unit_movetodirection')
setting(config.unifiedUnitOrders, 'dota_player_multipler_orders');
setting(config.respawnCamera, 'dota_reset_camera_on_spawn');
setting(config.disableAutoAttack, 'dota_player_units_auto_attack');
setting(config.disableAutoAttackAfterSpell, 'dota_player_units_auto_attack_after_spell');
setting(config.rangefinder, 'dota_enable_range_finder');
setting(config.playerNames, 'dota_always_show_player_names');
setting(config.gridView, 'dota_shop_view_mode');
setting(config.disableHeroFinder, 'dota_show_hero_finder', true);
setting(config.disableZoom, 'dota_camera_disable_zoom');
setting(config.minimapProximityScale, 'dota_minimap_hero_scalar');
settingValue(config.minimapProximityScaleDistance, 'dota_minimap_hero_scalar_distance');
settingValue(config.minimapProximityScaleMinimum, 'dota_minimap_hero_scalar_minimum');
settingValue(config.cameraSpeed, 'dota_camera_speed');

// build all chatwheels
for (i = 0; i < config.chatwheels.length; i++) {
    addChatwheel(i, config.chatwheels[i]);
}

// build all keyboard layouts
for (i = 0; i < config.layouts.length; i++) {
    layout = new Layout(config.layouts[i]);
    for (j in layout.keybinds) {
        layout.bindKey(j, layout.keybinds[j]);
    }

    fs.writeFileSync(pDestination + '/layout-' + i + '.cfg', layout.text);
    console.log('layout ' + i + ':\n', layout.text);
}

// build dependencies
for (i = 0; i < dependencies.length; i++) {
    var dep = dependencies[i];
    switch (dep[0]) {
        case "ability":
            switch (dep[1]) {
                case "quickcast":
                    append('alias "' + prefix + separator + 'quickcast' + separator + 'ability' + separator + dep[2] + '" "dota_ability_quickcast ' + dep[2] + '"');
                break;
                case "selfcast":
                    append('alias "' + prefix + separator + 'selfcast' + separator + 'ability' + separator + dep[2] + '" "dota_ability_execute ' + dep[2] + '; dota_ability_execute ' + dep[2] + '"');
                break;
                case "normalcast":
                    append('alias "' + prefix + separator + 'normalcast' + separator + 'ability' + separator + dep[2] + '" "dota_ability_execute ' + dep[2] + '"');
                break;
            }
        break;
        case "item":
            switch (dep[1]) {
                case "quickcast":
                    append('alias "' + prefix + separator + 'quickcast' + separator + 'item' + separator + dep[2] + '" "dota_item_quick_cast ' + dep[2] + '"');
                break;
                case "selfcast":
                    append('alias "' + prefix + separator + 'selfcast' + separator + 'item' + separator + dep[2] + '" "dota_item_execute ' + dep[2] + '; dota_item_execute ' + dep[2] + '"');
                break;
                case "normalcast":
                    append('alias "' + prefix + separator + 'normalcast' + separator + 'item' + separator + dep[2] + '" "dota_item_execute ' + dep[2] + '"');
                break;
            }
        break;
        case "view":
            switch (dep[1]) {
                case "rune":
                    var rune = prefix + separator + 'view' + separator + 'rune';
                    var topRune = prefix + separator + 'view' + separator + 'rune' + separator + 'top';
                    var bottomRune = prefix + separator + 'view' + separator + 'rune' + separator + 'bottom';
                    append('alias "+' + rune + '" "' + topRune + '"');
                    append('alias "-' + rune + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                    append('alias "' + topRune + '" "dota_camera_set_lookatpos -2273 1800; alias +' + rune + ' ' + bottomRune + '"');
                    append('alias "' + bottomRune + '" "dota_camera_set_lookatpos 3035 -2350; alias +' + rune + ' ' + topRune + '"');
                break;
            }
        break;
        case "layout":
            append('alias +' + prefix + separator + 'layout' + separator + dep[1] + ' "exec layout-' + dep[1] + '.cfg"');
            append('alias -' + prefix + separator + 'layout' + separator + dep[1] + ' "exec layout-0.cfg"');
        break;
        default:
            console.error('unresolved dependency', dep);
    }
}

// bind primary layout
append('exec layout-0.cfg');

// should the user be notified that the autoexec ran?
if (config.loadIndicator) {
    if (config.loadIndicator[0] === 'sound') {
        append('playsound sounds/' + config.loadIndicator[1]);
    } else if (config.loadIndicator[0] === 'text') {
        append('exec "' + config.loadIndicator[1] + '"');
    }
}

fs.writeFileSync(pDestination + '/autoexec.cfg', autoexec);
console.log('autoexec:\n' + autoexec + '\n');
