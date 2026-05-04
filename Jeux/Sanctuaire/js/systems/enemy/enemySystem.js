/*
   ROUTE : Jeux/Sanctuaire/js/systems/enemy/enemySystem.js

   RÔLE :
     Runtime des ennemis (IA, collisions, mort).
     Ne gère aucune logique de progression (XP, loot, objectif).
     Sur la mort, délègue l’événement à runXP + callbacks externes.

   PRINCIPES :
     - IA simple idle/chase
     - Collision mob/mob + mob/player (anti-jitter)
     - Mort = onEnemyKilled(mob, config, player)
     - Aucune stat avancée ici (calculs centralisés ailleurs)
     - Toutes les valeurs utilisées viennent de mob.runtime (jamais mob.* brut)
*/

import { onEnemyKilled } from "../xp/runXP.js";
import { createEnemy } from "./enemyFactory.js";
import { Bestiary } from "../../data/bestiary.js";

export const enemies = [];

// ================================
// SPAWN
// ================================
export function spawnEnemy(mob) {

    mob.isMob = true;

    mob.spawnX = mob.spawnX ?? mob.x;
    mob.spawnY = mob.spawnY ?? mob.y;

    mob.dead = false;
    mob.state = "idle";

    // === Runtime obligatoire ===
    // enemyFactory doit avoir généré mob.stats
    // ici on génère mob.runtime (miroir des stats finales)
    mob.runtime = {};
    for (const id in mob.stats) {
        mob.runtime[id] = mob.stats[id];
    }

    // === Valeurs fallback ===
    mob.maxHp = mob.runtime.maxHp ?? mob.hp ?? 10;
    mob.hp = mob.hp ?? mob.maxHp;

    mob.size = mob.size ?? 28;
    mob.visualSize = mob.visualSize ?? mob.size;

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
                {} // pas élite
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

        // mort
        if (mob.hp <= 0 && !mob.dead) {

            handleMobDeath(mob, config, player);

            enemies.splice(i, 1);
            continue;
        }

        updateMobAI(mob, player, dt);
    }

    resolveMobCollisions();
    resolvePlayerCollision(player);
}

// ================================
// ENEMY DEATH
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

    // vitesse runtime
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

            const push = overlap;

            const nx = dx / dist;
            const ny = dy / dist;

            mob.x += nx * push;
            mob.y += ny * push;

            player.x -= nx * push;
            player.y -= ny * push;
        }
    }
}

// ================================
// DRAW
// ================================
export function drawEnemies(ctx) {

    for (const mob of enemies) {

        if (mob.dead) continue;

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

        ctx.fillStyle = "#ffffff";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";

        ctx.fillText(
            `${mob.type} E:${mob.isElite ? 1 : 0} P:${mob.objectivePoints} S:${mob.size}`,
            mob.x,
            mob.y - (mob.visualSize ?? mob.size) / 2 - 10
        );

        ctx.globalAlpha = 1;
    }
}
