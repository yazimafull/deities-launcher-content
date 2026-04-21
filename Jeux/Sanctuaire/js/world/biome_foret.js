// biome_foret.js — VERSION PROPRE
// Biome Forêt Mourante — décor, arbres, caméra, spawn positions, indicateur boss

import { getState, setState, GameState } from "../core/state.js";
import { createEnemy } from "../systems/enemyFactory.js"; // moulinette ennemis

// ================================
// CONSTANTES
// ================================
const TILE      = 64;
const MAP_COLS  = 160;
const MAP_ROWS  = 120;
const MAP_W     = MAP_COLS * TILE;
const MAP_H     = MAP_ROWS * TILE;
const BORDER    = 8;

// Nombre d’ennemis (juste le nombre, pas les stats)
const MOB_COUNT_NORMAL = 40;
const MOB_COUNT_ELITE  = 3;

// Transparence arbres
const REVEAL_RADIUS   = 640;
const TREE_FADE_ALPHA = 0.25;
const TREE_FULL_ALPHA = 1.0;

// ================================
// STATE
// ================================
let canvas, ctx;
let camera   = { x: 0, y: 0 };
let player   = {};
let target   = null;
let trees    = [];
let mobs     = [];
let boss     = null; // fourni par runManager
let runConfig = {};

const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup",   e => keys[e.key.toLowerCase()] = false);

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

    // Joueur (juste position + visuel)
    player = {
        x: MAP_W / 2,
        y: MAP_H / 2,
        size: 28,
        speed: 3.5,
        hp: 100,
        maxHp: 100
    };

    target = null;

    generateTrees();
    generateMobSpawns();

    setState(GameState.PLAYING);
    requestAnimationFrame(loop);
}

export function stopForet() {
    canvas?.removeEventListener("click", onCanvasClick);
}

// ================================
// CLIC SOURIS → CIBLE
// ================================
function onCanvasClick(e) {
    if (getState() !== GameState.PLAYING) return;

    target = {
        x: e.clientX + camera.x,
        y: e.clientY + camera.y
    };
}

// ================================
// GÉNÉRATION ARBRES (DÉCOR, SANS COLLISION)
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
                    x: col * TILE + rand(4, TILE - 4),
                    y: row * TILE + rand(4, TILE - 4),
                    r: rand(14, 32),
                    solid: false, // ❌ plus de collision décor
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
// GÉNÉRATION DES POSITIONS DES MOBS
// ================================
function generateMobSpawns() {
    mobs = [];

    const biome = "foret";
    const difficulty = Number(runConfig.difficulte || 1);

    const margin = BORDER * TILE + 80;

    // Normaux
    for (let i = 0; i < MOB_COUNT_NORMAL; i++) {
        const x = margin + Math.random() * (MAP_W - margin * 2);
        const y = margin + Math.random() * (MAP_H - margin * 2);
        mobs.push(createEnemy("normal", biome, difficulty, x, y));
    }

    // Packs élites
    for (let i = 0; i < MOB_COUNT_ELITE; i++) {
        const x = margin + Math.random() * (MAP_W - margin * 2);
        const y = margin + Math.random() * (MAP_H - margin * 2);

        // Élites
        mobs.push(createEnemy("elite", biome, difficulty, x, y));

        // 3 mobs normaux autour
        const offsets = [
            {dx: 40, dy: 0},
            {dx: -40, dy: 0},
            {dx: 0, dy: 40}
        ];

        for (let o of offsets) {
            mobs.push(createEnemy("normal", biome, difficulty, x + o.dx, y + o.dy));
        }
    }
}

// ================================
// GAME LOOP
// ================================
function loop() {
    if (getState() !== GameState.PLAYING) {
        requestAnimationFrame(loop);
        return;
    }

    update();
    draw();
    requestAnimationFrame(loop);
}

// ================================
// UPDATE
// ================================
function update() {
    updatePlayer();
    updateCamera();
    updateTreeAlpha();
}

