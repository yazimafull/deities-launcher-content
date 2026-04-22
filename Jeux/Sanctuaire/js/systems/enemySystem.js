// systems/enemySystem.js

import { damagePlayer } from "./damageSystem.js";

export const enemies = [];

// ================================
// SPAWN
// ================================
export function spawnEnemy(mob) {
    enemies.push(mob);

    // ================================
    // ENTOURAGE AUTOMATIQUE (ÉLITE)
    // ================================
    if (mob.elite && mob.entourage && mob.entourage > 0) {

        const offsets = [
            {dx: 40, dy: 0},
            {dx:-40, dy: 0},
            {dx: 0,  dy: 40},
            {dx: 0,  dy:-40}
        ];

        for (let i = 0; i < mob.entourage; i++) {
            const o = offsets[i % offsets.length];

            const ally = {
                ...structuredClone(mob),
                elite: false,               // les alliés ne sont pas élites
                entourage: 0,               // pas d’entourage en cascade
                entourageType: null,
                x: mob.x + o.dx,
                y: mob.y + o.dy,
                spawnX: mob.x + o.dx,
                spawnY: mob.y + o.dy
            };

            enemies.push(ally);
        }
    }
}

// ================================
// UPDATE PRINCIPAL
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
// IA MOB — idle / chase / leash
// ================================
function updateMobAI(mob, player, dt) {
    const now = performance.now();

    const dx           = player.x - mob.x;
    const dy           = player.y - mob.y;
    const distToPlayer = Math.hypot(dx, dy);

    const sdx         = (mob.spawnX ?? mob.x) - mob.x;
    const sdy         = (mob.spawnY ?? mob.y) - mob.y;
    const distToSpawn = Math.hypot(sdx, sdy);

    const aggroRange = mob.aggroRange ?? 280;
    const leashRange = mob.leashRange ?? 500;
    const damageCd   = mob.damageCd   ?? 800;

    switch (mob.state) {

        case "idle":
        default:
            if (distToPlayer < aggroRange) mob.state = "chase";
            break;

        case "chase":
            // Trop loin du spawn → leash
            if (distToSpawn > leashRange) {
                mob.state = "leash";
                break;
            }

            // Avancer vers le joueur
            if (distToPlayer > 0) {
                mob.x += (dx / distToPlayer) * mob.speed * dt * 0.06;
                mob.y += (dy / distToPlayer) * mob.speed * dt * 0.06;
            }

            // Contact → dégâts
            if (distToPlayer < ((player.size ?? 28) / 2 + (mob.size ?? 28) / 2)) {
                if (now - (mob.lastDmgTime || 0) > damageCd) {
                    damagePlayer(player, {
                        base:  mob.damage,
                        type:  "physical"
                    });
                    mob.lastDmgTime = now;
                }
            }
            break;

        case "leash":
            // Retour au spawn
            if (distToSpawn > 4) {
                mob.x += (sdx / distToSpawn) * mob.speed * dt * 0.09;
                mob.y += (sdy / distToSpawn) * mob.speed * dt * 0.09;
                mob.hp = Math.min(mob.maxHp, mob.hp + 0.3);
            } else {
                mob.hp    = mob.maxHp;
                mob.state = "idle";
            }

            // Joueur revient en range → rechase
            if (distToPlayer < aggroRange) mob.state = "chase";
            break;
    }
}

// ================================
// SÉPARATION MOB / MOB
// ================================
function resolveMobCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            const a = enemies[i];
            const b = enemies[j];

            const dx      = b.x - a.x;
            const dy      = b.y - a.y;
            const dist    = Math.hypot(dx, dy);
            const minDist = (a.size ?? 28) + (b.size ?? 28);

            if (dist < minDist && dist > 0) {
                const overlap = (minDist - dist) / 2;
                a.x -= (dx / dist) * overlap;
                a.y -= (dy / dist) * overlap;
                b.x += (dx / dist) * overlap;
                b.y += (dy / dist) * overlap;
            }
        }
    }
}

// ================================
// SÉPARATION MOB / JOUEUR
// ================================
function resolvePlayerCollision(player) {
    for (let mob of enemies) {
        const dx      = mob.x - player.x;
        const dy      = mob.y - player.y;
        const dist    = Math.hypot(dx, dy);
        const minDist = (mob.size ?? 28) + (player.size ?? 28);

        if (dist < minDist && dist > 0) {
            const overlap = minDist - dist;
            mob.x += (dx / dist) * overlap;
            mob.y += (dy / dist) * overlap;
        }
    }
}

// ================================
// DESSIN
// ================================
export function drawEnemies(ctx) {
    for (let mob of enemies) {
        if (mob.dead) continue;

        ctx.globalAlpha = mob.alpha ?? 1.0;

        // Ombre
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath();
        ctx.ellipse(mob.x, mob.y + mob.size/2 - 2, mob.size/2, 5, 0, 0, Math.PI*2);
        ctx.fill();

        // Corps
        ctx.fillStyle = mob.state === "chase" ? brighten(mob.color) : (mob.color ?? "#884444");
        ctx.beginPath();
        ctx.arc(mob.x, mob.y, mob.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Contour élite
        if (mob.isElite) {
            ctx.strokeStyle = "#ffcc00";
            ctx.lineWidth   = 2.5;
            ctx.stroke();
        }

        // Barre de vie
        const bw = mob.size * 1.4;
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(mob.x - bw/2, mob.y - mob.size/2 - 10, bw, 5);
        ctx.fillStyle = mob.isElite ? "#ffcc00" : "#ff4444";
        ctx.fillRect(mob.x - bw/2, mob.y - mob.size/2 - 10, bw * Math.max(0, mob.hp/mob.maxHp), 5);

        ctx.globalAlpha = 1.0;
    }
}

function brighten(hex) {
    try {
        const r  = parseInt(hex.slice(1,3), 16);
        const g  = parseInt(hex.slice(3,5), 16);
        const b  = parseInt(hex.slice(5,7), 16);
        const br = v => Math.min(255, v+40).toString(16).padStart(2,"0");
        return `#${br(r)}${br(g)}${br(b)}`;
    } catch { return hex ?? "#884444"; }
}
