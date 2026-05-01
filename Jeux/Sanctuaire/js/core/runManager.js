/*
   ROUTE : Jeux/Sanctuaire/js/core/runManager.js

   RÔLE :
     Orchestration complète d’une run (reset systèmes, génération mobs, HUD, moteur, chargement biome)

   PRINCIPLE :
     - Reset des systèmes (ennemis, projectiles, XP, boss)
     - Génération des mobs via biomeSpawner
     - Application difficulté + affixes
     - Positionnement aléatoire des mobs
     - Lancement du moteur + chargement du module de biome
     - cleanRun remet le jeu en état SANCTUARY
*/

import { setState, getState, GameState } from "./state.js";
import { spawnEnemy, enemies } from "../systems/enemy/enemySystem.js";
import { projectiles } from "../systems/projectileSystem.js";

import { resetRunXP } from "../systems/xp/runXP.js";

import { resetBoss } from "../systems/enemy/bossSystem.js";
import { HUD } from "../UI/hud/hudSystem.js";
import { startRun } from "./gameLoop.js";
import { Biomes } from "../data/biomes.js";
import { generateBiomeMobs } from "../systems/biomeSpawner.js";

const TILE_SIZE = 64;
const BORDER_SIZE = 8;
const PLAYER_MARGIN = 80;

export function startRunManager(config) {

    console.log("🚀 startRunManager()", config);

    // ================================
    // 1. RESET DES SYSTÈMES
    // ================================
    enemies.length = 0;
    projectiles.length = 0;
    resetRunXP();
    resetBoss();

    // ================================
    // 2. DIFFICULTÉ + AFFIXES
    // ================================
    const level = ({ "I": 1, "II": 2, "III": 3 })[config.difficulte] ?? 1;
    const affixes = config.affix ? [config.affix] : [];

    config.difficulty = level;

    console.log("⚙️ Difficulté :", config.difficulte, "→", level);

    // ================================
    // 3. PARAMÈTRES DU BIOME
    // ================================
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

    // ================================
    // 4. GÉNÉRATION DES MOBS
    // ================================
    const mobs = generateBiomeMobs(
        biomeIdForSpawner,
        level,
        biomeData,
        affixes
    );

    config.mobs = mobs;

    // ================================
    // 5. POSITIONNEMENT DES MOBS
    // ================================
    const MAP_WIDTH_VAL = 160 * TILE_SIZE;
    const MAP_HEIGHT_VAL = 120 * TILE_SIZE;
    const margin = BORDER_SIZE * TILE_SIZE + PLAYER_MARGIN;

    for (const mob of mobs) {
        mob.x = margin + Math.random() * (MAP_WIDTH_VAL - margin * 2);
        mob.y = margin + Math.random() * (MAP_HEIGHT_VAL - margin * 2);
        spawnEnemy(mob);
    }

    if (config.affix) {
        console.log("📦 Affixe appliqué :", config.affix);
    }

    // ================================
    // 6. HUD
    // ================================
    HUD.show();

    // ================================
    // 7. LANCER LE MOTEUR
    // ================================
    startRun(config);

    // ================================
    // 8. CHARGEMENT DU MODULE DE BIOME
    // ================================
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

export function cleanRun() {

    console.log("🧹 Clean run...");

    setState(GameState.SANCTUARY);

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
}
