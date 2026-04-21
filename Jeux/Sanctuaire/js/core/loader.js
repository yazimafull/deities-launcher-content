// js/core/loader.js

// --- CORE ---
import "./state.js";
import "./gameLoop.js";

// --- SYSTEMS ---
import "../systems/player.js";
import "../systems/enemy.js";
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

// --- UI / FX ---
import "../damageNumbers.js";
import "../healthbar.js";

// Rien à exécuter ici : importer suffit à initialiser les modules
console.log("Loader chargé : tous les systèmes sont prêts.");