// Déplacement joueur (souris + ZQSD)
function updatePlayer() {
    let dx = 0, dy = 0;

    // Si le joueur utilise ZQSD → on annule la cible souris
    if (
        keys["z"] || keys["s"] || keys["q"] || keys["d"] ||
        keys["arrowup"] || keys["arrowdown"] || keys["arrowleft"] || keys["arrowright"]
    ) {
        target = null;
    }

    // Déplacement clavier
    if (keys["z"] || keys["arrowup"])    dy -= 1;
    if (keys["s"] || keys["arrowdown"])  dy += 1;
    if (keys["q"] || keys["arrowleft"])  dx -= 1;
    if (keys["d"] || keys["arrowright"]) dx += 1;

    // Déplacement souris (seulement si aucune touche n'est pressée)
    if (dx === 0 && dy === 0 && target) {
        const tdx = target.x - player.x;
        const tdy = target.y - player.y;
        const dist = Math.hypot(tdx, tdy);

        if (dist > 5) {
            dx = tdx / dist;
            dy = tdy / dist;
        } else {
            target = null; // Arrivé à destination
        }
    }

    // Normalisation diagonale
    if ((keys["z"] || keys["s"]) && (keys["q"] || keys["d"])) {
        dx *= 0.707;
        dy *= 0.707;
    }

    const nx = player.x + dx * player.speed;
    const ny = player.y + dy * player.speed;
    const half = player.size / 2;

    // Mur invisible autour de la map
    player.x = Math.max(half, Math.min(MAP_W - half, nx));
    player.y = Math.max(half, Math.min(MAP_H - half, ny));
}


function updateCamera() {
    camera.x = player.x - canvas.width  / 2;
    camera.y = player.y - canvas.height / 2;
    camera.x = Math.max(0, Math.min(MAP_W - canvas.width,  camera.x));
    camera.y = Math.max(0, Math.min(MAP_H - canvas.height, camera.y));
}

// Transparence arbres
function updateTreeAlpha() {
    for (let t of trees) {
        const dxP = player.x - t.x;
        const dyP = player.y - t.y;
        const distToPlayer = Math.hypot(dxP, dyP);
        const playerUnder = distToPlayer < t.r + player.size / 2;

        const targetAlpha = playerUnder ? TREE_FADE_ALPHA : TREE_FULL_ALPHA;
        t.alpha += (targetAlpha - t.alpha) * 0.12;
    }
}

// ================================
// DRAW
// ================================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2d5a1b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    drawMobs();
    drawPlayer();
    drawTrees();
    drawBoss();
    drawBossIndicator();

    if (target) drawTarget();

    ctx.restore();
}

function drawTrees() {
    const margin = 80;
    for (let t of trees) {
        if (t.x < camera.x - margin || t.x > camera.x + canvas.width  + margin) continue;
        if (t.y < camera.y - margin || t.y > camera.y + canvas.height + margin) continue;

        ctx.globalAlpha = t.alpha;

        ctx.fillStyle = "#4a2e0a";
        ctx.beginPath();
        ctx.arc(t.x, t.y + t.r * 0.3, t.r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.beginPath();
        ctx.arc(t.x - t.r * 0.2, t.y - t.r * 0.2, t.r * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1.0;
    }
}

function drawMobs() {
    for (let m of mobs) {
        ctx.fillStyle = m.color || "#884444";
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawBoss() {
    if (!boss || boss.dead) return;

    ctx.fillStyle = boss.color || "#7700aa";
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.size / 2, 0, Math.PI * 2);
    ctx.fill();
}

// ================================
// INDICATEUR DIRECTIONNEL DU BOSS
// ================================
function drawBossIndicator() {
    if (!boss || boss.dead) return;

    const bossScreenX = boss.x - camera.x;
    const bossScreenY = boss.y - camera.y;

    // Si le boss est visible → pas d’indicateur
    if (
        bossScreenX >= 0 && bossScreenX <= canvas.width &&
        bossScreenY >= 0 && bossScreenY <= canvas.height
    ) return;

    // Direction vers le boss
    const dx = bossScreenX - canvas.width / 2;
    const dy = bossScreenY - canvas.height / 2;
    const angle = Math.atan2(dy, dx);

    // Position sur le bord de l’écran
    const radius = Math.min(canvas.width, canvas.height) / 2 - 40;
    const x = canvas.width  / 2 + Math.cos(angle) * radius;
    const y = canvas.height / 2 + Math.sin(angle) * radius;

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

function drawPlayer() {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(player.x, player.y + player.size / 2 - 4, player.size / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4aa3ff";
    ctx.fillRect(
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );
}

function drawTarget() {
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(target.x, target.y, 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(target.x, target.y, 4, 0, Math.PI * 2);
    ctx.stroke();
}
