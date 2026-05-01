/*
   ROUTE : Jeux/Sanctuaire/js/systems/enemy/bossSystem.js
   ARBORESCENCE :
     Jeux → Sanctuaire → js → systems → enemy → bossSystem.js

   RÔLE :
     Boss hybride (melee + projectile + anti‑kite).
     Passe de idle → chase (aggro) puis combat permanent.
     Attaque melee via combatSystem + tir spécial toutes les 5s.
     Anti‑kite : +20% vitesse si pas touché depuis 5s.
     Dessin + indicateur hors‑écran gérés ici.

   DÉPENDANCES :
     - projectileSystem (spawnProjectile)
     - enemySystem (IA cohérente via isMob)
     - engine (updateBoss / drawBoss)
*/

import { spawnProjectile } from "../projectileSystem.js";

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

export function isBossActive() {
    return boss !== null && boss.dead !== true;
}

export function consumeBossEvent() {
    const e = spawnEvent;
    spawnEvent = null;
    return e;
}

// ================================
// SPAWN
// ================================
export function spawnBoss(player, difficulty, biome = "foret") {

    boss = {
        x: player.x + 500,
        y: player.y,

        size: 90,
        color: "#7700aa",

        hp: 2000 * difficulty,
        maxHp: 2000 * difficulty,

        speed: 90,
        baseSpeed: 90,

        // === COMBAT SYSTEM COMPAT ===
        isMob: true,
        type: "melee",
        attackRange: 120,
        attackSpeed: 1000,

        // === AGGRO ===
        state: "idle",
        aggroRange: 600,

        // === RANGED SPECIAL ATTACK ===
        projectileSpeed: 450,
        projectileRange: 600,
        projectileDamage: 25 * difficulty,
        rangedCooldown: 5000,
        rangedTimer: 0,

        // === ANTI-KITE ===
        lastHitTime: performance.now(),
        speedBuffActive: false,
        speedBuffTimer: 0,

        dead: false
    };

    spawnEvent = "spawn";
}

// ================================
// UPDATE
// ================================
export function updateBoss(player, dt) {

    if (!boss || boss.dead) return;

    const now = performance.now();

    const dx = player.x - boss.x;
    const dy = player.y - boss.y;
    const dist = Math.hypot(dx, dy);

    // ================================
    // AGGRO → combat permanent
    // ================================
    if (boss.state === "idle" && dist < boss.aggroRange) {
        boss.state = "chase";
    }

    // ================================
    // COMBAT PERMANENT
    // ================================
    if (boss.state === "chase") {

        // Déplacement
        if (dist > 0) {
            const speed = boss.speed * (dt / 1000);
            boss.x += (dx / dist) * speed;
            boss.y += (dy / dist) * speed;
        }

        // Tir spécial toutes les 5s
        boss.rangedTimer += dt;

        if (boss.rangedTimer >= boss.rangedCooldown) {
            boss.rangedTimer = 0;

            const vx = dx / dist;
            const vy = dy / dist;

            spawnProjectile({
                x: boss.x,
                y: boss.y,
                vx,
                vy,
                speed: boss.projectileSpeed,
                range: boss.projectileRange,
                damage: boss.projectileDamage,
                owner: boss
            });
        }

        // ================================
        // ANTI-KITE
        // ================================
        if (!boss.speedBuffActive && now - boss.lastHitTime > 5000) {
            boss.speedBuffActive = true;
            boss.speedBuffTimer = 5000;
            boss.speed = boss.baseSpeed * 1.2;
        }

        if (boss.speedBuffActive) {
            boss.speedBuffTimer -= dt;
            if (boss.speedBuffTimer <= 0) {
                boss.speedBuffActive = false;
                boss.speed = boss.baseSpeed;
            }
        }
    }
}

// ================================
// DAMAGE BOSS
// ================================
export function damageBoss(amount) {

    if (!boss || boss.dead) return;

    boss.hp -= amount;
    boss.lastHitTime = performance.now();

    if (boss.hp <= 0) {
        boss.hp = 0;
        boss.dead = true;
    }
}

// ================================
// DRAW BOSS
// ================================
export function drawBoss(ctx) {

    if (!boss || boss.dead) return;

    ctx.fillStyle = boss.color;
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#dd00ff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // HP BAR
    const bw = 120;

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(
        boss.x - bw / 2,
        boss.y - boss.size / 2 - 16,
        bw,
        10
    );

    ctx.fillStyle = "#dd00ff";
    ctx.fillRect(
        boss.x - bw / 2,
        boss.y - boss.size / 2 - 16,
        bw * (boss.hp / boss.maxHp),
        10
    );
}

// ================================
// INDICATOR
// ================================
export function drawBossIndicator(ctx, camera, canvas) {

    if (!boss || boss.dead) return;

    const bx = boss.x - camera.x;
    const by = boss.y - camera.y;

    // Si visible → pas d’indicateur
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
    ctx.moveTo(0, -14);
    ctx.lineTo(28, 0);
    ctx.lineTo(0, 14);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}
