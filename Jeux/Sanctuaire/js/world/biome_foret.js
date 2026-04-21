// biome_foret.js — VERSION COMPLÈTE
// Décor, caméra, spawn, boucle — branchée sur player.js / enemy.js / projectile.js

import { getState, setState, GameState } from "../core/state.js";
import { openPause } from "../ui/pauseMenu.js";
import { createEnemy } from "../systems/enemyFactory.js";
import { updateEnemies, drawEnemies } from "../systems/enemy.js";
import { playerStats, tryShoot, drawPlayerSprite } from "../systems/player.js";
import { projectiles, spawnProjectile, updateProjectiles, handleProjectileCollisions, drawProjectiles } from "../systems/projectile.js";

// ================================
// CONSTANTES
// ================================
const TILE     = 64;
const MAP_COLS = 160;
const MAP_ROWS = 120;
const MAP_W    = MAP_COLS * TILE;
const MAP_H    = MAP_ROWS * TILE;
const BORDER   = 8;

const MOB_COUNT_NORMAL = 40;
const MOB_COUNT_ELITE  = 3;

// Objectif : 50 points (normaux=1, élites=5, pack élite = 5+3×1 = 8 par pack)
const MAP_OBJECTIVE_POINTS = 50;

const REVEAL_RADIUS   = 640;
const TREE_FADE_ALPHA = 0.25;
const TREE_FULL_ALPHA = 1.0;

// ================================
// STATE LOCAL
// ================================
let canvas, ctx;
let camera    = { x: 0, y: 0 };
let player    = null;   // copie locale des stats joueur
let target    = null;
let trees     = [];
let mobs      = [];
let boss      = null;
let runConfig = {};
let animId    = null;

let mapPoints   = 0;    // points accumulés
let bossSpawned = false;

const keys = {};
window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === "Escape" && getState() === GameState.PLAYING) openPause();
});
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// ================================
// INIT
// ================================
export function initForet(config) {
    runConfig = config || {};

    canvas = document.getElementById("game-canvas");
    ctx    = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    canvas.addEventListener("click", onCanvasClick);

    // Copie locale des stats joueur (source : playerStats)
    player = {
        ...playerStats,
        x:    MAP_W / 2,
        y:    MAP_H / 2,
        size: 28
    };

    target      = null;
    boss        = null;
    mapPoints   = 0;
    bossSpawned = false;
    projectiles.length = 0;

    generateTrees();
    generateMobSpawns();

    // Afficher canvas + HUD
    document.getElementById("game-canvas")?.classList.remove("hidden");
    document.getElementById("healthbar-container")?.classList.remove("hidden");
    document.getElementById("xpbar-container")?.classList.remove("hidden");

    setState(GameState.PLAYING);
    animId = requestAnimationFrame(loop);
}

// ================================
// STOP
// ================================
export function stopForet() {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    canvas?.removeEventListener("click", onCanvasClick);
}

// ================================
// CLIC SOURIS → CIBLE
// ================================
function onCanvasClick(e) {
    if (getState() !== GameState.PLAYING) return;
    const half = player.size / 2;
    target = {
        x: Math.max(half, Math.min(MAP_W - half, e.clientX + camera.x)),
        y: Math.max(half, Math.min(MAP_H - half, e.clientY + camera.y))
    };
}

// ================================
// GÉNÉRATION ARBRES
// ================================
function generateTrees() {
    trees = [];
    const rand = (a, b) => Math.random() * (b - a) + a;

    for (let col = 0; col < MAP_COLS; col++) {
        for (let row = 0; row < MAP_ROWS; row++) {
            const inBorder = col < BORDER || col >= MAP_COLS - BORDER
                          || row < BORDER || row >= MAP_ROWS - BORDER;

            if (inBorder || Math.random() < 0.15) {
                trees.push({
                    x:     col * TILE + rand(4, TILE - 4),
                    y:     row * TILE + rand(4, TILE - 4),
                    r:     rand(14, 32),
                    color: pickTreeColor(),
                    alpha: TREE_FULL_ALPHA
                });
            }
        }
    }
}

function pickTreeColor() {
    return ["#1a4a1a","#1e5c1e","#145214","#2d6e2d","#0f3b0f"][Math.floor(Math.random()*5)];
}

// ================================
// GÉNÉRATION MOBS
// ================================
function generateMobSpawns() {
    mobs = [];
    const biome      = "foret";
    const difficulty = Number(runConfig.difficulte || 1);
    const margin     = BORDER * TILE + 80;

    // Normaux
    for (let i = 0; i < MOB_COUNT_NORMAL; i++) {
        const x = margin + Math.random() * (MAP_W - margin * 2);
        const y = margin + Math.random() * (MAP_H - margin * 2);
        mobs.push(createEnemy("normal", biome, difficulty, x, y));
    }

    // Packs élites (1 élite + 3 normaux autour)
    for (let i = 0; i < MOB_COUNT_ELITE; i++) {
        const x = margin + Math.random() * (MAP_W - margin * 2);
        const y = margin + Math.random() * (MAP_H - margin * 2);
        mobs.push(createEnemy("elite", biome, difficulty, x, y));

        for (let o of [{dx:40,dy:0},{dx:-40,dy:0},{dx:0,dy:40}]) {
            mobs.push(createEnemy("normal", biome, difficulty, x+o.dx, y+o.dy));
        }
    }
}

