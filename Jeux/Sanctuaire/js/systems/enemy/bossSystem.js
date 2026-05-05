/*
   ROUTE : Jeux/Sanctuaire/js/systems/enemy/bossSystem.js

   RÔLE :
     IA + rendu spécifique du boss.
     Le boss utilise le pipeline unifié :
       - dégâts : damageEnemy()
       - collisions : enemySystem
       - projectiles : projectileSystem
       - mort : damageEnemy() déclenche boss:dead
*/

import { spawnProjectile } from "../projectileSystem.js";
import { computeOffense, damagePlayer } from "../damageSystem.js";
import { enemies } from "./enemySystem.js";
import { player } from "../player/player.js";
import { bossProfiles } from "../../data/bossProfiles.js";

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
    const profile = bossProfiles.spectral_archer;
    const margin = profile.stats.aggroRange + 500;
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

    const profile = bossProfiles.spectral_archer;
    const pos = spawnBossOffscreen(player);

    // === STATS ===
    const stats = {
        maxHp: profile.stats.maxHp * difficulty,
        hp: profile.stats.maxHp * difficulty,

        moveSpeed: profile.stats.moveSpeed,
        aggroRange: profile.stats.aggroRange,

        damage: profile.ranged.enabled
            ? profile.ranged.damage
            : (profile.melee.damage ?? 10),

        critChance: 0.05,
        critMultiplier: 1.5,

        // IMPORTANT : toutes les stats défensives/offensives
        // peuvent être ajoutées ici si tu veux enrichir le boss
    };

    // === RUNTIME ===
    const runtime = {};
    for (const k in stats) runtime[k] = stats[k];

    // === BOSS OBJECT ===
    boss = {
        x: pos.x,
        y: pos.y,

        size: 90,
        color: profile.color,

        stats,
        runtime,

        hp: stats.hp,
        maxHp: stats.maxHp,

        isBoss: true,
        isMob: true,
        type: "boss",

        profile,

        state: "idle",

        meleeTimer: 0,
        rangedTimer: 0,

        dead: false,

        lastHitTime: performance.now(),
        speedBuffActive: false,
        speedBuffTimer: 0
    };

    window.boss = boss;

    // 🔥 Le boss est un ennemi normal pour collisions/projectiles
    enemies.push(boss);

    spawnEvent = "spawn";
}

// ============================================================================
// UPDATE BOSS (IA SPÉCIALE)
// ============================================================================
export function updateBoss(player, dt) {

    if (!boss || boss.dead) return;

    const now = performance.now();
    const r = boss.runtime;
    const p = boss.profile;

    const dx = player.x - boss.x;
    const dy = player.y - boss.y;
    const dist = Math.hypot(dx, dy);

    const meleeProfile = p.melee;
    const rangedProfile = p.ranged;

    const meleeDistance =
        (boss.size / 2) +
        (player.size / 2) +
        (meleeProfile.range ?? 0);

    // === IDLE ===
    if (boss.state === "idle") {
        if (dist < r.aggroRange) boss.state = "chase";
        return;
    }

    // === CHASE ===
    if (boss.state === "chase") {

        // Déplacement
        if (dist > 0) {
            const speed = r.moveSpeed * (dt / 1000);
            boss.x += (dx / dist) * speed;
            boss.y += (dy / dist) * speed;
        }

        // === ATTAQUE MÊLÉE ===
        if (meleeProfile.enabled) {
            boss.meleeTimer += dt;

            if (dist < meleeDistance && boss.meleeTimer >= meleeProfile.cooldown) {

                boss.meleeTimer = 0;

                const dmgPacket = computeOffense({
                    ...r,
                    damage: meleeProfile.damage,
                    element: meleeProfile.element ?? "physical",
                    coefficient: meleeProfile.coefficient ?? 1
                });

                damagePlayer(player, dmgPacket);
            }
        }

        // === ATTAQUE À DISTANCE ===
        if (rangedProfile.enabled) {
            boss.rangedTimer += dt;

            if (boss.rangedTimer >= rangedProfile.cooldown) {
                boss.rangedTimer = 0;

                const vx = dx / dist;
                const vy = dy / dist;

                spawnProjectile({
                    x: boss.x,
                    y: boss.y,
                    vx,
                    vy,
                    speed: rangedProfile.speed,
                    range: rangedProfile.range,
                    owner: boss
                });
            }
        }

        // === ANTI-KITE ===
        if (!boss.speedBuffActive && now - boss.lastHitTime > 3000) {
            boss.speedBuffActive = true;
            boss.speedBuffTimer = 2000;
            r.moveSpeed = boss.stats.moveSpeed * 1.2;
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
// DESSIN DU BOSS (SKIN SPÉCIAL)
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
// CERCLE D’AGGRO
// ============================================================================
export function drawBossAggroCircle(ctx, camera) {

    if (!boss || boss.dead) return;
    if (boss.state !== "idle") return;

    const bx = boss.x;
    const by = boss.y;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
    ctx.lineWidth = 3;

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

    const bx = boss.x - camera.x;
    const by = boss.y - camera.y;

    const px = player.x - camera.x;
    const py = player.y - camera.y;

    if (bx >= 0 && bx <= canvas.width && by >= 0 && by <= canvas.height) return;

    const dx = bx - px;
    const dy = by - py;

    const angle = Math.atan2(dy, dx);

    const radius = 60;

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
