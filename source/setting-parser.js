var constants = require('./constants');
var prefix = constants.prefix;
var separator = constants.separator;

function SettingParser (options) {
	this.gameplay = options.gameplay;
	this.performance = options.performance;
	this.engine = options.engine;
	this.autoexec = constants.settings.initialText;
	this.indicator = '';
}

SettingParser.prototype.parse = function () {
	if (this.gameplay) {
		this.parseGameplay();
	}

	if (this.performance) {
		this.parsePerformance();
	}

	if (this.engine) {
		this.parseEngine()
	}

	return [this.autoexec, this.indicator];
}

SettingParser.prototype.parseGameplay = function () {
	this.append(constants.settings.gameplayInitialText);

	this.parseBoolean(this.gameplay.netgraph, 'dota_hud_netgraph');

	this.parseBoolean(this.gameplay.autoAttack, 'dota_player_units_auto_attack');
	this.parseBoolean(this.gameplay.autoAttackAfterSpell, 'dota_player_units_auto_attack_after_spell');
	this.parseBoolean(this.gameplay.autoSelectSummonedUnits, 'dota_player_add_summoned_to_selection');

	this.parseBoolean(this.gameplay.autoRepeatRightMouse, 'dota_player_auto_repeat_right_mouse');
	this.parseBoolean(this.gameplay.forceMovementDirection, 'cl_dota_alt_unit_movetodirection')
	this.parseBoolean(this.gameplay.forceRightClickAttack, 'dota_force_right_click_attack');

	this.parseBoolean(this.gameplay.unifiedUnitOrders, 'dota_player_multipler_orders');
	this.parseBoolean(this.gameplay.rangeFinder, 'dota_enable_range_finder');

	this.parseBoolean(this.gameplay.playerNames, 'dota_always_show_player_names');
	this.parseBoolean(this.gameplay.gridView, 'dota_shop_view_mode');
	this.parseBoolean(this.gameplay.heroFinder, 'dota_show_hero_finder');

	this.parseBoolean(this.gameplay.muteChat, 'dota_chat_mute_all');

	this.parseBoolean(this.gameplay.cameraZoom, 'dota_camera_disable_zoom', true);
	this.parseBoolean(this.gameplay.cameraMoveOnRespawn, 'dota_reset_camera_on_spawn');
	this.parseNumber(this.gameplay.cameraSpeed, 'dota_camera_speed');

	// minimap
	this.parseNumber(this.gameplay.minimapHeroSize, 'dota_minimap_hero_size');
	this.parseNumber(this.gameplay.minimapRuneSize, 'dota_minimap_rune_size');
	this.parseNumber(this.gameplay.minimapCreepScale, 'dota_minimap_creep_scale');

	this.parseBoolean(this.gameplay.minimapProximityScale, 'dota_minimap_hero_scalar');
	this.parseNumber(this.gameplay.minimapProximityScaleDistance, 'dota_minimap_hero_scalar_distance');
	this.parseNumber(this.gameplay.minimapProximityScaleMinimum, 'dota_minimap_hero_scalar_minimum');

	this.parseBoolean(this.gameplay.minimapShowHeroIcons, 'dota_minimap_show_hero_icon');
	this.parseBoolean(this.gameplay.minimapAlwaysShowHeroIcons, 'dota_minimap_always_draw_hero_icons');
	this.parseBoolean(this.gameplay.minimapBackground, 'dota_minimap_hide_background');
	this.parseBoolean(this.gameplay.minimapSimpleColors, 'dota_minimap_simple_colors');

	this.parseNumber(this.gameplay.minimapMisclickTime, 'dota_minimap_misclick_time', false, 1000);
	this.parseBoolean(this.gameplay.minimapRightClick, 'dota_minimap_disable_right_click', true);

	this.parseNumber(this.gameplay.minimapTowerDefendDistance, 'dota_minimap_tower_defend_distance');
	this.parseNumber(this.gameplay.minimapPingDuration, 'dota_minimap_ping_duration', false, 1000);
};

