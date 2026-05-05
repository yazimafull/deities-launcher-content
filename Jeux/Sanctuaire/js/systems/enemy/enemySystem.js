/*
   ROUTE : Jeux/Sanctuaire/js/systems/enemy/enemySystem.js

   RÔLE :
     Gestion runtime des ennemis (MOBS UNIQUEMENT).
     Le boss est dans enemies[] pour collisions & projectiles,
     mais son IA + dessin sont gérés par bossSystem.

   PRINCIPES :
     - IA simple idle/chase pour les mobs
     - Collisions mob/mob + mob/player
     - Mort des mobs (le boss est exclu)
     - Aucune stat avancée ici
*/

import { onEnemyKilled } from "../xp/runXP.js";
import { createEnemy } from "./enemyFactory.js";
import { Bestiary } from "../../data/bestiary.js";

export const enemies = [];
window.enemies = enemies;

// ================================
// SPAWN
// ================================
export function spawnEnemy(mob) {

    mob.isMob = true;

    mob.spawnX = mob.spawnX ?? mob.x;
    mob.spawnY = mob.spawnY ?? mob.y;

    mob.dead = false;
    mob.state = "idle";

    // === Runtime miroir des stats ===
    mob.runtime = {};
    for (const id in mob.stats) {
        mob.runtime[id] = mob.stats[id];
    }

    // === HP ===
    mob.maxHp = mob.runtime.maxHp ?? mob.stats.maxHp ?? mob.hp ?? 10;
    mob.hp = mob.hp ?? mob.maxHp;

    mob.size = mob.stats.size;
    mob.visualSize = mob.stats.size;

    enemies.push(mob);

    // entourage elite
    if (mob.isElite && mob.entourage > 0) {

        const offsets = [
            { dx: 40, dy: 0 },
            { dx: -40, dy: 0 },
            { dx: 0, dy: 40 },
            { dx: 0, dy: -40 }
        ];

        for (let i = 0; i < mob.entourage; i++) {

            const o = offsets[i % offsets.length];

            const ally = createEnemy(
                mob.type,
                mob.biome,
                mob.difficulty ?? 1,
                mob.x + o.dx,
                mob.y + o.dy,
                Bestiary[mob.type],
                {}
            );

            enemies.push(ally);
        }
    }
}

// ================================
// UPDATE
// ================================
export function updateEnemies(dt, player, config) {

    for (let i = enemies.length - 1; i >= 0; i--) {

        const mob = enemies[i];

        // === MORT DES MOBS UNIQUEMENT ===
        if (!mob.isBoss && mob.hp <= 0 && !mob.dead) {
            handleMobDeath(mob, config, player);
            enemies.splice(i, 1);
            continue;
        }

        // === IA MOBS UNIQUEMENT ===
        if (!mob.isBoss) {
            updateMobAI(mob, player, dt);
        }
    }

    resolveMobCollisions();
    resolvePlayerCollision(player);
}

// ================================
// ENEMY DEATH (MOBS UNIQUEMENT)
// ================================
function handleMobDeath(mob, config, player) {

    mob.dead = true;

    onEnemyKilled(mob, config, player);

    if (typeof config.onMobKilled === "function") {
        config.onMobKilled(mob);
    }
}

// ================================
// MOB AI
// ================================
function updateMobAI(mob, player, dt) {

    const r = mob.runtime ?? mob;

    const dx = player.x - mob.x;
    const dy = player.y - mob.y;

    const dist = Math.hypot(dx, dy);

    const aggroRange = r.aggroRange ?? 280;

    const speed = (r.moveSpeed ?? 80) * (dt / 1000);

    switch (mob.state) {

        case "idle":
            if (dist < aggroRange) mob.state = "chase";
            break;

        case "chase":
            if (dist > 0) {
                mob.x += (dx / dist) * speed;
                mob.y += (dy / dist) * speed;
            }
            break;
    }
}

// ================================
// MOB / MOB COLLISION
// ================================
function resolveMobCollisions() {

    for (let i = 0; i < enemies.length; i++) {

        for (let j = i + 1; j < enemies.length; j++) {

            const a = enemies[i];
            const b = enemies[j];

            if (!a || !b || a.dead || b.dead) continue;

            const dx = b.x - a.x;
            const dy = b.y - a.y;

            const dist = Math.hypot(dx, dy);

            const min = (a.size / 2) + (b.size / 2);

            if (dist > 0 && dist < min) {

                const overlap = (min - dist) * 0.5;

                const ox = (dx / dist) * overlap;
                const oy = (dy / dist) * overlap;

                a.x -= ox;
                a.y -= oy;

                b.x += ox;
                b.y += oy;
            }
        }
    }
}

// ================================
// PLAYER COLLISION
// ================================
function resolvePlayerCollision(player) {

    if (player.dead) return;

    for (const mob of enemies) {

        if (mob.dead) continue;

        const dx = mob.x - player.x;
        const dy = mob.y - player.y;

        const dist = Math.hypot(dx, dy);

        const min = (mob.size / 2) + (player.size / 2);

        if (dist > 0 && dist < min) {

            const overlap = min - dist;

            const nx = dx / dist;
            const ny = dy / dist;

            mob.x += nx * overlap;
            mob.y += ny * overlap;

            player.x -= nx * overlap;
            player.y -= ny * overlap;
        }
    }
}

// ================================
// DRAW (MOBS UNIQUEMENT)
// ================================
export function drawEnemies(ctx) {

    for (const mob of enemies) {

        if (mob.dead) continue;

        // 🔥 IGNORE LE BOSS
        if (mob.isBoss) continue;

        ctx.globalAlpha = mob.alpha ?? 1;

        // SHADOW
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.beginPath();
        ctx.ellipse(
            mob.x,
            mob.y + mob.visualSize / 2,
            mob.visualSize / 2,
            5,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // BODY
        ctx.fillStyle = mob.color;
        ctx.beginPath();
        ctx.arc(
            mob.x,
            mob.y,
            mob.visualSize / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // ELITE RING
        if (mob.isElite) {

            const r = mob.visualSize / 2;
            const thickness = 6;
            const outer = r + thickness;
            const inner = r;

            ctx.beginPath();
            ctx.arc(mob.x, mob.y, outer, 0, Math.PI * 2);
            ctx.arc(mob.x, mob.y, inner, 0, Math.PI * 2, true);

            ctx.fillStyle = "rgba(255, 165, 0, 0.9)";
            ctx.fill();
        }

        // HP BAR
        const bw = mob.visualSize * 1.4;

        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(
            mob.x - bw / 2,
            mob.y - mob.visualSize / 2 - 10,
            bw,
            5
        );

        ctx.fillStyle = mob.isElite ? "#ffd700" : "#ff4444";
        ctx.fillRect(
            mob.x - bw / 2,
            mob.y - mob.visualSize / 2 - 10,
            bw * Math.max(0, mob.hp / mob.maxHp),
            5
        );

        ctx.globalAlpha = 1;
    }
}