// ================================
// GAME LOOP
// ================================
function loop() {
    if (getState() !== GameState.PLAYING) {
        animId = requestAnimationFrame(loop);
        return;
    }
    update();
    draw();
    animId = requestAnimationFrame(loop);
}

// ================================
// UPDATE
// ================================
function update() {
    updatePlayer();
    updateCamera();
    updateTreeAlpha();
    updateEnemies(mobs, player, onMobDied);
    updateBoss();
    tryShoot(player, mobs, spawnProjectile);
    updateProjectiles(projectiles);
    handleProjectileCollisions(projectiles, mobs, onProjectileHit);
    checkBossTrigger();
    checkPlayerDeath();
    updateHUD();
}

// --------------------------------
// Déplacement joueur
// --------------------------------
function updatePlayer() {
    let dx = 0, dy = 0;

    if (keys["z"]||keys["s"]||keys["q"]||keys["d"]||
        keys["arrowup"]||keys["arrowdown"]||keys["arrowleft"]||keys["arrowright"]) {
        target = null;
    }

    if (keys["z"] || keys["arrowup"])    dy -= 1;
    if (keys["s"] || keys["arrowdown"])  dy += 1;
    if (keys["q"] || keys["arrowleft"])  dx -= 1;
    if (keys["d"] || keys["arrowright"]) dx += 1;

    if (dx === 0 && dy === 0 && target) {
        const tdx  = target.x - player.x;
        const tdy  = target.y - player.y;
        const dist = Math.hypot(tdx, tdy);
        if (dist > 5) {
            dx = tdx / dist;
            dy = tdy / dist;
        } else {
            target = null;
        }
    }

    if ((keys["z"]||keys["s"]) && (keys["q"]||keys["d"])) {
        dx *= 0.707;
        dy *= 0.707;
    }

    const half = player.size / 2;
    player.x += dx * player.speed * player.moveSpeedMultiplier;
    player.y += dy * player.speed * player.moveSpeedMultiplier;
    player.x  = Math.max(half, Math.min(MAP_W - half, player.x));
    player.y  = Math.max(half, Math.min(MAP_H - half, player.y));
}

function updateCamera() {
    camera.x = Math.max(0, Math.min(MAP_W - canvas.width,  player.x - canvas.width  / 2));
    camera.y = Math.max(0, Math.min(MAP_H - canvas.height, player.y - canvas.height / 2));
}

// --------------------------------
// Transparence arbres
// --------------------------------
function updateTreeAlpha() {
    for (let t of trees) {
        const distP      = Math.hypot(player.x - t.x, player.y - t.y);
        const playerUnder = distP < t.r + player.size / 2;

        let mobUnder = false;
        if (distP < REVEAL_RADIUS) {
            for (let m of mobs) {
                if (m.dead) continue;
                if (Math.hypot(m.x - t.x, m.y - t.y) < t.r + m.size / 2) {
                    mobUnder = true;
                    break;
                }
            }
        }

        const targetAlpha = (playerUnder || mobUnder) ? TREE_FADE_ALPHA : TREE_FULL_ALPHA;
        t.alpha += (targetAlpha - t.alpha) * 0.12;
    }
}

// --------------------------------
// Boss
// --------------------------------
function updateBoss() {
    if (!boss || boss.dead) return;

    const dx   = player.x - boss.x;
    const dy   = player.y - boss.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 0) {
        boss.x += (dx / dist) * boss.speed;
        boss.y += (dy / dist) * boss.speed;
    }

    if (dist < (player.size/2 + boss.size/2)) {
        const now = performance.now();
        if (now - boss.lastDmgTime > boss.damageCd) {
            player.hp       = Math.max(0, player.hp - boss.damage);
            boss.lastDmgTime = now;
        }
    }
}

function checkBossTrigger() {
    if (bossSpawned) return;
    if (mapPoints >= MAP_OBJECTIVE_POINTS) {
        bossSpawned = true;
        spawnBoss();
    }
}

function spawnBoss() {
    const difficulty = Number(runConfig.difficulte || 1);
    boss = createEnemy("boss", "foret", difficulty, player.x + 500, player.y);
    boss.lastDmgTime = 0;
    showBossAlert();
}

// --------------------------------
// Callbacks
// --------------------------------
function onMobDied(mob) {
    mapPoints += mob.progressValue || 1;
}

function onProjectileHit(projectile, mob) {
    // Appliquer les dégâts directement (simple pour l'instant)
    mob.hp -= projectile.damage;
}

function checkPlayerDeath() {
    if (player.hp <= 0) {
        stopForet();
        setState(GameState.DEAD);
        document.getElementById("death-screen")?.classList.remove("hidden");
        document.getElementById("death-screen")?.classList.add("show");
    }
}

