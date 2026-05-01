/*
   ROUTE : Jeux/Sanctuaire/js/core/gameLoop.js
   ARBORESCENCE :
     Jeux → Sanctuaire → js → core → gameLoop.js

   RÔLE :
     MOTEUR PRINCIPAL DU JEU (LOOP + INIT RUN)

   PRINCIPLE :
     - Gère uniquement la boucle requestAnimationFrame
     - Initialise le canvas + run context
     - Initialise le player via setupRun
     - Ne contient aucune logique gameplay
     - Délègue tout aux systems (engine + systems)

   DÉPENDANCES :
     - engine.js
     - state.js
     - player runtime system
     - projectile system
*/

import { updateEngine, renderEngine } from "./engine.js";
import { setState, GameState } from "./state.js";
import { spawnProjectile } from "../systems/projectileSystem.js";

import {
    player,
    initPlayer,
    updatePlayerStats
} from "../systems/player/player.js";

// ================================
// GLOBAL LOOP STATE
// ================================
let canvas, ctx;
let lastTime = 0;
let animId = null;

// ================================
// RUN CONTEXT
// ================================
export const gameContext = {
    objective: 0,
    objectiveMax: 50,
    bossSpawned: false,

    canvas: null,
    spawnProjectile,

    biomeId: "foret",
    difficulty: 1,

    addObjective(value) {
        this.objective += value;
    },

    onMobKilled(mob) {
        this.addObjective(mob.objectivePoints ?? 1);
    }
};

// ================================
// PLAYER SETUP (RUN INITIALIZATION)
// ================================
function setupPlayer(config) {

    // =========================
    // INIT POSITION
    // =========================
    initPlayer(innerWidth / 2, innerHeight / 2);

    // =========================
    // APPLY CHARACTER DATA
    // =========================
    if (config?.character) {
        Object.assign(player, config.character);
    }

    // =========================
    // RUNTIME INIT
    // =========================
    player.size = 28;
    player.lastShot = 0;

    // =========================
    // BUILD STATS (ONLY SOURCE)
    // =========================
    updatePlayerStats();
}

// ================================
// GAME LOOP
// ================================
function loop(t) {

    if (!lastTime) {
        lastTime = t;
    }

    const dt = Math.min(t - lastTime, 200);
    lastTime = t;

    updateEngine(dt, gameContext);
    renderEngine(ctx, canvas, gameContext);

    animId = requestAnimationFrame(loop);
}

// ================================
// START RUN
// ================================
export function startRun(config) {

    if (animId) cancelAnimationFrame(animId);

    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.classList.remove("hidden");

    gameContext.canvas = canvas;

    gameContext.objective = 0;
    gameContext.bossSpawned = false;

    gameContext.objectiveMax = config?.objectiveMax ?? 50;
    gameContext.biomeId = config?.biomeId ?? "foret";
    gameContext.difficulty = config?.difficulty ?? 1;

    setupPlayer(config);

    setState(GameState.PLAYING);

    lastTime = 0;
    animId = requestAnimationFrame(loop);
}

// ================================
// STOP RUN
// ================================
export function stopRun() {

    if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
    }

    if (canvas) {
        canvas.classList.add("hidden");
    }
}