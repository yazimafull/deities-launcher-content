// ROUTE : Jeux/Sanctuaire/js/systems/enemy/bossSystem.js
// ============================================================================
// BOSS PROPRE : stats → runtime → computeOffense → damageSystem
// ============================================================================

import { spawnProjectile } from "../projectileSystem.js";
import { computeOffense, damagePlayer } from "../damageSystem.js";
import { enemies } from "./enemySystem.js";
import { player } from "../player/player.js";


export let boss = null;
let spawnEvent = null;

// ============================================================================
// RESET
// ============================================================================
export function resetBoss() {
    boss = null;
    spawnEvent = null;
}

// ============================================================================
// STATUS
// ============================================================================
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

// ============================================================================
// SPAWN HORS‑ÉCRAN
// ============================================================================
function spawnBossOffscreen(player) {
    const margin = 700;
    const side = Math.floor(Math.random() * 4);

    let x, y;

    if (side === 0) {
        x = player.x + (Math.random() * 800 - 400);
        y = player.y - margin;
    } else if (side === 1) {
        x = player.x + (Math.random() * 800 - 400);
        y = player.y + margin;
    } else if (side === 2) {
        x = player.x - margin;
        y = player.y + (Math.random() * 800 - 400);
    } else {
        x = player.x + margin;
        y = player.y + (Math.random() * 800 - 400);
    }

    return { x, y };
}

// ============================================================================
// SPAWN BOSS
// ============================================================================
export function spawnBoss(player, difficulty, biome = "foret") {

    const pos = spawnBossOffscreen(player);

    // ============================
    // STATS FINALES DU BOSS
    // ============================
    const stats = {
        maxHp: 2000 * difficulty,
        hp: 2000 * difficulty,

        moveSpeed: 60,                 // 🔥 vitesse stable
        attackDamage: 5 * difficulty,

        attackCooldownMs: 1200,        // melee cooldown
        attackRange: 120,

        projectileSpeed: 450,
        projectileRange: 600,
        projectileDamage: 25 * difficulty,

        aggroRange: 600
    };

    // ============================
    // RUNTIME (copie propre)
    // ============================
    const runtime = {};
    for (const k in stats) runtime[k] = stats[k];

    // ============================
    // BOSS OBJECT
    // ============================
    boss = {
        x: pos.x,
        y: pos.y,

        size: 90,
        color: "#7700aa",

        stats,
        runtime,

        hp: stats.hp,
        maxHp: stats.maxHp,

        isMob: true,
        type: "boss",

        // === MELEE ===
        weapon: {
            type: "melee",
            meleeRange: 30
        },

        state: "idle",

        // === COOLDOWNS ===
        meleeTimer: 0,
        rangedCooldown: 5000,
        rangedTimer: 0,

        // === ANTI-KITE ===
        lastHitTime: performance.now(),
        speedBuffActive: false,
        speedBuffTimer: 0,

        dead: false
    };

    enemies.push(boss);
    spawnEvent = "spawn";
}

// ============================================================================
// UPDATE
// ============================================================================
export function updateBoss(player, dt) {

    if (!boss || boss.dead) return;

    const now = performance.now();
    const r = boss.runtime;

    const dx = player.x - boss.x;
    const dy = player.y - boss.y;
    const dist = Math.hypot(dx, dy);

    // 🔥 meleeDistance étendue (attaque stable)
    const meleeDistance = (boss.size / 2) + (player.size / 2) + 30;

    // ========================================================================
    // IDLE
    // ========================================================================
    if (boss.state === "idle") {
        if (dist < r.aggroRange) boss.state = "chase";
        return;
    }

    // ========================================================================
    // CHASE
    // ========================================================================
    if (boss.state === "chase") {

        // === DÉPLACEMENT ===
        if (dist > 0) {
            const speed = r.moveSpeed * (dt / 1000);
            boss.x += (dx / dist) * speed;
            boss.y += (dy / dist) * speed;
        }

        // === ATTAQUE MÊLÉE ===
        boss.meleeTimer += dt;

        if (dist < meleeDistance && boss.meleeTimer >= r.attackCooldownMs) {

            boss.meleeTimer = 0;

            const dmgPacket = computeOffense(r);
            dmgPacket.type = "physical";

            damagePlayer(player, dmgPacket);
        }

        // === ATTAQUE À DISTANCE ===
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
                speed: r.projectileSpeed,
                range: r.projectileRange,
                owner: boss
            });
        }

        // ====================================================================
        // ANTI-KITE propre
        // ====================================================================
        if (!boss.speedBuffActive && now - boss.lastHitTime > 3000) {
            boss.speedBuffActive = true;
            boss.speedBuffTimer = 2000;
            r.moveSpeed = boss.stats.moveSpeed * 1.2; // +20%
        }

        if (boss.speedBuffActive) {
            boss.speedBuffTimer -= dt;

            if (boss.speedBuffTimer <= 0) {
                boss.speedBuffActive = false;
                r.moveSpeed = boss.stats.moveSpeed;
            }
        }
    }
}

// ============================================================================
// DAMAGE BOSS
// ============================================================================
export function damageBoss(amount) {

    if (!boss || boss.dead) return;

    boss.hp -= amount;
    boss.runtime.hp = boss.hp;

    // reset anti-kite propre
    boss.lastHitTime = performance.now();
    boss.speedBuffActive = false;
    boss.runtime.moveSpeed = boss.stats.moveSpeed;

    if (boss.hp <= 0) {
        boss.hp = 0;
        boss.dead = true;

        window.dispatchEvent(new CustomEvent("boss:dead"));
    }
}

// ============================================================================
// DRAW BOSS
// ============================================================================
export function drawBoss(ctx) {

    if (!boss || boss.dead) return;

    ctx.fillStyle = boss.color;
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#dd00ff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // === BARRE DE VIE ===
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

// ============================================================================
// CERCLE D’AGGRO (idle uniquement)
// ============================================================================
export function drawBossAggroCircle(ctx, camera) {

    if (!boss || boss.dead) return;
    if (boss.state !== "idle") return;

    // Le moteur a déjà fait translate(-camera.x, -camera.y)
    const bx = boss.x;
    const by = boss.y;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
    ctx.lineWidth = 6;

    const visualAggro = boss.runtime.aggroRange;

    ctx.beginPath();
    ctx.arc(bx, by, visualAggro, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
}



// ============================================================================
// INDICATEUR HORS‑ÉCRAN
// ============================================================================
export function drawBossIndicator(ctx, camera, canvas) {

    if (!boss || boss.dead) return;

    // Coordonnées écran du boss
    const bx = boss.x - camera.x;
    const by = boss.y - camera.y;

    // Coordonnées écran du joueur
    const px = player.x - camera.x;
    const py = player.y - camera.y;

    // Si le boss est visible → pas d’indicateur
    if (bx >= 0 && bx <= canvas.width && by >= 0 && by <= canvas.height) return;

    // Direction boss → joueur
    const dx = bx - px;
    const dy = by - py;

    const angle = Math.atan2(dy, dx);

    // Rayon autour du joueur (distance de la boussole)
    const radius = 60;

    // Position finale de l’indicateur
    const ix = px + Math.cos(angle) * radius;
    const iy = py + Math.sin(angle) * radius;

    ctx.save();
    ctx.translate(ix, iy);
    ctx.rotate(angle);

    ctx.fillStyle = "#dd00ff";
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(20, 0);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}





