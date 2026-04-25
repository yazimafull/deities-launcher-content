// systems/boss.js

import { createEnemy } from "./enemyFactory.js";
import { damagePlayer } from "./damageSystem.js";

// ================================
// STATE
// ================================
export let boss = null;
let spawnEvent = null;

// ================================
// RESET
// ================================
export function resetBoss() {
    boss = null;
    spawnEvent = null;
}

// ================================
// STATUS
// ================================
export function isBossAlive() {
    return boss && !boss.dead;
}

export function getBoss() {
    return boss;
}

// ================================
// EVENT SYSTEM (ENGINE FRIENDLY)
// ================================
export function consumeBossEvent() {
    const e = spawnEvent;
    spawnEvent = null;
    return e;
}

// ================================
// SPAWN
// ================================
export function spawnBoss(player, difficulty, biome = "foret") {

    boss = createEnemy(
        "boss",
        biome,
        difficulty,
        player.x + 500,
        player.y
    );

    boss.lastDmgTime = 0;

    // event instead of DOM
    spawnEvent = "spawn";
}

// ================================
// UPDATE
// ================================
export function updateBoss(player, dt) {

    if (!boss || boss.dead) return;

    const dx = player.x - boss.x;
    const dy = player.y - boss.y;
    const dist = Math.hypot(dx, dy);

    // move toward player
    if (dist > 0) {
        boss.x += (dx / dist) * boss.speed;
        boss.y += (dy / dist) * boss.speed;
    }

    // ================================
    // CONTACT DAMAGE
    // ================================
    if (dist < (player.size / 2 + boss.size / 2)) {

        const now = performance.now();

        if (now - boss.lastDmgTime > (boss.damageCd || 1200)) {

            damagePlayer(player, {
                base: boss.damage,
                type: "physical"
            });

            boss.lastDmgTime = now;
        }
    }
}

// ================================
// DAMAGE BOSS
// ================================
export function damageBoss(amount) {

    if (!boss || boss.dead) return;

    boss.hp -= amount;

    if (boss.hp <= 0) {
        boss.hp = 0;
        boss.dead = true;
    }
}

// ================================
// DRAW BOSS
// ================================
export function drawBoss(ctx, camera) {

    if (!boss || boss.dead) return;

    ctx.fillStyle = boss.color || "#7700aa";
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#dd00ff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // HP BAR
    const bw = 100;

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(
        boss.x - bw / 2,
        boss.y - boss.size / 2 - 14,
        bw,
        8
    );

    ctx.fillStyle = "#dd00ff";
    ctx.fillRect(
        boss.x - bw / 2,
        boss.y - boss.size / 2 - 14,
        bw * (boss.hp / boss.maxHp),
        8
    );
}

// ================================
// INDICATOR (OFFSCREEN)
// ================================
export function drawBossIndicator(ctx, camera, canvas) {

    if (!boss || boss.dead) return;

    const bx = boss.x - camera.x;
    const by = boss.y - camera.y;

    if (
        bx >= 0 &&
        bx <= canvas.width &&
        by >= 0 &&
        by <= canvas.height
    ) return;

    const angle = Math.atan2(
        by - canvas.height / 2,
        bx - canvas.width / 2
    );

    const radius = Math.min(canvas.width, canvas.height) / 2 - 40;

    const x = canvas.width / 2 + Math.cos(angle) * radius;
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