// core/gameLoop.js

import { GameState, getState, setState } from "./state.js";
import { cleanRun } from "./runManager.js";

import {
    initBiomeForet,
    updateBiomeForet,
    drawBiomeForet,
    camera,
    MAP_WIDTH,
    MAP_HEIGHT
} from "../world/biome_foret.js";

import { initBiomeWIP } from "../world/biome_wip.js";

import {
    projectiles,
    spawnProjectile,
    updateProjectiles,
    drawProjectiles,
    handleProjectileCollisions
} from "../systems/projectile.js";

import { enemies, updateEnemies, drawEnemies } from "../systems/enemySystem.js";
import { damageEnemy, updateDamageNumbers, drawDamageNumbers } from "../systems/damageSystem.js";
import { playerStats, tryShoot } from "../systems/player.js";
import { updateXP, drawXP, xpOrbs } from "../systems/xp.js";
import { updateHUD, drawHUD, resetHUD, showHUD } from "../UI/hud/hudSystem.js";
import { spawnBoss, updateBoss, drawBoss, drawBossIndicator, resetBoss, boss } from "../systems/boss.js";

// ================================
// STATE
// ================================
let canvas, ctx;
let player = null;
let lastTime = 0;
let animId = null;

let mapPoints = 0;
let bossTriggered = false;

let isDead = false;

const MAP_OBJECTIVE = 50;

// ================================
// PLAYER INIT
// ================================
function initPlayer() {
    player = {
        ...playerStats,
        x: MAP_WIDTH / 2,
        y: MAP_HEIGHT / 2,
        size: 28,
        lastShot: 0
    };
}

export function getPlayer() {
    return player;
}

// ================================
// UPDATE
// ================================
function update(dt) {

    if (getState() !== GameState.PLAYING) return;
    if (isDead) return;

    updateBiomeForet(dt, player);

    updateEnemies(dt, player);
    tryShoot(player, enemies, spawnProjectile);

    updateProjectiles(projectiles);

    handleProjectileCollisions(projectiles, enemies, (p, m) => {
        const isCrit = Math.random() < (player.critChance || 0);

        damageEnemy(m, {
            base: p.damage,
            type: p.element,
            isCrit
        });

        if (m.hp <= 0 && !m.dead) {
            m.dead = true;
            mapPoints += m.progressValue || 1;
        }
    });

    if (bossTriggered) {
        updateBoss(player);
    }

    // ================================
    // BOSS SPAWN
    // ================================
    if (!bossTriggered && mapPoints >= MAP_OBJECTIVE) {
        bossTriggered = true;

        const diff = Number(
            document.querySelector("#difficulty-choices .pylone-choice.selected")?.dataset.value || 1
        );

        spawnBoss(player, diff, "foret");
    }

    updateXP(player);
    updateDamageNumbers(dt);

    // ================================
    // HUD
    // ================================
    updateHUD({
        hp: player.hp,
        maxHp: player.maxHp,
        xp: 0,
        xpMax: 1,
        objective: mapPoints,
        objectiveMax: MAP_OBJECTIVE,
        bossSpawned: bossTriggered
    });

    // ================================
    // DEATH CHECK (SAFE UNIQUE ENTRY)
    // ================================
    if (!isDead && player.hp <= 0) {
        handleDeath();
    }
}

// ================================
// DEATH SYSTEM (CLEAN)
// ================================
function handleDeath() {

    isDead = true;

    // stop loop
    if (animId) cancelAnimationFrame(animId);
    animId = null;

    setState(GameState.DEAD);

    // freeze systems
    enemies.length = 0;
    projectiles.length = 0;

    // UI
    const deathScreen = document.getElementById("death-screen");
    if (deathScreen) {
        deathScreen.classList.remove("hidden");
        deathScreen.classList.add("show");
    }
}

// ================================
// DRAW
// ================================
function draw() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBiomeForet(ctx, canvas, player);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    drawEnemies(ctx);
    drawProjectiles(ctx, projectiles);
    drawXP(ctx);

    if (bossTriggered) {
        drawBoss(ctx, camera, canvas);
        drawBossIndicator(ctx, camera, canvas);
    }

    ctx.restore();

    drawDamageNumbers(ctx);
    drawHUD(ctx, canvas);
}

// ================================
// LOOP
// ================================
function gameLoop(timestamp) {

    if (isDead) return;

    const dt = Math.min(timestamp - lastTime, 200);
    lastTime = timestamp;

    update(dt);
    draw();

    animId = requestAnimationFrame(gameLoop);
}

// ================================
// START RUN
// ================================
export function startRun(config) {

    if (animId) cancelAnimationFrame(animId);

    cleanRun();

    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.classList.remove("hidden");

    showHUD();
    resetHUD();

    projectiles.length = 0;
    enemies.length = 0;
    xpOrbs.length = 0;

    mapPoints = 0;
    bossTriggered = false;
    isDead = false;

    resetBoss();

    initPlayer();
    initBiomeForet(config);
    initBiomeWIP?.();

    setState(GameState.PLAYING);

    lastTime = performance.now();
    animId = requestAnimationFrame(gameLoop);
}

window.startRun = startRun;