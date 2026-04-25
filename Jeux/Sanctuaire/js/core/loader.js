// js/core/loader.js

// ================================
// CORE ENGINE
// ================================
import "./state.js";
import "./input.js";
import "./utils.js";

import "./runManager.js";
import "./gameLoop.js";
import "./main.js";

// ================================
// SYSTEMS
// ================================
import "../systems/player.js";
import "../systems/enemyTypes.js";
import "../systems/enemyFactory.js";
import "../systems/enemySystem.js";

import "../systems/projectile.js";
import "../systems/damageSystem.js";
import "../systems/deathSystem.js";

import "../systems/xp.js";
import "../systems/levelup.js";
import "../systems/upgrades.js";
import "../systems/upgradePanel.js";

import "../systems/boss.js";

// ================================
// UI
// ================================
import "../UI/menu/characterMenu.js";
import "../UI/menu/pauseMenu.js";

import "../UI/hud/hudSystem.js";

// ================================
// WORLD
// ================================
import "../world/sanctuary.js";
import "../world/biome_foret.js";
import "../world/biome_wip.js";

// ================================
// BOOT
// ================================
console.log("✅ Loader : modules initialisés.");