// world/biome_foret.js
// Décor, arbres, caméra, spawn positions, mouvement joueur
// NE gère PAS les stats ennemis — c'est enemySystem + enemyFactory

import { getState, GameState } from "../core/state.js";
import { createEnemy } from "../systems/enemyFactory.js";
import { spawnEnemy, enemies } from "../systems/enemySystem.js";

// ================================
// CONSTANTES
// ================================
const TILE     = 64;
const MAP_COLS = 160;
const MAP_ROWS = 120;
export const MAP_W = MAP_COLS * TILE;
export const MAP_H = MAP_ROWS * TILE;
const BORDER   = 8;

const MOB_COUNT_NORMAL = 40;
const MOB_COUNT_ELITE  = 3;

const REVEAL_RADIUS   = 640;
const TREE_FADE_ALPHA = 0.25;
const TREE_FULL_ALPHA = 1.0;

// ================================
// STATE LOCAL
// ================================
let canvas;
export let camera = { x: 0, y: 0 };
let target    = null;
let trees     = [];
let runConfig = {};
let active    = false;

// Touches
const keys = {};
window.addEventListener("keydown", e => { keys[e.key.toLowerCase()] = true; });
window.addEventListener("keyup",   e => { keys[e.key.toLowerCase()] = false; });

// ================================
// INIT
// ================================
export function initBiomeForet(config) {
    runConfig = config || {};
    active    = true;

    canvas = document.getElementById("game-canvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        if (canvas) {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });

    canvas.addEventListener("click", onCanvasClick);

    target = null;

    generateTrees();
    generateMobSpawns();
}

export function stopBiomeForet() {
    active = false;
    canvas?.removeEventListener("click", onCanvasClick);
}

// ================================
// CLIC SOURIS → CIBLE
// ================================
function onCanvasClick(e) {
    if (getState() !== GameState.PLAYING) return;
    if (!active) return;
    target = {
        x: e.clientX + camera.x,
        y: e.clientY + camera.y
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
    const biome      = "foret";
    const difficulty = Number(runConfig.difficulte || 1);
    const margin     = BORDER * TILE + 80;

    for (let i = 0; i < MOB_COUNT_NORMAL; i++) {
        const x   = margin + Math.random() * (MAP_W - margin * 2);
        const y   = margin + Math.random() * (MAP_H - margin * 2);
        const mob = createEnemy("normal", biome, difficulty, x, y);
        if (mob) spawnEnemy(mob);
    }

    for (let i = 0; i < MOB_COUNT_ELITE; i++) {
        const x     = margin + Math.random() * (MAP_W - margin * 2);
        const y     = margin + Math.random() * (MAP_H - margin * 2);
        const elite = createEnemy("elite", biome, difficulty, x, y);
        if (elite) spawnEnemy(elite);

        for (let o of [{dx:40,dy:0},{dx:-40,dy:0},{dx:0,dy:40}]) {
            const normal = createEnemy("normal", biome, difficulty, x+o.dx, y+o.dy);
            if (normal) spawnEnemy(normal);
        }
    }
}

// ================================
// UPDATE (appelé par gameLoop)
// ================================
export function updateBiomeForet(dt, player) {
    if (!active || !player) return;

    updatePlayerMovement(player);
    updateCamera(player);
    updateTreeAlpha(player);
}

function updatePlayerMovement(player) {
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
    const spd  = player.speed * (player.moveSpeedMultiplier || 1);

    player.x += dx * spd;
    player.y += dy * spd;
    player.x  = Math.max(half, Math.min(MAP_W - half, player.x));
    player.y  = Math.max(half, Math.min(MAP_H - half, player.y));
}

function updateCamera(player) {
    if (!canvas) return;
    camera.x = Math.max(0, Math.min(MAP_W - canvas.width,  player.x - canvas.width  / 2));
    camera.y = Math.max(0, Math.min(MAP_H - canvas.height, player.y - canvas.height / 2));
}

function updateTreeAlpha(player) {
    for (let t of trees) {
        const dist        = Math.hypot(player.x - t.x, player.y - t.y);
        const playerUnder = dist < t.r + player.size / 2;

        // Révélation mobs proches
        let mobUnder = false;
        if (dist < REVEAL_RADIUS) {
            for (let m of enemies) {
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

// ================================
// DRAW (appelé par gameLoop)
// ================================
export function drawBiomeForet(ctx, canvas, player) {
    if (!active || !player) return;

    // Fond herbe
    ctx.fillStyle = "#2d5a1b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    drawPlayerSprite(ctx, player);
    drawTreesCanvas(ctx);

    if (target) drawTarget(ctx);

    ctx.restore();
}

function drawTreesCanvas(ctx) {
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

function drawPlayerSprite(ctx, player) {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(player.x, player.y + player.size/2 - 4, player.size/2, 6, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = "#4aa3ff";
    ctx.fillRect(
        player.x - player.size/2,
        player.y - player.size/2,
        player.size, player.size
    );
}

function drawTarget(ctx) {
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