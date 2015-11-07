#! /usr/bin/env node
var manta = require('./');
var path = require('path');
var fs = require('fs');

console.log('trying to read preset ' + process.argv[2]);

var pDestination = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota\\cfg';

try {
    var preset = require(path.join(process.cwd(), process.argv[2]));
    manta.compile(preset, function (error, data) {
        for (var i in data) {
            var p = pDestination + '\\' + i;
            console.log('writing ' + p);
            fs.writeFileSync(p, data[i]);
        }
        console.log('finished writing preset');
    });
} catch (error) {
    console.error('could not read preset');
    throw error;
}
