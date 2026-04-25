﻿﻿// core/gameLoop.js

import { setPlayer, updateEngine, renderEngine } from "./engine.js";
import { setState, GameState } from "./state.js";
import { spawnProjectile } from "../systems/projectile.js";
import { playerStats } from "../systems/player.js";

let canvas, ctx;
let player = null;
let lastTime = 0;
let animId = null;

export const gameContext = {
    objective: 0,
    objectiveMax: 50,
    bossSpawned: false,
    spawnProjectile,

    addObjective(value) {
        this.objective += value;
    }
};

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

function loop(t) {

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

    gameContext.objective = 0;
    gameContext.bossSpawned = false;

    initPlayer(config);

    setState(GameState.PLAYING);

    lastTime = performance.now();
    animId = requestAnimationFrame(loop);
}
