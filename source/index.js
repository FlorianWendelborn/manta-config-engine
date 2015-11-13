var constants = require('./constants.json');

var phrases = require('./phrases.json');
var positions = require('./positions.json');

var SettingParser = require('./setting-parser');
var DependencyParser = require('./dependency-parser');
var ChatwheelParser = require('./chatwheel-parser');
var LayoutParser = require('./layout-parser');

function compile (preset, callback) {
    // parsing variables
    var result = {};
    var autoexec = constants.initialText;
        dependencies = [];

    // parsing functions

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

    // ### parsing
    // settings
    var settingParser = new SettingParser(preset.settings);
    var settings = settingParser.parse();

    // chatwheels
    var chatwheelParser = new ChatwheelParser({
        chatwheels: preset.chatwheels
    });

    // keyboard layouts
    for (var i = 0; i < preset.layouts.length; i++) {
        var layout = new LayoutParser({
            keybinds: preset.layouts[i].keybinds,
            preset: preset,
            depend: depend,
            id: i
        });

        var layoutResult = layout.parse();

        result['layout-' + i + '.cfg'] = layoutResult;
    }

    // dependencies
    var dependencyParser = new DependencyParser({
        dependencies: dependencies,
        cycles: preset.cycles
    });

    // ### assembling
    // settings, chatwheels, dependencies
    append(settings[0]);
    append(chatwheelParser.parse());
    append(dependencyParser.parse());

    // primary layout
    append(constants.bindPrimaryLayout.initialText);

    // load indicator
    append(settings[1]);

    result['autoexec.cfg'] = autoexec;

    return callback(null, result);
}

module.exports = {
    compile: compile,
    phrases: phrases,
    positions: positions,

    LayoutParser: LayoutParser,
    SettingParser: SettingParser,
    ChatwheelParser: ChatwheelParser,
    DependencyParser: DependencyParser
};
