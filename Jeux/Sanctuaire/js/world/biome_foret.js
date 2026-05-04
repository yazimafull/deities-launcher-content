// world/biome_foret.js
/*
   ROUTE : world/biome_foret.js
   RÔLE : Rendu du biome forêt (décor, arbres, fade, target)
   EXPORTS : initBiomeForet, stopBiomeForet, updateBiomeForet, drawBiomeForet
   DÉPENDANCES : state.js, cameraSystem.js
   NOTES :
   - Le biome ne gère plus mouvement, caméra, clic, mobs.
   - Le moteur (engine + systems) gère tout le gameplay.
   - Le biome est désormais un renderer pur.
*/

import { getState, GameState } from "../core/state.js";
import { camera } from "../systems/cameraSystem.js";

// ================================
// CONSTANTES
// ================================
const TILE_SIZE = 64;
const MAP_COLS = 160;
const MAP_ROWS = 120;

export const MAP_WIDTH = MAP_COLS * TILE_SIZE;
export const MAP_HEIGHT = MAP_ROWS * TILE_SIZE;

const BORDER_SIZE = 8;
const REVEAL_RADIUS = 640;
const TREE_FADE_ALPHA = 0.25;
const TREE_FULL_ALPHA = 1.0;
const PLAYER_MARGIN = 80;

const TREE_COLORS = ["#1a4a1a", "#1e5c1e", "#145214", "#2d6e2d", "#0f3b0f"];

// ================================
// STATE
// ================================
let canvas, ctx;
let trees = [];
let active = false;

// ================================
// INIT
// ================================
export function initBiomeForet(config = {}) {

    active = true;

    canvas = document.getElementById("game-canvas");
    if (!canvas) return;

    ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    generateTrees();
}

// ================================
// STOP
// ================================
export function stopBiomeForet() {

    active = false;

    window.removeEventListener("resize", resizeCanvas);

    if (canvas) {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add("hidden");
    }
}

// ================================
// RESIZE SAFE
// ================================
function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// ================================
// GENERATION MONDE
// ================================
function generateTrees() {

    trees = [];

    const rand = (min, max) => Math.random() * (max - min) + min;

    for (let x = 0; x < MAP_COLS; x++) {
        for (let y = 0; y < MAP_ROWS; y++) {

            const border =
                x < BORDER_SIZE ||
                x > MAP_COLS - BORDER_SIZE ||
                y < BORDER_SIZE ||
                y > MAP_ROWS - BORDER_SIZE;

            if (border || Math.random() < 0.15) {
                trees.
                
                
                ({
                    x: x * TILE_SIZE + rand(4, TILE_SIZE - 4),
                    y: y * TILE_SIZE + rand(4, TILE_SIZE - 4),
                    r: rand(14, 32),
                    color: TREE_COLORS[Math.floor(Math.random() * TREE_COLORS.length)],
                    alpha: TREE_FULL_ALPHA
                });
            }
        }
    }
}

// ================================
// UPDATE (FADE UNIQUEMENT)
// ================================
export function updateBiomeForet(dt, player, enemies) {

    if (!active || !player) return;

    updateTreeFade(player, enemies);
}

// ================================
// TREE FADE
// ================================
function updateTreeFade(player, enemies) {

    const alive = enemies.filter(e => !e.dead);

    for (const tree of trees) {

        const d = Math.hypot(player.x - tree.x, player.y - tree.y);
        const underPlayer = d < tree.r + player.size / 2;

        let underEnemy = false;

        if (d < REVEAL_RADIUS) {
            for (const e of alive) {
                if (Math.hypot(e.x - tree.x, e.y - tree.y) < tree.r + e.size / 2) {
                    underEnemy = true;
                    break;
                }
            }
        }

        const targetAlpha = (underPlayer || underEnemy)
            ? TREE_FADE_ALPHA
            : TREE_FULL_ALPHA;

        tree.alpha += (targetAlpha - tree.alpha) * 0.12;
    }
}

// ================================
// DRAW
// ================================
export function drawBiomeForet(ctx, canvas, player) {

    if (!active || !player || !ctx) return;

    ctx.fillStyle = "#2d5a1b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    drawTrees(ctx, canvas);

    ctx.restore();
}

// ================================
// DRAW TREES
// ================================
function drawTrees(ctx, canvas) {

    for (const t of trees) {

        if (
            t.x < camera.x - PLAYER_MARGIN ||
            t.x > camera.x + canvas.width + PLAYER_MARGIN ||
            t.y < camera.y - PLAYER_MARGIN ||
            t.y > camera.y + canvas.height + PLAYER_MARGIN
        ) continue;

        ctx.globalAlpha = t.alpha;

        ctx.fillStyle = "#4a2e0a";
        ctx.beginPath();
        ctx.arc(t.x, t.y + t.r * 0.3, t.r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
    }
}
