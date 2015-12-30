#! /usr/bin/env node
var manta = require('./');
var path = require('path');
var fs = require('fs');
var os = require('os');

var argv = require('minimist')(process.argv.slice(2));

// guess preset

var presetName = argv._ && argv._.length ? path.join(process.cwd(), argv._[0]) : __dirname + '/../presets/default.json';

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
		defaultPath = os.homedir() + '/.steam/steam/steamapps/common/dota 2 beta/game/dota/cfg';
}

if (argv.path) {
	console.log(argv.path);
}

var pDestination = argv.path ? path.join(process.cwd(), argv.path) : defaultPath;

// just do it

try {
	console.log('trying to read preset ' + presetName);
	var preset = require(presetName);
	try {
		console.log('trying to compile preset ' + presetName);
		manta.compile(preset, function (error, data) {
			try {
				console.log('trying to write preset to ' + pDestination);
				for (var i in data) {
					var p = pDestination + path.sep + i;
					console.log('writing ' + p);
					fs.writeFileSync(p, data[i]);
				}
				console.log('successfully compiled & written preset \'' + path.basename(presetName) + '\' to ' + pDestination);
			} catch (error) {
				console.error('could not write preset');
				throw error;
			}
		});
	} catch (error) {
		console.error('could not compile preset, double-check the preset\'s syntax');
		throw error;
	}
} catch (error) {
	console.error('could not read preset');
	throw error;
}
