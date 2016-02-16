var packageJSON = require('../package.json');
module.exports = {};
module.exports.data = {
	phrases: require('../data/phrases.json'),
	positions: require('../data/positions.json'),
	settings: require('../data/settings.json'),
	constants: require('../data/constants.json'),
	emoticons: require('../data/emoticons.json')
};
module.exports.compile = require('./compile');
module.exports.utils = require('./utils');
module.exports.parser = {
	Chatwheel: require('./parser/chatwheel'),
	Dependency: require('./parser/dependency'),
	Layout: require('./parser/layout'),
	Setting: require('./parser/setting')
};
module.exports.update = require('./update');
module.exports.version = packageJSON.version;
