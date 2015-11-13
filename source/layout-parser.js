var constants = require('./constants');
var prefix = constants.prefix;
var separator = constants.separator;

function Layout (options) {
    this.autoexec = constants.layouts.initialText.replace('{id}', options.id);
    this.keybinds = options.keybinds;
    this.preset = options.preset;
    this.depend = options.depend;
}

Layout.prototype.append = function (s) {
    this.autoexec += s + '\n';
}

Layout.prototype.parse = function () {
    for (var j in this.keybinds) {
        this.bindKey(j, this.keybinds[j]);
    }
    return this.autoexec;
};

Layout.prototype.bindKey = function (key, options) {
    var command = '';
    switch (options[0]) {
        case "ability":
            if (options[1] === 'smart') {
                command = '+' + prefix + separator + 'ability' + separator + options[1] + 'cast' + separator + options[2];
            } else {
                command = prefix + separator + 'ability' + separator + options[1] + 'cast' + separator + options[2];
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
                    command = '+' + prefix + separator + 'item' + separator + options[1] + 'cast' + separator + options[2];
                    this.depend(options);
                break;
                default:
                    command = prefix + separator + 'item' + separator + options[1] + 'cast' + separator + options[2];
                    this.depend(options);
            }
        break;
        case "health":
            command = 'dota_health_per_vertical_marker ' + options[1];
        break;
        case "layout":
            command = '"+' + prefix + separator + 'layout' + separator + options[1] + '"';
            this.depend(options);
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
        case "cycle":
            if (options[2] === 'reset') {
                var name = prefix + separator + 'cycle' + separator + options[1];
                command = 'alias ' + name + ' ' + name + separator + 0;
            } else {
                for (var i = 0; i < this.preset.cycles[options[1]].length; i++) {
                    command = this.bindKey(false, this.preset.cycles[options[1]][i]);
                    this.depend(['include', 'alias "' + prefix + separator + 'cycle' + separator + options[1] + separator + 'command' + separator + i + '" ' + command]);
                }
                command = prefix + separator + 'cycle' + separator + options[1];
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
                    command = '+dota_control_group ' + options[2];
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
        case "learn":
            switch (options[1]) {
                case "stats":
                    command = 'dota_learn_stats';
                break;
            }
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
            command = 'chatwheel_say ' + options[1];
        break;
        case "view":
            command = '+' + prefix + separator + 'view' + separator + options[1] + separator + options[2];
            this.depend(options);
        break;
    }

    if (key !== false) {
        this.append('bind "' + key + '" ' + command);
    }

    return command;
}

module.exports = Layout;
