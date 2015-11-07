var constants = require('./constants');
var prefix = constants.prefix;
var separator = constants.separator;

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
            this.depend(options);
        break;
        case "item":
            command = prefix + separator + 'item' + separator + options[1] + 'cast' + separator + options[2];
            this.depend(options);
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
            this.depend(options);
        break;
    }
    this.append('bind "' + key + '" ' + command);
}

module.exports = Layout;
