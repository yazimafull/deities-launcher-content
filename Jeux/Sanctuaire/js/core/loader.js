// js/core/loader.js

// ======================================================
// ROUTE : js/core/loader.js
// ROLE  : Point d’entrée global. Charge les modules SANS
//         attacher de listeners multiples. Initialise
//         uniquement les handlers globaux une seule fois.
// EXPORTS : aucun (fichier d’orchestration)
// DEPENDANCES : state.js, input.js, utils.js, runManager.js,
//               gameLoop.js, main.js, screenManager.js,
//               UI/menu/*, UI/hud/*, world/*
// NOTES :
// - NE DOIT PAS attacher de listeners multiples.
// - NE DOIT PAS réinitialiser les handlers à chaque écran.
// - Tous les init UI doivent être idempotents (une seule exécution).
// ======================================================


// ================================
// CORE
// ================================
import "./state.js";
import "./input.js";
import "./utils.js";

import "./runManager.js";
import "./gameLoop.js";
import "./main.js";
import "./screenManager.js"; // Gestion des écrans

// ================================
// SYSTEMS (NO DOM SIDE EFFECT)
// ================================
import "../systems/player.js";
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
import { initOptionsMenu } from "../UI/menu/optionsMenu.js";
import { HUD } from "../UI/hud/hudSystem.js";

// ================================
// WORLD
// ================================
import "../world/sanctuary.js";
import "../world/biome_foret.js";
import "../world/biome_wip.js";

console.log("✅ Loader chargé (modules prêts, init manuel)");


// ======================================================
// BOOT SEQUENCING — INIT UNIQUE
// ======================================================

let UI_INITIALIZED = false; // 🔥 Empêche les doublons de listeners

window.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 Boot game start");

    // =========================
    // UI INIT — UNE SEULE FOIS
    // =========================
    if (!UI_INITIALIZED) {
        initCharacterMenu();  // Attache les listeners du menu
        initPauseMenu();      // Attache les listeners du pause menu
        initOptionsMenu();    // Attache les listeners du menu options
        UI_INITIALIZED = true;
        console.log("🎯 UI initialisée (une seule fois)");
    } else {
        console.warn("⚠️ UI déjà initialisée — listeners non dupliqués");
    }

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
