/*
   ROUTE : Jeux/Sanctuaire/js/core/runManager.js
   RÔLE :
     - Orchestration complète d’une run :
         • Reset des systèmes (ennemis, projectiles, XP, boss)
         • Application difficulté + affixes + modificateurs
         • Génération + placement des mobs
         • Lancement du moteur + chargement du biome
         • Gestion de fin de run (boss mort → loot)
         • Gestion du retour au Sanctuaire
     - Intègre désormais les paramètres du Pylône (biome, niveau, affixes, modificateurs)

   EXPORTS :
     • launchRunFromPylone(config)
     • startRunManager(config)
     • cleanRun()
     • returnToSanctuary()

   DÉPENDANCES :
     - enemySystem, projectileSystem, biomeSpawner, HUD, gameLoop, screenManager, playerSystem
     - Biomes, resetRunXP, resetBoss, openLootScreen

   NOTES :
     - Aucun calcul d’XP ici → délégué à soulXP.js
     - runManager ne fait que préparer la run
     - Compatible avec le nouveau Pylône (biome + niveau + affixes + modificateurs)
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

const TILE_SIZE = 64;
const BORDER_SIZE = 8;
const PLAYER_MARGIN = 80;

/* ============================================================================
   RÉCOMPENSE TEMPORAIRE DE RUN
============================================================================ */
export const runReward = {
    gold: 0,
    items: [],
    soulXP: 0
};

export function addGold(amount) { runReward.gold += amount; }
export function addItem(item) { runReward.items.push(item); }
export function addSoulXP(amount) { runReward.soulXP += amount; }

/* ============================================================================
   VARIABLES DE RUN
============================================================================ */
let runChain = 0;
let levelLootBonus = 0;
let lastRunConfig = null;

/* ============================================================================
   🔥 API : appelé par le Pylône
============================================================================ */
export function launchRunFromPylone(config) {

    const runConfig = {
        biomeId: config.biomeId,
        difficulte: config.level,
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
    // 🔥 Appliquer l’équipement du pylône au joueur
    if (config.weapon) {
        player.equipment.weapon = config.weapon;
        player.weapon = config.weapon;
    }
    if (config.armor) {
        player.equipment.armor = config.armor;
    }

    levelLootBonus = 0;

    // RESET DES SYSTÈMES
    enemies.length = 0;
    projectiles.length = 0;
    resetRunXP();
    resetBoss();

    // OBJECTIF
    config.objective = 0;
    config.bossSpawned = false;

    /* ======================================================
       DIFFICULTÉ (supporte nombre OU I/II/III)
    ====================================================== */
    let level = 1;

    if (typeof config.difficulte === "number") {
        level = config.difficulte;
    } else {
        level = ({ "I": 1, "II": 2, "III": 3 })[config.difficulte] ?? 1;
    }

    config.difficulty = level;

    /* ======================================================
       AFFIXES (tableau complet)
    ====================================================== */
    const affixes = config.affixes ?? [];
    config.affixes = affixes;

    /* ======================================================
       MODIFICATEURS (tableau complet)
    ====================================================== */
    const modifiers = config.modifiers ?? [];
    config.modifiers = modifiers;

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
       GÉNÉRATION DES MOBS (affixes inclus)
    ====================================================== */
    const mobs = generateBiomeMobs(
        biomeIdForSpawner,
        level,
        biomeData,
        affixes
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
    applyRunModifiers(modifiers);

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
    console.log("🌍 Chargement biome :", biome.id);

    biome.load()
        .then(module => {
            if (getState() !== GameState.PLAYING) return;
            console.log("📦 Module biome chargé :", biome.id);
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
                console.log("⚡ Modificateur : Ennemis rapides");
                enemies.forEach(e => e.speed *= 1.3);
                break;

            case "moreProjectiles":
                console.log("🔥 Modificateur : Projectiles ennemis +50%");
                enemies.forEach(e => e.projectileRate *= 1.5);
                break;

            case "tankEnemies":
                console.log("🛡️ Modificateur : Ennemis tanky");
                enemies.forEach(e => e.hp *= 1.4);
                break;
        }
    });
}

/* ============================================================================
   CLEAN RUN
============================================================================ */
export function cleanRun() {

    console.log("🧹 Clean run (reset complet)");

    player.hp = player.stats.maxHp;
    player.shield = player.stats.maxShield ?? 0;

    player.attackCooldown = 0;

    player.x = 0;
    player.y = 0;

    if (player.baseRuntime) Object.assign(player.runtime, player.baseRuntime);
    if (player.baseStats) Object.assign(player.stats, player.baseStats);

    if (!player.weapon?.isDivine) player.weapon = null;
    if (!player.armorItem?.isDivine) player.armorItem = null;

    enemies.length = 0;
    projectiles.length = 0;
    resetRunXP();
    resetBoss();

    const canvas = document.getElementById("game-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add("hidden");
    }

    HUD.hide();

    console.log("✔ CleanRun terminé");
}

/* ============================================================================
   🔥 FONCTION MAÎTRE : returnToSanctuary()
============================================================================ */
export function returnToSanctuary() {

    console.log("🏛️ Retour au Sanctuaire");

    stopRun();
    cleanRun();
    resetInput();

    document.getElementById("pause-screen")?.classList.add("hidden");
    document.getElementById("death-screen")?.classList.add("hidden");
    document.getElementById("loot-screen")?.classList.add("hidden");

    setScreen(Screens.SANCTUARY);

    player.gold += runReward.gold;
    player.inventory.
    
    
    
    (...runReward.items);
    player.soulXP += runReward.soulXP;

    runReward.gold = 0;
    runReward.items = [];
    runReward.soulXP = 0;

    resetPyloneTimer();
    runChain = 0;

    setState(GameState.SANCTUARY);

    window.dispatchEvent(new CustomEvent("game:resume"));

    console.log("✔ Retour Sanctuaire terminé");
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

    const soulXP = player.runSoulXP ?? 0;
    const gold = 20 * lastRunConfig.difficulty;
    const items = [];

    runReward.gold = gold;
    runReward.items = items;
    runReward.soulXP = soulXP;

    openLootScreen({
        gold,
        items,
        soulXP,
        difficulty: lastRunConfig.difficulty,
        runChain,
        levelLootBonus
    });
});
