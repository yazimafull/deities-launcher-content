﻿// Jeux/Sanctuaire/core/gameLoop.js
// ============================================================================
// ROLE
// Gestion du moteur principal : boucle de jeu, canvas, joueur, contexte global.
// Ne gère PAS la logique de run (biomes, affixes, difficulté).
//
// ============================================================================
// EXPORTS
// - gameContext
// - startRun(config)
//
// ============================================================================
// DEPENDANCES
// - engine.js → setPlayer, updateEngine, renderEngine
// - state.js → setState, GameState
// - projectile.js → spawnProjectile
// - player.js → playerStats
//
// ============================================================================
// SCREEN
// Aucun écran spécifique : moteur global utilisé pendant la RUN.
//
// ============================================================================
// NOTES
// - La logique de run (biome, affixes, difficulté) doit être gérée par runManager.
// - Ce fichier doit rester simple : moteur, canvas, boucle, joueur.
// - Ne pas ajouter de logique de gameplay ici.
// ============================================================================


import { setPlayer, updateEngine, renderEngine } from "./engine.js";
import { setState, GameState } from "./state.js";
import { spawnProjectile } from "../systems/projectile.js";
import { playerStats } from "../systems/player.js";

let canvas, ctx;
let player = null;
let lastTime = 0;
let animId = null;

// ============================================================================
// CONTEXTE GLOBAL DE LA RUN
// ============================================================================
export const gameContext = {
    objective: 0,
    objectiveMax: 50,
    bossSpawned: false,
    spawnProjectile,

    addObjective(value) {
        this.objective += value;
    }
};

// ============================================================================
// INIT PLAYER
// ============================================================================
function initPlayer(config) {

    player = {
        ...playerStats,
        ...config.character,
        x: innerWidth / 2,
        y: innerHeight / 2,
        size: 28,
        lastShot: 0
    };

    setPlayer(player);
}

// ============================================================================
// GAME LOOP
// ============================================================================
function loop(t) {

    const dt = Math.min(t - lastTime, 200);
    lastTime = t;

    updateEngine(dt, gameContext);
    renderEngine(ctx, canvas, gameContext);

    animId = requestAnimationFrame(loop);
}

// ============================================================================
// START RUN
// ============================================================================
export function startRun(config) {

    // Stop ancienne boucle si existante
    if (animId) cancelAnimationFrame(animId);

    // Canvas
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.classList.remove("hidden");

    // Reset du contexte
    gameContext.objective = 0;
    gameContext.bossSpawned = false;

    // Init joueur
    initPlayer(config);

    // Lancer le moteur
    setState(GameState.PLAYING);

    lastTime = performance.now();
    animId = requestAnimationFrame(loop);
}
