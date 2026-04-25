// core/gameLoop.js

import { GameState, setState } from "./state.js";
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
// CONTEXT RUN
// ================================
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
function initPlayer() {

    player = {
        ...playerStats,
        x: innerWidth / 2,
        y: innerHeight / 2,
        size: 28,
        lastShot: 0,
        xp: 0,
        xpMax: 100
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
// START RUN
// ================================
export function startRun(config) {

    // stop previous loop
    if (animId) cancelAnimationFrame(animId);

    // reset engine state
    cleanRun();

    // canvas init
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.classList.remove("hidden");

    // reset gameplay data
    enemies.length = 0;
    projectiles.length = 0;
    xpOrbs.length = 0;

    gameContext.objective = 0;
    gameContext.bossSpawned = false;

    resetBoss();

    // player + world
    initPlayer();
    initBiomeForet(config);
    initBiomeWIP?.();

    // IMPORTANT: state switch BEFORE HUD init
    setState(GameState.PLAYING);

    // ================================
    // HUD INIT (ONLY HERE)
    // ================================
    HUD.init({
        hp: player.hp,
        maxHp: player.maxHp,
        shield: player.shield,
        maxShield: player.maxShield,
        xp: player.xp,
        xpMax: player.xpMax,
        objective: gameContext.objective,
        objectiveMax: gameContext.objectiveMax,
        bossSpawned: gameContext.bossSpawned
    });

    HUD.show();

    // start loop
    lastTime = performance.now();
    animId = requestAnimationFrame(loop);
}

window.startRun = startRun;