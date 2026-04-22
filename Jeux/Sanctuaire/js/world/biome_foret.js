// world/biome_foret.js
// Gestion du biome forêt : décor, arbres, caméra, spawn des ennemis et mouvement du joueur

import { getState, GameState } from "../core/state.js";
import { createEnemy } from "../systems/enemyFactory.js";
import { spawnEnemy, enemies } from "../systems/enemySystem.js";
import { generateBiomeMobs } from "../systems/biomeSpawner.js";

// ================================
// CONSTANTES
// ================================
const TILE_SIZE = 64;
const MAP_COLS = 160;
const MAP_ROWS = 120;
export const MAP_WIDTH = MAP_COLS * TILE_SIZE;
export const MAP_HEIGHT = MAP_ROWS * TILE_SIZE;
const BORDER_SIZE = 8;
const MOB_COUNT_NORMAL = 40;
const MOB_COUNT_ELITE = 3;
const REVEAL_RADIUS = 640;
const TREE_FADE_ALPHA = 0.25;
const TREE_FULL_ALPHA = 1.0;
const DIAGONAL_MOVEMENT_FACTOR = 0.707;
const TARGET_THRESHOLD = 5;
const PLAYER_MARGIN = 80;
const TREE_COLORS = ["#1a4a1a", "#1e5c1e", "#145214", "#2d6e2d", "#0f3b0f"];

// ================================
// VARIABLES
// ================================
let canvas;
export let camera = { x: 0, y: 0 };
let target = null;
let trees = [];
let runConfig = {};
let active = false;
const keys = {};

// ================================
// INITIALISATION
// ================================
window.addEventListener("keydown", e => { keys[e.key.toLowerCase()] = true; });
window.addEventListener("keyup", e => { keys[e.key.toLowerCase()] = false; });

