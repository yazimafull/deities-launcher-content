// js/core/loader.js

import "./state.js";
import "./input.js";
import "./utils.js";

// systems (safe: no DOM init inside)
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

// UI modules (NO AUTO INIT)
import { initCharacterMenu } from "../UI/menu/characterMenu.js";
import { initPauseMenu } from "../UI/menu/pauseMenu.js";
import { HUD } from "../UI/hud/hudSystem.js";

// world
import "../world/sanctuary.js";
import "../world/biome_foret.js";
import "../world/biome_wip.js";

// core
import "./runManager.js";
import "./gameLoop.js";
import "./main.js";

console.log("✅ Loader chargé (modules prêts mais non initialisés)");

// ================================
// BOOT SEQUENCING (IMPORTANT)
// ================================
window.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 Boot game start");

    // UI INIT SAFE
    initCharacterMenu();
    initPauseMenu();

    // HUD INIT (safe default)
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