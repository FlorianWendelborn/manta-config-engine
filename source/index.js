var constants = require('./constants.json');
var prefix = constants.prefix;
var separator = constants.separator;

var phrases = require('./phrases.json');
var positions = require('./positions.json');

var Layout = require('./layout');

function compile (preset, callback) {
    // used variables

    var result = {};

    var autoexec = constants.initialText;
        dependencies = [];

    var i, j;

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
            if (score === dependencies[i].length) {
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
    setting(preset.netgraph, 'dota_hud_netgraph');
    setting(preset.autoRepeatRightMouse, 'dota_player_auto_repeat_right_mouse');
    setting(preset.forceMovementDirection, 'cl_dota_alt_unit_movetodirection')
    setting(preset.unifiedUnitOrders, 'dota_player_multipler_orders');
    setting(preset.respawnCamera, 'dota_reset_camera_on_spawn');
    setting(preset.disableAutoAttack, 'dota_player_units_auto_attack', true);
    setting(preset.disableAutoAttackAfterSpell, 'dota_player_units_auto_attack_after_spell', true);
    setting(preset.rangefinder, 'dota_enable_range_finder');
    setting(preset.playerNames, 'dota_always_show_player_names');
    setting(preset.gridView, 'dota_shop_view_mode');
    setting(preset.disableHeroFinder, 'dota_show_hero_finder', true);
    setting(preset.disableZoom, 'dota_camera_disable_zoom');
    setting(preset.minimapProximityScale, 'dota_minimap_hero_scalar');
    settingValue(preset.minimapProximityScaleDistance, 'dota_minimap_hero_scalar_distance');
    settingValue(preset.minimapProximityScaleMinimum, 'dota_minimap_hero_scalar_minimum');
    settingValue(preset.cameraSpeed, 'dota_camera_speed');

    // build all chatwheels
    for (i = 0; i < preset.chatwheels.length; i++) {
        addChatwheel(i, preset.chatwheels[i]);
    }

    // build all keyboard layouts
    for (i = 0; i < preset.layouts.length; i++) {
        var layout = new Layout(preset.layouts[i]);
        layout.depend = depend;
        for (j in layout.keybinds) {
            layout.bindKey(j, layout.keybinds[j]);
        }

        result['layout-' + i + '.cfg'] = layout.text;
    }

    // build dependencies
    for (i = 0; i < dependencies.length; i++) {
        var dep = dependencies[i];
        switch (dep[0]) {
            case "ability":
                switch (dep[1]) {
                    case "quick":
                        append('alias "' + prefix + separator + 'ability' + separator + 'quickcast' + separator + dep[2] + '" "dota_ability_quickcast ' + dep[2] + '"');
                    break;
                    case "self":
                        append('alias "' + prefix + separator + 'ability' + separator + 'selfcast' + separator + dep[2] + '" "dota_ability_execute ' + dep[2] + '; dota_ability_execute ' + dep[2] + '"');
                    break;
                    case "normal":
                        append('alias "' + prefix + separator + 'ability' + separator + 'normalcast' + separator + dep[2] + '" "dota_ability_execute ' + dep[2] + '"');
                    break;
                }
            break;
            case "item":
                switch (dep[1]) {
                    case "quick":
                        append('alias "' + prefix + separator + 'item' + separator + 'quickcast' + separator + dep[2] + '" "dota_item_quick_cast ' + dep[2] + '"');
                    break;
                    case "self":
                        append('alias "' + prefix + separator + 'item' + separator + 'selfcast' + separator + dep[2] + '" "dota_item_execute ' + dep[2] + '; dota_item_execute ' + dep[2] + '"');
                    break;
                    case "normal":
                        append('alias "' + prefix + separator + 'item' + separator + 'normalcast' + separator + dep[2] + '" "dota_item_execute ' + dep[2] + '"');
                    break;
                }
            break;
            case "view":
                switch (dep[1]) {
                    case "rune":
                        switch (dep[2]) {
                            case "toggle":
                                var rune = prefix + separator + 'view' + separator + 'rune' + separator + 'toggle';
                                var topRune = rune + separator + 'top';
                                var bottomRune = rune + separator + 'bottom';
                                append('alias "+' + rune + '" "' + topRune + '"');
                                append('alias "-' + rune + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                                append('alias "' + topRune + '" "dota_camera_set_lookatpos ' + positions.rune.top + '; alias +' + rune + ' ' + bottomRune + '"');
                                append('alias "' + bottomRune + '" "dota_camera_set_lookatpos ' + positions.rune.bottom + '; alias +' + rune + ' ' + topRune + '"');
                            break;
                            case "top":
                                var rune = prefix + separator + 'view' + separator + 'rune' + separator + 'top';
                                append('alias "+' + rune + '" "dota_camera_set_lookatpos ' + positions.rune.top + '"');
                                append('alias "-' + rune + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                            break;
                            case "bottom":
                                var rune = prefix + separator + 'view' + separator + 'rune' + separator + 'bottom';
                                append('alias "+' + rune + '" "dota_camera_set_lookatpos ' + positions.rune.bottom + '"');
                                append('alias "-' + rune + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                            break;
                        }
                    break;
                    case "base":
                        switch (dep[2]) {
                            case "toggle":
                                var base = prefix + separator + 'view' + separator + 'base' + separator + 'toggle';
                                var direBase = base + separator + 'dire';
                                var radiantBase = base + separator + 'radiant';

                                append('alias "+' + base + '" "' + radiantBase + '"');
                                append('alias "-' + base + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                                append('alias "' + direBase + '" "dota_camera_set_lookatpos ' + positions.base.dire + '; alias +' + base + ' ' + radiantBase + '"');
                                append('alias "' + radiantBase + '" "dota_camera_set_lookatpos ' + positions.base.radiant + '; alias +' + base + ' ' + direBase + '"');
                            break;
                            case "radiant":
                                var base = prefix + separator + 'view' + separator + 'base' + separator + 'radiant';
                                append('alias "+' + base + '" "dota_camera_set_lookatpos ' + positions.base.radiant + '"');
                                append('alias "-' + base + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                            break;
                            case "dire":
                                var base = prefix + separator + 'view' + separator + 'base' + separator + 'dire';
                                append('alias "+' + base + '" "dota_camera_set_lookatpos ' + positions.base.dire + '"');
                                append('alias "-' + base + '" "dota_recent_event; dota_recent_event; +dota_camera_follow"');
                            break;
                        }
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
    if (preset.loadIndicator) {
        if (preset.loadIndicator[0] === 'sound') {
            append('playsound sounds/' + preset.loadIndicator[1]);
        } else if (preset.loadIndicator[0] === 'text') {
            append('exec "' + preset.loadIndicator[1] + '"');
        }
    }

    result['autoexec.cfg'] = autoexec;

    return callback(null, result);
}

module.exports = {
    compile: compile,
    phrases: phrases
};
