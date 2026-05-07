/*
   ROUTE : Jeux/Sanctuaire/js/core/runManager.js

   RÔLE :
     - Orchestration complète d’une run
     - Gestion difficulté / affixes / modificateurs
     - Spawn mobs + biome
     - Gestion fin de run → lootScreen (récompenses unifiées)
     - Nettoyage du joueur (perdre tout sauf divines)
     - Retour Sanctuaire
     - 🔥 Sauvegarde automatique du personnage actif (Option A)

   EXPORTS :
     • launchRunFromPylone(config)
     • startRunManager(config)
     • cleanRun()
     • returnToSanctuary()
*/

import { setState, getState, GameState } from "./state.js";
import { spawnEnemy, enemies } from "../systems/enemy/enemySystem.js";
import { projectiles } from "../systems/projectileSystem.js";

import { openLootScreen } from "../UI/loot/lootScreen.js";
import { resetRunXP } from "../systems/xp/runXP.js";
import { resetBoss } from "../systems/enemy/bossSystem.js";

import { HUD } from "../UI/hud/hudSystem.js";
import { startRun, stopRun } from "./gameLoop.js";
import { Biomes } from "../data/biomes.js";
import { generateBiomeMobs } from "../systems/biomeSpawner.js";

import { resetInput } from "./input.js";
import { Screens, setScreen } from "./screenManager.js";

import { resetPyloneTimer } from "../world/sanctuary.js";

import { player, updatePlayerStats } from "../systems/player/player.js";

import { addCurrency } from "../systems/currencySystem.js";

/* 🔥 IMPORT SAUVEGARDE MULTI-PERSO */
import { saveActiveCharacter, resetPlayerRuntime } from "./characterManager.js";

const TILE_SIZE = 64;
const BORDER_SIZE = 8;
const PLAYER_MARGIN = 80;

/* ============================================================================
   VARIABLES DE RUN
============================================================================ */
let runChain = 0;
let levelLootBonus = 0;
let lastRunConfig = null;

/* ============================================================================
   API : appelé par le Pylône
============================================================================ */
export function launchRunFromPylone(config) {

    const runConfig = {
        biomeId: config.biomeId,
        difficulte: config.difficulte,
        affixes: config.affixes || [],
        modifiers: config.modifiers || [],
        weapon: config.weapon,
        armor: config.armor
    };

    startRunManager(runConfig);
}

/* ============================================================================
   LANCEMENT D’UNE RUN
============================================================================ */
export function startRunManager(config) {

    console.log("🚀 startRunManager()", config);

    lastRunConfig = config;
    window.lastRunConfig = config;

    /* ======================================================
       APPLICATION ÉQUIPEMENT DU PYLÔNE
       (système unifié : player.equipment)
    ====================================================== */
    if (config.weapon) {
        player.equipment.weapon = config.weapon;
    }
    if (config.armor) {
        player.equipment.armor = config.armor;
    }

    levelLootBonus = 0;

    /* ======================================================
       RESET SYSTÈMES
    ====================================================== */
    enemies.length = 0;
    projectiles.length = 0;

    if (!config.continueRun) {
        resetRunXP();
    }
    resetBoss();

    config.objective = 0;
    config.bossSpawned = false;

    /* ======================================================
       DIFFICULTÉ
    ====================================================== */
    let level = Number(config.difficulte) || 1;

    config.difficulty = level;
    lastRunConfig.difficulty = level;

    /* ======================================================
       AFFIXES & MODIFICATEURS
    ====================================================== */
    config.affixes = config.affixes ?? [];
    config.modifiers = config.modifiers ?? [];

    /* ======================================================
       BIOME
    ====================================================== */
    const biome = Biomes[config.biomeId];
    if (!biome) {
        console.error("❌ Biome introuvable :", config.biomeId);
        return;
    }

    const objectiveMax = biome.objectiveMax;
    const eliteMin = biome.eliteMin;
    const eliteMax = biome.eliteMax;

    config.objectiveMax = objectiveMax;

    const biomeData = { objectiveMax, eliteMin, eliteMax };
    const biomeIdForSpawner =
        config.biomeId === "foret" ? "forest" : config.biomeId;

    /* ======================================================
       GÉNÉRATION DES MOBS
    ====================================================== */
    const mobs = generateBiomeMobs(
        biomeIdForSpawner,
        level,
        biomeData,
        config.affixes
    );

    config.mobs = mobs;

    /* ======================================================
       POSITIONNEMENT DES MOBS
    ====================================================== */
    const MAP_WIDTH_VAL = 160 * TILE_SIZE;
    const MAP_HEIGHT_VAL = 120 * TILE_SIZE;
    const margin = BORDER_SIZE * TILE_SIZE + PLAYER_MARGIN;

    for (const mob of mobs) {
        mob.x = margin + Math.random() * (MAP_WIDTH_VAL - margin * 2);
        mob.y = margin + Math.random() * (MAP_HEIGHT_VAL - margin * 2);
        spawnEnemy(mob);
    }

    /* ======================================================
       APPLICATION DES MODIFICATEURS
    ====================================================== */
    applyRunModifiers(config.modifiers);

    /* ======================================================
       HUD + PLAYER
    ====================================================== */
    HUD.show();

    updatePlayerStats();
    player.hp = player.stats.maxHp;
    player.shield = player.stats.maxShield;

    /* ======================================================
       RESET ÉTAT MORT
    ====================================================== */
    document.getElementById("death-screen")?.classList.add("hidden");
    window.dispatchEvent(new CustomEvent("game:resume"));
    setState(GameState.PLAYING);

    /* ======================================================
       LANCEMENT DU MOTEUR
    ====================================================== */
    startRun(config);

    /* ======================================================
       CHARGEMENT DU MODULE DE BIOME
    ====================================================== */
    biome.load()
        .then(module => {
            if (getState() !== GameState.PLAYING) return;
            biome.start(module, config);
        })
        .catch(err => console.error("❌ Erreur chargement biome :", err));

    console.log("✔ Run Manager prêt");
}

