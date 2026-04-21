// world/biome_foret.js

import { updateEnemies, drawEnemies, spawnEnemy } from "../systems/enemySystem.js";
import { createMob } from "../enemyFactory.js";
import { updateCollisions } from "../systems/collisionSystem.js";
import { updateXP } from "../systems/xpSystem.js";
import { updateLoot } from "../systems/lootSystem.js";
import { updateObjective } from "../systems/objectiveSystem.js";
import { spawnBoss, updateBoss, drawBoss } from "../systems/bossSystem.js";
import { updateHUD } from "../ui/hud.js";
import { updateTimer } from "../systems/timerSystem.js";

// ================================
// VARIABLES DU BIOME
// ================================
let trees = [];
let spawnCooldown = 0;
let bossSpawned = false;

const OBJECTIVE_MAX = 50;
let objectivePoints = 0;

let biomeTimer = 5 * 60 * 1000;

// ================================
// INIT BIOME
// ================================
export function initBiomeForet() {
    trees = generateTrees();
    spawnCooldown = 0;
    bossSpawned = false;
    objectivePoints = 0;
    biomeTimer = 5 * 60 * 1000;
}

// ================================
// UPDATE
// ================================
export function updateBiomeForet(dt, player) {

    biomeTimer = updateTimer(biomeTimer, dt);

    // --- Spawn mobs ---
    spawnCooldown -= dt;
    if (spawnCooldown <= 0 && !bossSpawned) {
        spawnBiomeMobs(player.x, player.y);
        spawnCooldown = 1500;
    }

    updateEnemies(dt, player);
    updateCollisions(player);
    updateXP(player);
    updateLoot(player);

    const objData = updateObjective(objectivePoints, OBJECTIVE_MAX);
    objectivePoints = objData.current;

    // --- Boss ---
    if (!bossSpawned && objectivePoints >= OBJECTIVE_MAX) {
        spawnBoss(player);
        bossSpawned = true;
    }

    updateBoss(dt, player);

    updateHUD({
        hp: player.hp,
        maxHp: player.maxHp,
        xp: player.xp,
        xpMax: player.xpMax,
        objective: objectivePoints,
        objectiveMax: OBJECTIVE_MAX,
        timer: biomeTimer,
        bossSpawned: bossSpawned
    });
}

// ================================
// DRAW
// ================================
export function drawBiomeForet(ctx, canvas, player) {
    drawBackground(ctx, canvas);
    drawTrees(ctx);
    drawEnemies(ctx);
    drawBoss(ctx);
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
