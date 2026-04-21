// core/gameLoop.js

import { GameState, getState, setState } from "./state.js";
import { cleanRun } from "./runManager.js";

import { initBiomeForet, updateBiomeForet, drawBiomeForet, stopBiomeForet, camera, MAP_W, MAP_H } from "../world/biome_foret.js";
import { initBiomeWIP, stopBiomeWIP } from "../world/biome_wip.js";

import { projectiles, spawnProjectile, updateProjectiles, drawProjectiles, handleProjectileCollisions } from "../systems/projectile.js";
import { enemies, updateEnemies, drawEnemies, spawnEnemy } from "../systems/enemySystem.js";
import { damageEnemy, updateDamageNumbers, drawDamageNumbers } from "../systems/damageSystem.js";
import { playerStats, tryShoot } from "../systems/player.js";
import { updateXP, drawXP, xpOrbs } from "../systems/xp.js";
import { updateHUD, drawHUD } from "../UI/hud/hudSystem.js";
import { updateHealthBar } from "../UI/hud/healthbar.js";
import { spawnBoss, updateBoss, drawBoss, drawBossIndicator, resetBoss, boss } from "../systems/boss.js";

// ================================
// STATE LOCAL
// ================================
let canvas, ctx;
let player   = null;
let lastTime = 0;
let animId   = null;

// Progression carte
let mapPoints      = 0;
const MAP_OBJECTIVE = 50;
let bossTriggered  = false;

// ================================
// INIT JOUEUR
// ================================
function initPlayer() {
    player = {
        ...playerStats,
        x:        0,
        y:        0,
        size:     28,
        lastShot: 0
    };
}

export function getPlayer() { return player; }

// ================================
// UPDATE GLOBAL
// ================================
function update(dt) {
    if (getState() !== GameState.PLAYING) return;

    // Biome (mouvement joueur, caméra, arbres)
    updateBiomeForet(dt, player);

    // Ennemis
    updateEnemies(dt, player);

    // Tir automatique
    tryShoot(player, enemies, spawnProjectile);

    // Projectiles
    updateProjectiles(projectiles);

    // Collisions projectiles → ennemis
    handleProjectileCollisions(projectiles, enemies, (p, m) => {
        const isCrit = Math.random() < (player.critChance || 0);
        damageEnemy(m, {
            base:   p.damage,
            type:   p.element,
            isCrit
        });

        // Mort de l'ennemi → points de progression
        if (m.hp <= 0 && !m.dead) {
            m.dead    = true;
            mapPoints += m.progressValue || 1;
        }
    });

    // Boss
    if (bossTriggered) updateBoss(player);

    // Déclencher le boss
    if (!bossTriggered && mapPoints >= MAP_OBJECTIVE) {
        bossTriggered = true;
        const difficulty = Number(
            document.querySelector("#difficulty-choices .pylone-choice.selected")?.dataset.value || 1
        );
        spawnBoss(player, difficulty, "foret");
    }

    // XP
    updateXP(player);

    // Chiffres de dégâts
    updateDamageNumbers(dt);

    // HUD
    updateHealthBar(player);
    updateHUD({
        hp:           player.hp,
        maxHp:        player.maxHp,
        xp:           0,
        xpMax:        1,
        objective:    mapPoints,
        objectiveMax: MAP_OBJECTIVE,
        bossSpawned:  bossTriggered
    });

    // Mort du joueur
    if (player.hp <= 0) onPlayerDeath();
}

// ================================
// DRAW GLOBAL
// ================================
function draw() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fond + arbres + joueur (dans coordonnées monde)
    drawBiomeForet(ctx, canvas, player);

    // Systèmes en coordonnées monde
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

    // Chiffres de dégâts + HUD canvas (coordonnées écran)
    drawDamageNumbers(ctx);
    drawHUD(ctx, canvas);
}

// ================================
// BOUCLE DE JEU
// ================================
function gameLoop(timestamp) {
    const dt = Math.min(timestamp - lastTime, 200);
    lastTime = timestamp;

    update(dt);
    draw();

    animId = requestAnimationFrame(gameLoop);
}

// ================================
// MORT DU JOUEUR
// ================================
function onPlayerDeath() {
    if (animId) cancelAnimationFrame(animId);
    animId = null;

    setState(GameState.DEAD);
    document.getElementById("death-screen")?.classList.remove("hidden");
    document.getElementById("death-screen")?.classList.add("show");
}

// ================================
// LANCEMENT D'UNE RUN
// ================================
export function startRun(config) {
    if (animId) cancelAnimationFrame(animId);
    animId = null;

    cleanRun();

    canvas = document.getElementById("game-canvas");
    ctx    = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.remove("hidden");

    document.getElementById("healthbar-container")?.classList.remove("hidden");
    document.getElementById("xpbar-container")?.classList.remove("hidden");

    // Reset
    projectiles.length = 0;
    enemies.length     = 0;
    xpOrbs.length      = 0;
    mapPoints          = 0;
    bossTriggered      = false;
    resetBoss();

    initPlayer();

    // Positionner le joueur au centre de la map
    // MAP_W et MAP_H importés directement en haut du fichier
    player.x = MAP_W / 2;
    player.y = MAP_H / 2;

    initBiomeForet(config);

    setState(GameState.PLAYING);
    lastTime = performance.now();
    animId   = requestAnimationFrame(gameLoop);
}

// ✅ Exposer sur window pour sanctuary.js
window.startRun = startRun;