SettingParser.prototype.parsePerformance = function () {
	if (this.gameplay) {
		this.append('');
	}
	this.append(constants.settings.performanceInitialText);
	this.parseBoolean(this.performance.screenShake, 'dota_screen_shake');
	this.parseBoolean(this.performance.highQualityWater, 'dota_cheap_water', true);
	this.parseBoolean(this.performance.animatePortrait, 'dota_portrait_animate');
	this.parseBoolean(this.performance.ambientCreatures, 'dota_ambient_creatures');
	this.parseBoolean(this.performance.heightFog, 'r_deffered_height_fog');
	this.parseBoolean(this.performance.worldLighting, 'r_deffered_simple_light', true);
	this.parseBoolean(this.performance.additiveLightPass, 'r_deffered_additive_pass');
	this.parseBoolean(this.performance.specularHighlight, 'r_deffered_specular');
	this.parseBoolean(this.performance.specularBloom, 'r_deffered_specular_bloom');
	this.parseBoolean(this.performance.ambientOcclusion, 'r_ssao');
	this.parseBoolean(this.performance.highQualityDashboard, 'dota_embers');
	this.parseBoolean(this.performance.altTabIdle, 'engine_no_focus_sleep');

	this.parseBoolean(this.performance.serverForcePreload, 'sv_forcepreload');
	this.parseBoolean(this.performance.clientForcePreload, 'cl_forcepreload');

	this.parseNumber(this.performance.shadowQuality, 'cl_globallight_shadow_mode');
	this.parseNumber(this.performance.levelOfDetail, 'r_lod', 5);
	this.parseNumber(this.performance.doubleShadowUpdates, 'r_shadow_half_update_rate', true);
	this.parseNumber(this.performance.maximumFramerate, 'fps_max');

	this.parseNumber(this.performance.gpuLevel, 'gpu_level');
	this.parseNumber(this.performance.cpuLevel, 'cpu_level');
	this.parseNumber(this.performance.gpuMemoryLevel, 'gpu_mem_level');
	this.parseNumber(this.performance.memoryLevel, 'mem_level');

	if (this.performance.multiCore !== undefined) {
		this.append(constants.settings.performanceMultiCoreText);
		this.parseBoolean(this.performance.multiCore, 'r_threaded_shadow_clip');
		this.parseBoolean(this.performance.multiCore, 'r_queued_decals');
		this.parseBoolean(this.performance.multiCore, 'r_queued_post_processing');
		this.parseNumber(this.performance.multiCore ? 2 : 0, 'mat_que_mode');
		this.parseBoolean(this.performance.multiCore, 'cl_threaded_bone_setup');
		this.parseBoolean(this.performance.multiCore, 'cl_threaded_init');
		this.parseBoolean(this.performance.multiCore, 'snd_mix_async');
	}
};

SettingParser.prototype.parseEngine = function () {
	if (this.gameplay || this.performance) {
		this.append('');
	}
	this.append(constants.settings.engineInitialText);

	this.parseBoolean(this.engine.inputButtonCodeIsScanCode, 'input_button_code_is_scan_code');

	// alt-key
	if (this.engine.altKey.toUpperCase() !== 'ALT') {
		this.append('dota_remap_alt_key "' + this.engine.altKey + '"');
	}

	// load indicator
	if (this.engine.loadIndicator) {
		var name = prefix + separator + 'load' + separator + 'indicator';
		if (this.engine.loadIndicator[0] === 'sound') {
			this.append('alias ' + name + ' "playsound sounds/' + this.engine.loadIndicator[1] + '"');
        } else if (this.engine.loadIndicator[0] === 'text') {
			this.append('alias ' + name + ' "exec ' + this.engine.loadIndicator[1] + '"');
        }
        this.indicator = constants.settings.loadIndicator.initialText + name;
    }
};

SettingParser.prototype.parseBoolean = function (condition, command, inverse) {
	if (condition !== undefined) {
		if (!inverse && condition || inverse && !condition) {
			this.append(command + ' 1');
		} else {
			this.append(command + ' 0');
		}
	}
};

SettingParser.prototype.parseNumber = function (value, command, inverse, unit) {
	if (value !== undefined && value !== null) {
		if (inverse) {
			value = inverse - value;
		}
		if (unit) {
			value /= unit;
		}
		this.append(command + ' ' + value);
	}
};

SettingParser.prototype.append = function (text) {
	this.autoexec += text + '\n';
};

module.exports = SettingParser;
