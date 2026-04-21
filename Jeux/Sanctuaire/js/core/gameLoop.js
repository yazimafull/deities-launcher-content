// core/gameLoop.js

import { GameState, getState, setState } from "./state.js";
import { cleanRun } from "./runManager.js";

import { updateBiomeForet, drawBiomeForet, initBiomeForet } from "../world/biome_foret.js";

import { updateProjectiles, drawProjectiles, projectiles, handleProjectileCollisions } from "../systems/projectile.js";
import { enemies, updateEnemies, drawEnemies } from "../systems/enemySystem.js";
import { damageEnemy } from "../systems/damageSystem.js";
import { playerStats } from "../systems/player.js";
import { updateXP, drawXP, drawXPBar } from "../systems/xp.js";
import { updateDamageNumbers, drawDamageNumbers } from "../systems/damageSystem.js";

// ================================
// VARIABLES GLOBALES
// ================================
let canvas, ctx;
let player = null;
let lastTime = 0;

// ================================
// INIT PLAYER
// ================================
function initPlayer() {
    player = {
        x: 400,
        y: 300,
        size: 20,
        ...playerStats
    };
}

// ================================
// UPDATE GLOBAL
// ================================
function update(dt) {
    if (getState() !== GameState.PLAYING) return;

    // Projectiles
    updateProjectiles(projectiles);

    // Ennemis
    updateEnemies(dt, player);

    // Collisions projectiles → ennemis
    handleProjectileCollisions(projectiles, enemies, (p, m) => {
        damageEnemy(m, {
            base: p.damage,
            type: p.element
        });
    });

    // XP
    updateXP(player);

    // Dégâts affichés
    updateDamageNumbers(dt);

    // Biome
    updateBiomeForet(dt, player);
}

// ================================
// DRAW GLOBAL
// ================================
function draw() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBiomeForet(ctx, canvas, player);
    drawEnemies(ctx);
    drawProjectiles(ctx, projectiles);
    drawXP(ctx);
    drawDamageNumbers(ctx);

    drawXPBar();
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
// LANCEMENT D'UNE RUN
// ================================
export function startRun(config) {

    cleanRun(); // Nettoyage AVANT d'afficher le canvas

    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");
    canvas.classList.remove("hidden");

    initBiomeForet(config);
    initPlayer();

    setState(GameState.PLAYING);

    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}