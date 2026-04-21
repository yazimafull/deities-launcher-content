// js/core/loader.js

// --- CORE ---
import "./state.js";
import "./gameLoop.js";
import "./input.js";
import "./runManager.js";
import "./utils.js";
import "./main.js";

// --- SYSTEMS ---
import "../systems/player.js";
import "../systems/enemyTypes.js";
import "../systems/enemyFactory.js";
import "../systems/enemySystem.js";
import "../systems/projectile.js";
import "../systems/damageSystem.js";
import "../systems/deathSystem.js";
import "../systems/levelup.js";
import "../systems/upgrades.js";
import "../systems/upgradePanel.js";
import "../systems/xp.js";
import "../systems/boss.js";

// --- UI / MENUS ---
import "../UI/menu/characterMenu.js";
import "../UI/menu/pauseMenu.js";

// --- UI / HUD ---
import "../UI/hud/hudSystem.js";
import "../UI/hud/healthbar.js";
import "../UI/hud/damageNumbers.js";

// --- WORLD ---
import "../world/sanctuary.js";
import "../world/biome_foret.js";
import "../world/biome_wip.js";

console.log("Loader chargé avec UI en majuscule : tout est prêt.");
