// js/core/loader.js

// ================================
// CORE
// ================================
import "./state.js";
import "./input.js";
import "./utils.js";

import "./runManager.js";
import "./gameLoop.js";
import "./main.js";

// ================================
// SYSTEMS (NO DOM SIDE EFFECT)
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
// UI MODULES (MANUAL INIT)
// ================================
import { initCharacterMenu } from "../UI/menu/characterMenu.js";
import { initPauseMenu } from "../UI/menu/pauseMenu.js";
import { initOptionsMenu } from "../UI/menu/optionsMenu.js"; // ✅ NEW
import { HUD } from "../UI/hud/hudSystem.js";

// ================================
// WORLD
// ================================
import "../world/sanctuary.js";
import "../world/biome_foret.js";
import "../world/biome_wip.js";

console.log("✅ Loader chargé (modules prêts, init manuel)");

// ================================
// BOOT SEQUENCING
// ================================
window.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 Boot game start");

    // =========================
    // UI INIT
    // =========================
    initCharacterMenu();
    initPauseMenu();
    initOptionsMenu(); // ✅ IMPORTANT

    // =========================
    // HUD INIT (SAFE DEFAULT)
    // =========================
    HUD.init({
        hp: 100,
        maxHp: 100,
        xp: 0,
        xpMax: 100,
        objective: 0,
        objectiveMax: 1,
        bossSpawned: false
    });

});