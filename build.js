var fs = require('fs');
var name = process.argv[2] || 'dodekeract';
var config = require('./presets/' + name + '.json');

// clear log
process.stdout.write('\033c');

// global variables

var pDestination = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota\\cfg';

var autoexec = '// generated using https://github.com/dodekeract/manta-config-engine\n',
    dependencies = [],
    layout;

var prefix = 'custom',
    separator = '_';

var i, j;

var positions = {
    rune: {
        top: '-2273 1800',
        bottom: '3035 -2350'
    },
    base: {
        radiant: '-7000 -6500',
        dire: '7000 6250'
    }
};

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
            command = prefix + separator + 'ability' + separator + options[1] + 'cast' + separator + options[2];
            depend(options);
        break;
        case "item":
            command = prefix + separator + 'item' + separator + options[1] + 'cast' + separator + options[2];
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
        case "courier":
            switch (options[1]) {
                case "deliver":
                    command = 'dota_courier_deliver';
                break;
                case "select":
                    command = 'dota_select_courier';
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
        case "chat":
            switch (options[1]) {
                case "all":
                    command = 'say "' + options[2] + '"';
                break;
                case "team":
                    command = 'say_team "' + options[2] + '"';
                break;
                case "student":
                    command = 'say_student "' + options[2] + '"';
                break;
            }
        break;
        case "phrase":
            command = 'chatwheel_say ' + options[1];
        break;
        case "view":
            command = '+' + prefix + separator + 'view' + separator + options[1] + separator + options[2];
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
setting(config.disableAutoAttack, 'dota_player_units_auto_attack', true);
setting(config.disableAutoAttackAfterSpell, 'dota_player_units_auto_attack_after_spell', true);
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
if (config.loadIndicator) {
    if (config.loadIndicator[0] === 'sound') {
        append('playsound sounds/' + config.loadIndicator[1]);
    } else if (config.loadIndicator[0] === 'text') {
        append('exec "' + config.loadIndicator[1] + '"');
    }
}

fs.writeFileSync(pDestination + '/autoexec.cfg', autoexec);
console.log('autoexec:\n' + autoexec + '\n');