// ================================
// HUD
// ================================
function updateHUD() {
    // Barre de vie
    const bar = document.getElementById("healthbar");
    if (bar) {
        const pct = player.hp / player.maxHp;
        bar.style.width      = (pct * 100) + "%";
        bar.style.background = pct > 0.6 ? "#00ff55" : pct > 0.3 ? "#ffaa00" : "#ff4444";
    }

    // Barre de progression objectif map
    const xpbar = document.getElementById("xpbar");
    if (xpbar) {
        const pct = Math.min(mapPoints / MAP_OBJECTIVE_POINTS, 1);
        xpbar.style.width      = (pct * 100) + "%";
        xpbar.style.background = bossSpawned ? "#dd00ff" : "#ff8800";
    }
}

// ================================
// DRAW
// ================================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fond herbe
    ctx.fillStyle = "#2d5a1b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Ordre : mobs → joueur → projectiles → arbres (par-dessus) → boss → indicateur → cible
    drawEnemies(ctx, mobs, camera, canvas);
    drawPlayerSprite(ctx, player);
    drawProjectiles(ctx, projectiles);
    drawTrees();
    if (boss && !boss.dead) drawBossSprite();
    drawBossIndicator();
    if (target) drawTarget();

    ctx.restore();

    // HUD texte objectif (en coordonnées écran, hors ctx.save)
    drawObjectiveText();
}

function drawTrees() {
    const margin = 80;
    for (let t of trees) {
        if (t.x < camera.x - margin || t.x > camera.x + canvas.width  + margin) continue;
        if (t.y < camera.y - margin || t.y > camera.y + canvas.height + margin) continue;

        ctx.globalAlpha = t.alpha;

        ctx.fillStyle = "#4a2e0a";
        ctx.beginPath();
        ctx.arc(t.x, t.y + t.r*0.3, t.r*0.3, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.beginPath();
        ctx.arc(t.x - t.r*0.2, t.y - t.r*0.2, t.r*0.4, 0, Math.PI*2);
        ctx.fill();

        ctx.globalAlpha = 1.0;
    }
}

function drawBossSprite() {
    ctx.fillStyle = boss.color || "#7700aa";
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.size/2, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = "#dd00ff";
    ctx.lineWidth   = 3;
    ctx.stroke();

    const bw = 100;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(boss.x - bw/2, boss.y - boss.size/2 - 14, bw, 8);
    ctx.fillStyle = "#dd00ff";
    ctx.fillRect(boss.x - bw/2, boss.y - boss.size/2 - 14, bw * (boss.hp/boss.maxHp), 8);
}

function drawBossIndicator() {
    if (!boss || boss.dead) return;

    const bsx = boss.x - camera.x;
    const bsy = boss.y - camera.y;
    if (bsx >= 0 && bsx <= canvas.width && bsy >= 0 && bsy <= canvas.height) return;

    const angle  = Math.atan2(bsy - canvas.height/2, bsx - canvas.width/2);
    const radius = Math.min(canvas.width, canvas.height) / 2 - 40;
    const x      = canvas.width/2  + Math.cos(angle) * radius;
    const y      = canvas.height/2 + Math.sin(angle) * radius;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = "#dd00ff";
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(24, 0);
    ctx.lineTo(0, 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawTarget() {
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(target.x, target.y, 8, 0, Math.PI*2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(target.x, target.y, 4, 0, Math.PI*2);
    ctx.stroke();
}

function drawObjectiveText() {
    // Texte au-dessus de la barre xp
    const label = bossSpawned
        ? "⚠ Boss en approche !"
        : `Objectif : ${Math.min(mapPoints, MAP_OBJECTIVE_POINTS)} / ${MAP_OBJECTIVE_POINTS}`;

    ctx.save();
    ctx.font      = "14px 'Cinzel', serif";
    ctx.fillStyle = bossSpawned ? "#dd00ff" : "#ffcc88";
    ctx.textAlign = "center";
    ctx.fillText(label, canvas.width / 2, canvas.height - 32);
    ctx.restore();
}

// ================================
// BOSS ALERT
// ================================
function showBossAlert() {
    const el = document.createElement("div");
    el.style.cssText = `
        position: fixed; top: 30%; left: 50%;
        transform: translateX(-50%);
        font-family: 'Cinzel', serif; font-size: 32px;
        color: #dd00ff; text-shadow: 0 0 20px #dd00ff;
        z-index: 9000; pointer-events: none;
        animation: fadeout 3s forwards;
    `;
    el.textContent = "⚠ Un Gardien Corrompu approche...";
    document.body.appendChild(el);

    if (!document.getElementById("boss-alert-style")) {
        const s = document.createElement("style");
        s.id = "boss-alert-style";
        s.textContent = `@keyframes fadeout { 0%,70%{opacity:1} 100%{opacity:0} }`;
        document.head.appendChild(s);
    }
    setTimeout(() => el.remove(), 3000);
}