export function initBiomeForet(config) {
    runConfig = config || {};
    active = true;

    canvas = document.getElementById("game-canvas");
    if (!canvas) {
        console.error("Canvas introuvable");
        return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        if (canvas) {
            canvas.width = window.innerWidth;
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
// GESTION DES ÉVÉNEMENTS
// ================================
function onCanvasClick(e) {
    if (getState() !== GameState.PLAYING || !active) return;
    target = {
        x: e.clientX + camera.x,
        y: e.clientY + camera.y
    };
}

// ================================
// GÉNÉRATION DU MONDE
// ================================
function generateTrees() {
    trees = [];
    const rand = (min, max) => Math.random() * (max - min) + min;

    for (let col = 0; col < MAP_COLS; col++) {
        for (let row = 0; row < MAP_ROWS; row++) {
            const inBorder = col < BORDER_SIZE || col >= MAP_COLS - BORDER_SIZE
                          || row < BORDER_SIZE || row >= MAP_ROWS - BORDER_SIZE;

            if (inBorder || Math.random() < 0.15) {
                trees.push({
                    x: col * TILE_SIZE + rand(4, TILE_SIZE - 4),
                    y: row * TILE_SIZE + rand(4, TILE_SIZE - 4),
                    r: rand(14, 32),
                    color: pickTreeColor(),
                    alpha: TREE_FULL_ALPHA
                });
            }
        }
    }
}

function pickTreeColor() {
    return TREE_COLORS[Math.floor(Math.random() * TREE_COLORS.length)];
}

function generateMobSpawns() {
    const biomeId = "forest";
    const level = Number(runConfig.difficulte) || 1;
    const affixes = runConfig.affixes || [];

    const mobs = generateBiomeMobs(biomeId, level, affixes);

    const margin = BORDER_SIZE * TILE_SIZE + PLAYER_MARGIN;
    for (let mob of mobs) {
        mob.x = margin + Math.random() * (MAP_WIDTH - margin * 2);
        mob.y = margin + Math.random() * (MAP_HEIGHT - margin * 2);
        spawnEnemy(mob);
    }
}

// ================================
// MISE À JOUR
// ================================
export function updateBiomeForet(dt, player) {
    if (!active || !player) return;
    updatePlayerMovement(player);
    updateCamera(player);
    updateTreeAlpha(player);
}

function updatePlayerMovement(player) {
    const moveKeys = ["z", "s", "q", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];
    if (moveKeys.some(key => keys[key])) {
        target = null;
    }

    let dx = 0, dy = 0;
    if (keys["z"] || keys["arrowup"])    dy -= 1;
    if (keys["s"] || keys["arrowdown"])  dy += 1;
    if (keys["q"] || keys["arrowleft"])  dx -= 1;
    if (keys["d"] || keys["arrowright"]) dx += 1;

    if (dx === 0 && dy === 0 && target) {
        const tdx = target.x - player.x;
        const tdy = target.y - player.y;
        const dist = Math.hypot(tdx, tdy);
        if (dist > TARGET_THRESHOLD) {
            dx = tdx / dist;
            dy = tdy / dist;
        } else {
            target = null;
        }
    }

    if (dx !== 0 && dy !== 0) {
        dx *= DIAGONAL_MOVEMENT_FACTOR;
        dy *= DIAGONAL_MOVEMENT_FACTOR;
    }

    const halfSize = player.size / 2;
    const speed = player.speed * (player.moveSpeedMultiplier || 1);

    player.x += dx * speed;
    player.y += dy * speed;
    player.x = Math.max(halfSize, Math.min(MAP_WIDTH - halfSize, player.x));
    player.y = Math.max(halfSize, Math.min(MAP_HEIGHT - halfSize, player.y));
}

function updateCamera(player) {
    if (!canvas) return;
    camera.x = Math.max(0, Math.min(MAP_WIDTH - canvas.width, player.x - canvas.width / 2));
    camera.y = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, player.y - canvas.height / 2));
}

function updateTreeAlpha(player) {
    const margin = PLAYER_MARGIN;
    const aliveEnemies = enemies.filter(m => !m.dead);

    for (let tree of trees) {
        const distToPlayer = Math.hypot(player.x - tree.x, player.y - tree.y);
        const playerUnder = distToPlayer < tree.r + player.size / 2;

        let mobUnder = false;
        if (distToPlayer < REVEAL_RADIUS) {
            for (let enemy of aliveEnemies) {
                if (Math.hypot(enemy.x - tree.x, enemy.y - tree.y) < tree.r + enemy.size / 2) {
                    mobUnder = true;
                    break;
                }
            }
        }

        const targetAlpha = (playerUnder || mobUnder) ? TREE_FADE_ALPHA : TREE_FULL_ALPHA;
        tree.alpha += (targetAlpha - tree.alpha) * 0.12;
    }
}

// ================================
// RENDU
// ================================
export function drawBiomeForet(ctx, player) {
    if (!active || !player || !ctx) return;

    // Fond
    ctx.fillStyle = "#2d5a1b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sauvegarde et translation
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Dessin des éléments
    drawTrees(ctx);
    drawPlayerSprite(ctx, player);
    if (target) drawTarget(ctx, target);

    // Restauration
    ctx.restore();
}

function drawTrees(ctx) {
    const margin = PLAYER_MARGIN;
    for (let tree of trees) {
        if (tree.x < camera.x - margin || tree.x > camera.x + canvas.width + margin) continue;
        if (tree.y < camera.y - margin || tree.y > camera.y + canvas.height + margin) continue;

        ctx.globalAlpha = tree.alpha;

        // Tronc
        ctx.fillStyle = "#4a2e0a";
        ctx.beginPath();
        ctx.arc(tree.x, tree.y + tree.r * 0.3, tree.r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Feuillage
        ctx.fillStyle = tree.color;
        ctx.beginPath();
        ctx.arc(tree.x, tree.y, tree.r, 0, Math.PI * 2);
        ctx.fill();

        // Reflets
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.beginPath();
        ctx.arc(tree.x - tree.r * 0.2, tree.y - tree.r * 0.2, tree.r * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1.0;
    }
}

function drawPlayerSprite(ctx, player) {
    // Ombre
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(player.x, player.y + player.size / 2 - 4, player.size / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Joueur
    ctx.fillStyle = "#4aa3ff";
    ctx.fillRect(
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );
}

function drawTarget(ctx, target) {
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