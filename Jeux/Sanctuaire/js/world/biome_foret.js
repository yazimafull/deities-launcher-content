// world/biome_foret.js

import { updateEnemies, drawEnemies, spawnEnemy } from "../systems/enemySystem.js";
import { createMob } from "../systems/enemyFactory.js";

// ================================
// VARIABLES DU BIOME
// ================================
let trees = [];
let spawnCooldown = 0;

// ================================
// INIT BIOME
// ================================
export function initBiomeForet() {
    trees = generateTrees();
    spawnCooldown = 0;
}

// ================================
// UPDATE
// ================================
export async function updateBiomeForet(dt, player) {

    // --- Spawn mobs ---
    spawnCooldown -= dt;
    if (spawnCooldown <= 0) {
        await spawnBiomeMobs(player.x, player.y);
        spawnCooldown = 1500;
    }

    updateEnemies(dt, player);
}

// ================================
// DRAW
// ================================
export function drawBiomeForet(ctx, canvas, player) {
    drawBackground(ctx, canvas);
    drawTrees(ctx);
    drawEnemies(ctx);
    drawPlayer(ctx, player);
}

// ================================
// SPAWN DU BIOME
// ================================
async function spawnBiomeMobs(px, py) {

    const mobCount = 4;

    for (let i = 0; i < mobCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 400 + Math.random() * 200;

        const x = px + Math.cos(angle) * distance;
        const y = py + Math.sin(angle) * distance;

        const mob = await createMob("normal", x, y);
        if (mob) spawnEnemy(mob);
    }

    // Elite occasionnel
    if (Math.random() < 0.1) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 450;

        const x = px + Math.cos(angle) * distance;
        const y = py + Math.sin(angle) * distance;

        const elite = await createMob("elite", x, y);
        if (elite) spawnEnemy(elite);
    }
}

// ================================
// DÉCOR
// ================================
function generateTrees() {
    const arr = [];
    for (let i = 0; i < 80; i++) {
        arr.push({
            x: Math.random() * 3000 - 1500,
            y: Math.random() * 3000 - 1500,
            size: 40 + Math.random() * 40
        });
    }
    return arr;
}

function drawTrees(ctx) {
    ctx.save();
    ctx.fillStyle = "#0f3d0f";

    for (const t of trees) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// ================================
// BACKGROUND
// ================================
function drawBackground(ctx, canvas) {
    ctx.save();
    ctx.fillStyle = "#0a1f0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// ================================
// PLAYER (placeholder)
// ================================
function drawPlayer(ctx, player) {
    ctx.save();
    ctx.fillStyle = "#55aaff";
    ctx.beginPath();
    ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
