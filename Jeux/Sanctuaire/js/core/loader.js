 // js/core/loader.js
 // Point d'entrée unique — charge tous les modules dans le bon ordre

// ================================
// CORE ENGINE
// ================================
import "./state.js";
import "./input.js";
import "./utils.js";

import "./runManager.js";
import "./gameLoop.js";   // expose window.startRun
import "./main.js";       // expose navigation (menu ↔ sanctuaire)

// ================================
// SYSTEMS (GAMEPLAY)
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
import "../UI/hud/healthbar.js";
import "../UI/hud/damageNumbers.js";

// ================================
// WORLD
// ================================
import "../world/sanctuary.js";
import "../world/biome_foret.js";
import "../world/biome_wip.js";

// ================================
// BOOT LOG
// ================================
console.log("✅ Loader : modules initialisés.");