# Changelog

## 1.7.3 (2016.03.29-20.20)
- fixed console not showing up [#8](https://github.com/dodekeract/manta-config-engine/issues/8)

## 1.7.2 (2016.03.29-19.42)
- added option to force `CRLF` [#9](https://github.com/dodekeract/manta-config-engine/issues/9)

## 1.7.1 (2016.03.29-17.10)
- added `title` and `description` to the presets
- new preset version to include `title` and `description` fields

## 1.7.0 (2016.03.29-15.00)
- added ability to `buy` items
- added new settings
	- `smartMultiUnitCast`
	- `smartDoubleTap`
- added sound
	- `barn_door_open`
- update `crimsonvspurple-blackwidow.json` preset

## 1.6.7 (2016.03.28-22.44)
- fixed load indicator sounds

## 1.6.6 (2016.03.28-21.47)
- added command info for `loadIndicator` to implement [app#49](https://github.com/dodekeract/manta-config-engine-app/issues/49)

## 1.6.5 (2016.03.28-21.30)
- changed preset format to make supporting different load-indicators easier
- added update test script
- update to verjson 0.0.6

## 1.6.4 (2016.03.28-20.44)
- fixed a typo preventing Manta from working

## 1.6.3 (2016.03.28-20.37)
- added `sounds.json` to implement [app#49](https://github.com/dodekeract/manta-config-engine-app/issues/49)

## 1.6.2 (2016.03.28-20.29)
- fixed [app#45](https://github.com/dodekeract/manta-config-engine-app/issues/45)
	- now includes a `-chatwheel` in each layout

## 1.6.1 (2016.03.28-20.20)
- fixed [app#41](https://github.com/dodekeract/manta-config-engine-app/issues/41)
	- won't overwrite preset cycles when compiling

## 1.6.0 (2016.03.25)
- implemented partial unbinding

## 1.5.7 (2016.02.22-18.40)
- fixed `dota_remap_alt_key key` having quotes around the whole command
- added internal hero names to `heroes.json`
- fixed presets using having quotes around controlgroup numbers

## 1.5.6 (2016.02.18-00.50)
- fixed `view,recent-event`
- fixed `inputButtonCodeIsScanCode` not being applied
- modernized `setting.js`
- expanded `settings.json`

## 1.5.5 (2016.02.17-12.58)
- now includes Manta version & generation time in the compiled `autoexec.cfg` and `layout-*.cfg`s

## 1.5.4
- update `verjson` to `0.0.5`
- added `hold` to default preset

## 1.5.3
- added `buyback`, `camera, inspect`, `grab-stash`, `patrol`, `screenshot` and `view, recent-event`
- sorted switch in layout-parser

## 1.5.2
- update `verjson` to `0.0.4`

## 1.5.1
- update `verjson` to `0.0.3`

## 1.5.0
- added `update` to patch old `preset.json`s via `verjson`

## 1.4.3
- fixed cycles (hopefully)

## 1.4.2
- fixed smart-cast behaving really weird

## 1.4.1
- fixed minimap background setting not being inverted

## 1.4.0
- support emoticons in chat

## 1.3.4
- self-cast now depends on `dota_ability_quick_cast 1`

## 1.3.3
- fixed `["open", "shop"]` having visual glitches

## 1.3.2
- added `blank.json` preset

## 1.3.1
- fixed commands adding undefined

## 1.3.0
- added ability learn mode & level up ability

## 1.2.3
- fixed a critical bug regarding git auto-tagging

## 1.2.2
- enabled automatic git tagging of npm versions

## 1.2.1
- begin implementing per-hero-layouts
- added changelog
