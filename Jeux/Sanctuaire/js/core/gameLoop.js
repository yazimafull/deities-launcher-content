// core/gameLoop.js

import { GameState, getState, setState } from "./state.js";
import { cleanRun } from "./runManager.js";

import { updateBiomeForet, drawBiomeForet, initBiomeForet } from "../world/biome_foret.js";

import { updateProjectiles, drawProjectiles, projectiles, handleProjectileCollisions } from "../systems/projectile.js";
import { enemies } from "../systems/enemySystem.js";
import { damageEnemy } from "../systems/damageSystem.js";

// ================================
// VARIABLES GLOBALES
// ================================
let canvas, ctx;
let player = null;
let lastTime = 0;

// ================================
// INIT PLAYER (placeholder)
// ================================
function initPlayer() {
    player = {
        x: 400,
        y: 300,
        speed: 0.25,
        hp: 100,
        maxHp: 100,
        xp: 0,
        xpMax: 100
    };
}

// ================================
// UPDATE GLOBAL
// ================================
function update(dt) {
    if (getState() !== GameState.PLAYING) return;

    player.x += 0;
    player.y += 0;

    updateProjectiles(projectiles);

    handleProjectileCollisions(projectiles, enemies, (p, m) => {
        damageEnemy(m, {
            base: p.damage,
            type: p.element
        });
    });

    updateBiomeForet(dt, player);
}

// ================================
// DRAW GLOBAL
// ================================
function draw() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBiomeForet(ctx, canvas, player);

    drawProjectiles(ctx, projectiles);
}

// ================================
// BOUCLE DE JEU
// ================================
function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    update(dt);
    draw();

    requestAnimationFrame(gameLoop);
}

// ================================
// LANCEMENT D’UNE RUN
// ================================
export function startRun(config) {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");
    canvas.classList.remove("hidden");

    cleanRun();

    initBiomeForet(config);
    initPlayer();

    setState(GameState.PLAYING);

    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}