/* ============================================================================
   MODIFICATEURS DE RUN
============================================================================ */
function applyRunModifiers(modifiers) {
    modifiers.forEach(m => {
        switch (m) {

            case "fastEnemies":
                enemies.forEach(e => e.speed *= 1.3);
                break;

            case "moreProjectiles":
                enemies.forEach(e => e.projectileRate *= 1.5);
                break;

            case "tankEnemies":
                enemies.forEach(e => e.hp *= 1.4);
                break;
        }
    });
}

/* ============================================================================
   CLEAN RUN (TECHNIQUE)
============================================================================ */
export function cleanRun() {

    player.attackCooldown = 0;
    player.x = 0;
    player.y = 0;

    enemies.length = 0;
    projectiles.length = 0;
    resetBoss();

    const canvas = document.getElementById("game-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add("hidden");
    }

    HUD.hide();
}

/* ============================================================================
   CLEAN RUN : MORT
============================================================================ */
export function cleanRunOnDeath() {

    resetRunXP();
    resetPlayerRuntime();
    HUD.hide();

    if (!player.equipment.weapon?.isDivine) player.equipment.weapon = null;
    if (!player.equipment.armor?.isDivine) player.equipment.armor = null;

    player.equipment.affix = null;

    updatePlayerStats();

    /* 🔥 Sauvegarde après mort */
    saveActiveCharacter();
}


/* ============================================================================
   CLEAN RUN : QUITTER VIA PAUSE MENU
============================================================================ */
export function cleanRunOnQuit() {

    HUD.hide();

    resetRunXP();
    resetPlayerRuntime();


    if (!player.equipment.weapon?.isDivine) player.equipment.weapon = null;
    if (!player.equipment.armor?.isDivine) player.equipment.armor = null;
    player.equipment.affix = null;

    updatePlayerStats();

    /* 🔥 Sauvegarde après abandon */
    saveActiveCharacter();
}

/* ============================================================================
   CLEAN RUN : EXTRACTION
============================================================================ */
export function cleanRunOnExtract() {

    HUD.hide();
    resetRunXP();
    resetPlayerRuntime();
    updatePlayerStats();
    /* 🔥 Extraction = sauvegarde */
    saveActiveCharacter();
}

/* ============================================================================
   RETOUR AU SANCTUAIRE
============================================================================ */
export function returnToSanctuary() {

    stopRun();
    resetInput();
    HUD.hide();

    document.getElementById("pause-screen")?.classList.add("hidden");
    document.getElementById("death-screen")?.classList.add("hidden");
    document.getElementById("loot-screen")?.classList.add("hidden");

    setScreen(Screens.SANCTUARY);

    resetPyloneTimer();
    runChain = 0;

    setState(GameState.SANCTUARY);

    window.dispatchEvent(new CustomEvent("game:resume"));

    /* 🔥 Sauvegarde au retour sanctuaire */
    saveActiveCharacter();
}

/* ============================================================================
   FIN DE RUN : MORT DU BOSS → LOOT SCREEN
============================================================================ */
window.addEventListener("boss:dead", () => {

    if (!lastRunConfig) {
        console.error("❌ ERREUR : lastRunConfig est vide dans boss:dead");
        return;
    }

    runChain++;

    const difficulty = lastRunConfig.difficulty;

    const goldBase = difficulty * 2;
    const goldFinal = goldBase * 10000;

    const soulXPFinal = player.runSoulXP ?? 0;
    const jobXPFinal = difficulty;

    const items = [];

    /* 🔥 Appliquer les récompenses */
    player.soulXP += soulXPFinal;
    player.jobXP += jobXPFinal;
    addCurrency("copper", goldFinal);

    /* 🔥 Sauvegarde après récompenses */
    saveActiveCharacter();

    openLootScreen({
        goldFinal,
        soulXPFinal,
        jobXPFinal,
        items,
        difficulty,
        runChain,
        levelLootBonus
    });

    document.getElementById("loot-screen")?.classList.remove("hidden");
    window.dispatchEvent(new CustomEvent("game:pause"));
});
