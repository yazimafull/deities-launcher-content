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
*/


import { onEnemyKilled } from "../xp/runXP.js";

export const enemies = [];

// ================================
// SPAWN
// ================================
export function spawnEnemy(mob) {

    mob.isMob = true;

    mob.spawnX = mob.spawnX ?? mob.x;
    mob.spawnY = mob.spawnY ?? mob.y;

    mob.maxHp = mob.maxHp ?? mob.hp;

    mob.dead = false;
    mob.state = "idle";

    mob.speed = mob.speed ?? 80;

    mob.size = mob.size ?? 28;
    mob.visualSize = mob.visualSize ?? mob.size;

    mob.meleeRange = mob.meleeRange ?? 0;
    mob.attackSpeed = mob.attackSpeed ?? 800;

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

            const ally = {
                ...structuredClone(mob),

                isElite: false,
                entourage: 0,

                x: mob.x + o.dx,
                y: mob.y + o.dy,

                spawnX: mob.x + o.dx,
                spawnY: mob.y + o.dy,

                hp: mob.maxHp * 0.6,
                maxHp: mob.maxHp * 0.6,

                state: "idle",
                dead: false
            };

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

    // délègue TOUT à runXP
    onEnemyKilled(mob, config, player);

    // callback externe (objectif, loot…)
    if (typeof config.onMobKilled === "function") {
        config.onMobKilled(mob);
    }
}

// ================================
// MOB AI
// ================================
function updateMobAI(mob, player, dt) {

    const dx = player.x - mob.x;
    const dy = player.y - mob.y;

    const dist = Math.hypot(dx, dy);

    const aggroRange = mob.aggroRange ?? 280;

    const speed = mob.speed * (dt / 1000);

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

            const maxPush = 2.5;
            const push = Math.min(overlap * 0.5, maxPush);

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

        // shadow
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

        // body
        ctx.fillStyle = mob.state === "chase"
            ? brighten(mob.color)
            : mob.color;

        ctx.beginPath();
        ctx.arc(
            mob.x,
            mob.y,
            mob.visualSize / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // elite outline
        if (mob.isElite) {
            ctx.strokeStyle = "#ffcc00";
            ctx.lineWidth = 2.5;
            ctx.stroke();
        }

        // hp bar
        const bw = mob.visualSize * 1.4;

        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(
            mob.x - bw / 2,
            mob.y - mob.visualSize / 2 - 10,
            bw,
            5
        );

        ctx.fillStyle = mob.isElite ? "#ffcc00" : "#ff4444";
        ctx.fillRect(
            mob.x - bw / 2,
            mob.y - mob.visualSize / 2 - 10,
            bw * Math.max(0, mob.hp / mob.maxHp),
            5
        );

        ctx.globalAlpha = 1;
    }
}

// ================================
// COLOR UTIL
// ================================
function brighten(hex) {

    if (!hex) return "#884444";

    try {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        const f = v =>
            Math.min(255, v + 40)
                .toString(16)
                .padStart(2, "0");

        return `#${f(r)}${f(g)}${f(b)}`;

    } catch {
        return "#884444";
    }
}
