// systems/boss.js

import { createEnemy } from "./enemyFactory.js";
import { damagePlayer } from "./damageSystem.js";

export let boss = null;
let bossSpawned = false;

export function resetBoss() {
    boss = null;
    bossSpawned = false;
}

export function isBossSpawned() {
    return bossSpawned;
}

// ================================
// SPAWN
// ================================
export function spawnBoss(player, difficulty, biome = "foret") {
    bossSpawned = true;

    boss = createEnemy(
        "boss",
        biome,
        difficulty,
        player.x + 500,
        player.y
    );

    boss.lastDmgTime = 0;

    showBossAlert();
}

// ================================
// UPDATE
// ================================
export function updateBoss(player) {
    if (!boss || boss.dead) return;

    const dx   = player.x - boss.x;
    const dy   = player.y - boss.y;
    const dist = Math.hypot(dx, dy);

    // mouvement vers joueur
    if (dist > 0) {
        boss.x += (dx / dist) * boss.speed;
        boss.y += (dy / dist) * boss.speed;
    }

    // ================================
    // CONTACT → UTILISE DAMAGE SYSTEM (SHIELD INCLUDED)
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
export function drawBoss(ctx, camera, canvas) {
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
// INDICATOR
// ================================
export function drawBossIndicator(ctx, camera, canvas) {
    if (!boss || boss.dead) return;

    const bsx = boss.x - camera.x;
    const bsy = boss.y - camera.y;

    if (
        bsx >= 0 &&
        bsx <= canvas.width &&
        bsy >= 0 &&
        bsy <= canvas.height
    ) return;

    const angle  = Math.atan2(bsy - canvas.height / 2, bsx - canvas.width / 2);
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

// ================================
// ALERT UI
// ================================
function showBossAlert() {
    const el = document.createElement("div");

    el.style.cssText = `
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translateX(-50%);
        font-family: 'Cinzel', serif;
        font-size: 32px;
        color: #dd00ff;
        text-shadow: 0 0 20px #dd00ff;
        z-index: 9000;
        pointer-events: none;
        animation: fadeout 3s forwards;
    `;

    el.textContent = "⚠ Un Gardien Corrompu approche...";
    document.body.appendChild(el);

    if (!document.getElementById("boss-alert-style")) {
        const s = document.createElement("style");
        s.id = "boss-alert-style";
        s.textContent = `
            @keyframes fadeout {
                0%,70% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(s);
    }

    setTimeout(() => el.remove(), 3000);
}