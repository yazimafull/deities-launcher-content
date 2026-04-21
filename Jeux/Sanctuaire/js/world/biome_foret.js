// world/biome_foret.js
// Biome Forêt — version propre, minimaliste, modulaire
// Version sans import/export — tout global

// ================================
// VARIABLES DU BIOME
// ================================
let trees = [];
let spawnCooldown = 0;
let bossSpawned = false;

const OBJECTIVE_MAX = 50;   // points pour faire pop le boss
let objectivePoints = 0;

let biomeTimer = 5 * 60 * 1000; // 5 minutes en ms


// ================================
// INIT BIOME
// ================================
function initBiomeForet() {
    trees = generateTrees();
    spawnCooldown = 0;
    bossSpawned = false;
    objectivePoints = 0;
    biomeTimer = 5 * 60 * 1000;
}

window.initBiomeForet = initBiomeForet;


// ================================
// UPDATE
// ================================
function updateBiomeForet(dt, player) {

    // --- Timer ---
    if (window.updateTimer) biomeTimer = updateTimer(biomeTimer, dt);

    // --- Spawn mobs ---
    spawnCooldown -= dt;
    if (spawnCooldown <= 0 && !bossSpawned) {
        if (window.spawnEnemyWave) spawnEnemyWave(player.x, player.y);
        spawnCooldown = 1500; // toutes les 1.5 sec
    }

    // --- Ennemis ---
    if (window.updateEnemies) updateEnemies(dt, player);

    // --- Collisions ---
    if (window.updateCollisions) updateCollisions(player);

    // --- XP ---
    if (window.updateXP) updateXP(player);

    // --- Loot ---
    if (window.updateLoot) updateLoot(player);

    // --- Objectif ---
    if (window.updateObjective) {
        const objData = updateObjective(objectivePoints, OBJECTIVE_MAX);
        objectivePoints = objData.current;
    }

    // --- Boss ---
    if (!bossSpawned && objectivePoints >= OBJECTIVE_MAX) {
        if (window.spawnBoss) spawnBoss(player);
        bossSpawned = true;
    }
    if (window.updateBoss) updateBoss(dt, player);

    // --- HUD ---
    if (window.updateHUD) {
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
}

window.updateBiomeForet = updateBiomeForet;


// ================================
// DRAW
// ================================
function drawBiomeForet(ctx, canvas, player) {
    drawBackground(ctx, canvas);
    drawTrees(ctx);
    if (window.drawEnemies) drawEnemies(ctx);
    if (window.drawBoss) drawBoss(ctx);
    drawPlayer(ctx, player);
}

window.drawBiomeForet = drawBiomeForet;


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
