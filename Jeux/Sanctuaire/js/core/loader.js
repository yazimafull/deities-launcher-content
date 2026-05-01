/*
   ROUTE : Jeux/Sanctuaire/js/core/loader.js

   ARBORESCENCE :
     Jeux → Sanctuaire → js → core → loader.js

   RÔLE :
     POINT D’ENTRÉE GLOBAL DU JEU

   PRINCIPLE :
     - Charge tous les modules une seule fois
     - Ne contient aucune logique gameplay
     - Ne crée aucun listener dupliqué
     - Initialise uniquement UI + bindings globaux

   DÉPENDANCES :
     - state / input / engine core
     - systems (player, enemies, movement, combat…)
     - UI modules
     - world modules
*/

// ================================
// CORE
// ================================
import "./state.js";
import "./input.js";
import "./utils.js";

import "./runManager.js";
import "./gameLoop.js";
import "./main.js";
import "./screenManager.js";

// ================================
// UI SCALE
// ================================
import { initUIScale } from "./uiScale.js";

// ================================
// SYSTEMS
// ================================

// PLAYER
import "../systems/player/player.js";
import "../systems/player/playerStatsSystem.js";
import "../systems/player/playerRuntimeSystem.js";
import "../systems/player/playerRenderSystem.js";

// ENEMY
import "../systems/enemy/enemyFactory.js";
import "../systems/enemy/enemySystem.js";
import "../systems/enemy/enemyAI.js";
import "../systems/enemy/enemyCollision.js";
import "../systems/enemy/enemyDeath.js";
import "../systems/enemy/enemyRender.js";
import "../systems/enemy/bossSystem.js";

// COMBAT
import "../systems/projectileSystem.js";
import "../systems/combatSystem.js";
import "../systems/damageSystem.js";
import "../systems/deathSystem.js";

// XP
import "../systems/xp/runXP.js";
import "../systems/xp/soulXP.js";
import "../systems/xp/jobXP.js";

// LEVEL / UPGRADES
import "../systems/levelup.js";
import "../systems/upgrades.js";
import "../systems/upgradePanel.js";

// MOVEMENT / CAMERA
import "../systems/cameraSystem.js";
import "../systems/movementSystem.js";

// DEBUG
import "../systems/debugSystem.js";

// BIOME SPAWNER
import "../systems/biomeSpawner.js";

// ================================
// ITEM SYSTEMS
// ================================
import "../systems/item/assembleArmor.js";
import "../systems/item/assembleWeapon.js";
import "../systems/item/canCombine.js";
import "../systems/item/createItem.js";
import "../systems/item/disassembler.js";
import "../systems/item/getFinalProfile.js";
import "../systems/item/lootSystem.js";
import "../systems/item/merchantLevels.js";
import "../systems/item/mergeStats.js";
import "../systems/item/socketSystem.js";

// item profiles
import "../systems/item/profiles/armorProfiles.js";
import "../systems/item/profiles/gemProfiles.js";
import "../systems/item/profiles/itemProfiles.js";
import "../systems/item/profiles/talismanProfiles.js";
import "../systems/item/profiles/trinketProfiles.js";
import "../systems/item/profiles/weaponProfiles.js";

// ================================
// UI
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

// ================================
// BOOT STATE
// ================================
console.log("✅ Loader chargé");

let UI_INITIALIZED = false;

// ================================
// BOOT GAME
// ================================
window.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 Boot game start");

    // UI SCALE GLOBAL
    initUIScale();

    // ================================
    // UI INIT (ONE SHOT)
    // ================================
    if (!UI_INITIALIZED) {

        initCharacterMenu();
        initPauseMenu();
        initOptionsMenu();

        UI_INITIALIZED = true;

        console.log("🎯 UI initialisée");
    }

    // ================================
    // HUD INIT
    // ================================
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
