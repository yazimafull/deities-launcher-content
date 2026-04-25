﻿// world/biome_foret.js

import { getState, GameState } from "../core/state.js";
import { spawnEnemy, enemies } from "../systems/enemySystem.js";
import { generateBiomeMobs } from "../systems/biomeSpawner.js";
import { isDown } from "../core/input.js";

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
const DIAGONAL = 0.707;
const TARGET_THRESHOLD = 5;
const PLAYER_MARGIN = 80;

const TREE_COLORS = ["#1a4a1a", "#1e5c1e", "#145214", "#2d6e2d", "#0f3b0f"];

// ================================
// STATE
// ================================
let canvas, ctx;
export let camera = { x: 0, y: 0 };

let target = null;
let trees = [];
let runConfig = {};
let active = false;

// ================================
// INIT
// ================================
export function initBiomeForet(config = {}) {

    runConfig = config;
    active = true;

    canvas = document.getElementById("game-canvas");
    if (!canvas) return;

    ctx = canvas.getContext("2d");

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("click", onClick);

    target = null;

    generateTrees();
    generateMobs();
}

// ================================
// STOP
// ================================
export function stopBiomeForet() {

    active = false;

    window.removeEventListener("resize", resizeCanvas);

    if (canvas) {
        canvas.removeEventListener("click", onClick);
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
// CLICK TARGET
// ================================
function onClick(e) {
    if (getState() !== GameState.PLAYING || !active) return;

    target = {
        x: e.clientX + camera.x,
        y: e.clientY + camera.y
    };
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
                trees.push({
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
// MOB SPAWN
// ================================
function generateMobs() {

    const level = Number(runConfig.difficulte) || 1;
    const affixes = runConfig.affix ? [runConfig.affix] : [];

    const mobs = generateBiomeMobs("forest", level, affixes);

    const margin = BORDER_SIZE * TILE_SIZE + PLAYER_MARGIN;

    for (const mob of mobs) {
        mob.x = margin + Math.random() * (MAP_WIDTH - margin * 2);
        mob.y = margin + Math.random() * (MAP_HEIGHT - margin * 2);
        spawnEnemy(mob);
    }
}

// ================================
// UPDATE
// ================================
export function updateBiomeForet(dt, player) {

    if (!active || !player) return;

    updateMovement(player);
    updateCamera(player);
    updateTreeFade(player);
}

// ================================
// PLAYER MOVE
// ================================
function updateMovement(player) {

    let dx = 0, dy = 0;

    if (isDown("up")) dy -= 1;
    if (isDown("down")) dy += 1;
    if (isDown("left")) dx -= 1;
    if (isDown("right")) dx += 1;

    if (dx === 0 && dy === 0 && target) {

        const tx = target.x - player.x;
        const ty = target.y - player.y;

        const dist = Math.hypot(tx, ty);

        if (dist > TARGET_THRESHOLD) {
            dx = tx / dist;
            dy = ty / dist;
        } else {
            target = null;
        }
    }

    if (dx && dy) {
        dx *= DIAGONAL;
        dy *= DIAGONAL;
    }

    const speed = player.speed * (player.moveSpeedMultiplier || 1);

    player.x += dx * speed;
    player.y += dy * speed;

    player.x = Math.max(player.size / 2, Math.min(MAP_WIDTH - player.size / 2, player.x));
    player.y = Math.max(player.size / 2, Math.min(MAP_HEIGHT - player.size / 2, player.y));
}

// ================================
// CAMERA
// ================================
function updateCamera(player) {

    if (!canvas) return;

    camera.x = Math.max(0, Math.min(MAP_WIDTH - canvas.width, player.x - canvas.width / 2));
    camera.y = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, player.y - canvas.height / 2));
}

// ================================
// TREE FADE
// ================================
function updateTreeFade(player) {

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

        const target = (underPlayer || underEnemy)
            ? TREE_FADE_ALPHA
            : TREE_FULL_ALPHA;

        tree.alpha += (target - tree.alpha) * 0.12;
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
    drawPlayer(ctx, player);

    if (target) drawTarget(ctx);

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

// ================================
// PLAYER
// ================================
function drawPlayer(ctx, player) {

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(player.x, player.y + player.size / 2, player.size / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4aa3ff";
    ctx.fillRect(
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );
}

// ================================
// TARGET
// ================================
function drawTarget(ctx) {

    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(target.x, target.y, 8, 0, Math.PI * 2);
    ctx.stroke();
}
