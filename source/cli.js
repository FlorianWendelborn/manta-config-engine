#! /usr/bin/env node
var manta = require('./');
var path = require('path');
var fs = require('fs');
var os = require('os');

var argv = require('minimist')(process.argv.slice(2));

// guess preset

var preset = argv._ && argv._.length ? path.join(process.cwd(), argv._[0]) : __dirname + '/../presets/default.json';

// guess default path

var defaultPath = '';

switch (os.platform()) {
    case 'win32':
        defaultPath = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota\\cfg';
    break;
    case 'darwin':
        defaultPath = os.homedir() + '/Library/Application Support/Steam/steamapps/common/dota 2 beta/game/dota/cfg';
    break;
    default:
        defaultPath = os.homedir() + '/.local/share/Steam/SteamApps/common/dota 2 beta/dota/cfg/autoexec.cfg';
}

console.log(argv.path);

var pDestination = argv.path ? path.join(process.cwd(), argv.path) : defaultPath;

// just do it

console.log('trying to read preset ' + preset);

try {
    var preset = require(preset);
    manta.compile(preset, function (error, data) {
        for (var i in data) {
            var p = pDestination + path.sep + i;
            console.log('writing ' + p);
            fs.writeFileSync(p, data[i]);
        }
        console.log('finished writing preset');
    });
} catch (error) {
    console.error('could not read preset');
    throw error;
}
