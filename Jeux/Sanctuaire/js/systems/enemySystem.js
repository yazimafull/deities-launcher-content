﻿// systems/enemySystem.js

import { damagePlayer } from "./damageSystem.js";

export const enemies = [];

// ================================
// SPAWN
// ================================
export function spawnEnemy(mob) {

    mob.spawnX = mob.spawnX ?? mob.x;
    mob.spawnY = mob.spawnY ?? mob.y;

    mob.maxHp = mob.maxHp ?? mob.hp;
    mob.state = mob.state ?? "idle";

    mob.lastDmgTime = 0;
    mob.dead = false;

    enemies.push(mob);

    // ================================
    // ELITE ENTOURAGE
    // ================================
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

                maxHp: mob.maxHp * 0.6,
                hp: mob.maxHp * 0.6,

                state: "idle",
                lastDmgTime: 0,
                dead: false
            };

            enemies.push(ally);
        }
    }
}

// ================================
// UPDATE
// ================================
export function updateEnemies(dt, player) {

    for (let i = enemies.length - 1; i >= 0; i--) {

        const mob = enemies[i];

        if (mob.dead) {
            enemies.splice(i, 1);
            continue;
        }

        updateMobAI(mob, player, dt);
    }

    resolveMobCollisions();
    resolvePlayerCollision(player);
}

// ================================
// IA
// ================================
function updateMobAI(mob, player, dt) {

    const now = performance.now();

    const dx = player.x - mob.x;
    const dy = player.y - mob.y;
    const distToPlayer = Math.hypot(dx, dy);

    const sx = mob.spawnX - mob.x;
    const sy = mob.spawnY - mob.y;
    const distToSpawn = Math.hypot(sx, sy);

    const aggroRange = mob.aggroRange ?? 280;
    const leashRange = mob.leashRange ?? 500;
    const damageCd = mob.damageCd ?? 800;

    const speed = mob.speed * dt * 0.06;

    switch (mob.state) {

        case "idle":
            if (distToPlayer < aggroRange) {
                mob.state = "chase";
            }
            break;

        case "chase":

            if (distToSpawn > leashRange) {
                mob.state = "leash";
                break;
            }

            if (distToPlayer > 0) {
                mob.x += (dx / distToPlayer) * speed;
                mob.y += (dy / distToPlayer) * speed;
            }

            if (distToPlayer < ((player.size ?? 28) / 2 + (mob.size ?? 28) / 2)) {

                if (now - mob.lastDmgTime > damageCd) {

                    damagePlayer(player, {
                        base: mob.damage,
                        type: "physical"
                    });

                    mob.lastDmgTime = now;
                }
            }
            break;

        case "leash":

            if (distToSpawn > 4) {

                mob.x += (sx / distToSpawn) * speed * 1.2;
                mob.y += (sy / distToSpawn) * speed * 1.2;

                mob.hp = Math.min(mob.maxHp, mob.hp + 0.2);
            } else {
                mob.hp = mob.maxHp;
                mob.state = "idle";
            }

            if (distToPlayer < aggroRange) {
                mob.state = "chase";
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

            const min = (a.size ?? 28) + (b.size ?? 28);

            if (dist > 0 && dist < min) {

                const overlap = (min - dist) / 2;

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

    for (let mob of enemies) {

        const dx = mob.x - player.x;
        const dy = mob.y - player.y;
        const dist = Math.hypot(dx, dy);

        const min = (mob.size ?? 28) + (player.size ?? 28);

        if (dist > 0 && dist < min) {

            const overlap = min - dist;

            mob.x += (dx / dist) * overlap;
            mob.y += (dy / dist) * overlap;
        }
    }
}

// ================================
// DRAW
// ================================
export function drawEnemies(ctx) {

    for (let mob of enemies) {

        if (mob.dead) continue;

        ctx.globalAlpha = mob.alpha ?? 1;

        // shadow
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.beginPath();
        ctx.ellipse(mob.x, mob.y + mob.size / 2, mob.size / 2, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // body
        ctx.fillStyle = mob.state === "chase"
            ? brighten(mob.color)
            : mob.color;

        ctx.beginPath();
        ctx.arc(mob.x, mob.y, mob.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // elite outline
        if (mob.isElite) {
            ctx.strokeStyle = "#ffcc00";
            ctx.lineWidth = 2.5;
            ctx.stroke();
        }

        // HP bar
        const bw = mob.size * 1.4;

        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(
            mob.x - bw / 2,
            mob.y - mob.size / 2 - 10,
            bw,
            5
        );

        ctx.fillStyle = mob.isElite ? "#ffcc00" : "#ff4444";
        ctx.fillRect(
            mob.x - bw / 2,
            mob.y - mob.size / 2 - 10,
            bw * Math.max(0, mob.hp / mob.maxHp),
            5
        );

        ctx.globalAlpha = 1;
    }
}

// ================================
// UTIL
// ================================
function brighten(hex) {

    if (!hex) return "#884444";

    try {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        const f = v => Math.min(255, v + 40).toString(16).padStart(2, "0");

        return `#${f(r)}${f(g)}${f(b)}`;
    } catch {
        return "#884444";
    }
}
