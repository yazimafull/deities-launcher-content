// core/gameLoop.js

import { setState, GameState } from "./state.js";
import { cleanRun } from "./runManager.js";

import { initBiomeForet } from "../world/biome_foret.js";
import { initBiomeWIP } from "../world/biome_wip.js";

import { playerStats } from "../systems/player.js";

import { enemies } from "../systems/enemySystem.js";
import { projectiles } from "../systems/projectile.js";
import { xpOrbs } from "../systems/xp.js";

import { resetBoss } from "../systems/boss.js";

import { setPlayer, updateEngine, renderEngine } from "./engine.js";

import { HUD } from "../ui/hud/hudSystem.js";

// ================================
let canvas, ctx;
let player = null;
let lastTime = 0;
let animId = null;

// ================================
function initPlayer() {

    player = {
        ...playerStats,
        x: innerWidth / 2,
        y: innerHeight / 2,
        size: 28,
        lastShot: 0
    };

    setPlayer(player);
}

// ================================
function loop(t) {

    const dt = Math.min(t - lastTime, 200);
    lastTime = t;

    updateEngine(dt, gameContext);
    renderEngine(ctx, canvas, gameContext);

    animId = requestAnimationFrame(loop);
}

// ================================
// CONTEXT (clean separation)
const gameContext = {
    objective: 0,
    objectiveMax: 50,
    bossSpawned: false,

    spawnProjectile: null,
    addObjective(value) {
        this.objective += value;
    }
};

// ================================
export function startRun(config) {

    if (animId) cancelAnimationFrame(animId);

    cleanRun();

    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    canvas.classList.remove("hidden");

    enemies.length = 0;
    projectiles.length = 0;
    xpOrbs.length = 0;

    gameContext.objective = 0;
    gameContext.bossSpawned = false;

    resetBoss();

    initPlayer();
    initBiomeForet(config);
    initBiomeWIP?.();

    setState(GameState.PLAYING);

    HUD.show();

    lastTime = performance.now();
    animId = requestAnimationFrame(loop);
}

window.startRun = startRun;