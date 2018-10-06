# Manta Config Engine

[![Join the chat at https://gitter.im/dodekeract/manta-config-engine](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dodekeract/manta-config-engine) [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT) [![Code Climate](https://codeclimate.com/github/dodekeract/manta-config-engine/badges/gpa.svg)](https://codeclimate.com/github/dodekeract/manta-config-engine) [![NPM Downloads](https://img.shields.io/npm/dt/dota2-manta-config-engine.svg)](https://npmjs.com/package/dota2-manta-config-engine) [![NPM Dependencies](https://david-dm.org/dodekeract/manta-config-engine.svg)](https://david-dm.org/dodekeract/manta-config-engine) [![Code Documentation](https://inch-ci.org/github/dodekeract/manta-config-engine.svg)](https://inch-ci.org/github/dodekeract/manta-config-engine)

Dota 2 configuration builder. Compiles `JSON` to `autoexec`. There also is [a web-app](https://github.com/dodekeract/manta-config-engine-app) to easily create presets and build your own autoexec. The app is [hosted on my server](https://projects.dodekeract.com/manta/), so you don't have to set it up to use it.

## Table Of Contents
<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Table Of Contents](#table-of-contents)
- [Documentation](#documentation)
- [CLI Installation](#cli-installation)
- [Library Installation](#library-installation)
- [CLI options](#cli-options)
- [Library usage](#library-usage)
	- [manta.compile(preset, callback)](#mantacompilepreset-callback)
	- [manta.data](#mantadata)
		- [manta.data.positions](#mantadatapositions)
		- [manta.data.phrases](#mantadataphrases)
	- [manta.parser](#mantaparser)
		- [manta.parser.Layout](#mantaparserlayout)
		- [manta.parser.Setting](#mantaparsersetting)
		- [manta.parser.Chatwheel](#mantaparserchatwheel)
		- [manta.parser.Dependency](#mantaparserdependency)
- [Contribute Your Presets](#contribute-your-presets)
- [Contribute Engine Changes](#contribute-engine-changes)
- [Special Thanks](#special-thanks)
- [License](#license)
- [Changelog](#changelog)

<!-- /TOC -->

## Documentation

The documentation files for this project can be found [here](https://github.com/dodekeract/manta-config-engine-app/tree/master/documentation).

## CLI Installation
- Install [node.js](https://nodejs.org)
- Run `npm install -g dota2-manta-config-engine`.
- Execute `manta-config-engine path-to-preset`, where `path-to-preset` is a relative path.

Beware that the CLI will assume that your Dota 2 is installed in the default Steam location. Use `--path` to specify a different one.

## Library Installation
- Install [node.js](https://nodejs.org)
- Run `npm install -g dota2-manta-config-engine`
- Require manta in your code `var manta = require('dota2-manta-config-engine')`

## CLI options
- `--path=customPath` set a custom output path

## Library usage

### manta.compile(preset, callback)
- Expects a valid preset, see `presets/default.json`.
- Calls `callback` with `err` and `data`. Data is an object containing the `.cfg` filenames and their compiled data.

### manta.data

#### manta.data.positions
An object with all camera positions manta currently uses

#### manta.data.phrases
An object containing all current chatwheel phrases

#### manta.data.emoticons
An object containing most emoticons

#### manta.data.heroes
An object containing all current heroes

### manta.parser

#### manta.parser.Layout
internally used class to parse layouts

#### manta.parser.Setting
internally used class to parse settings

#### manta.parser.Chatwheel
internally used class to parse chatwheels

#### manta.parser.Dependency
internally used class to resolve dependencies

## Contribute Your Presets
- Fork this project.
- Create your own preset file.
- Create a pull request.

## Contribute Engine Changes
- Fork this project.
- Implement new features.
- Create a pull request.

## Special Thanks
- ["The Core"-Config](https://github.com/loopuleasa/dota2-thecore-config-engine) by [@loopuleasa](https://github.com/loopuleasa)
- [D2HeroKeys](https://github.com/Sembrani/D2HeroKeys) by [@Sembrani](https://github.com/Sembrani)
- [Dota 2 VGS](https://github.com/obreitwi/dota2vgs) by [@obreitwi](https://github.com/obreitwi)

## License
[MIT](https://github.com/dodekeract/manta-config-engine/tree/master/documentation/LICENSE.md)

## Changelog
[Changelog](https://github.com/dodekeract/manta-config-engine/tree/master/documentation/CHANGELOG.md)
