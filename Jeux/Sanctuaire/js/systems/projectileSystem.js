/*
   ROUTE : systems/projectileSystem.js
   RÔLE : Gestion des projectiles (spawn, update, collisions, draw)
*/

import { computeOffense, damageEnemy, damagePlayer } from "./damageSystem.js";
import { applyElementalEffects } from "./effects/index.js";

export const projectiles = [];

// ================================
// SPAWN PROJECTILE
// ================================
export function spawnProjectile(data) {

    const {
        x, y,
        vx, vy,
        speed = 600,
        range = 300,
        size = 6,
        piercing = false,
        homing = false,
        owner = null
    } = data;

    if (x === undefined || y === undefined) return;
    if (vx === undefined || vy === undefined) return;

    let damagePacket = null;
    let r = null;

    if (owner) {
        r = owner.runtime ?? owner;

        // 1) Dégâts bruts
        damagePacket = computeOffense(r);
        damagePacket.type = r.element ?? "physical";

        // 2) Couleur par défaut selon élément
        switch (damagePacket.type) {
            case "fire":      damagePacket.projectileColor = "#ff6633"; break;
            case "ice":       damagePacket.projectileColor = "#66ccff"; break;
            case "lightning": damagePacket.projectileColor = "#ffff55"; break;
            case "shadow":    damagePacket.projectileColor = "#cc66ff"; break;
            case "poison":    damagePacket.projectileColor = "#66ff66"; break;
            default:          damagePacket.projectileColor = "#ffe566"; break;
        }

        // 3) Effets élémentaires (DOT, slow, chain, poison…)
        damagePacket = applyElementalEffects(r, damagePacket);
    }

    projectiles.push({
        x,
        y,
        vx,
        vy,
        speed,
        range,
        size,
        piercing,
        homing,
        owner: r,
        traveled: 0,
        damagePacket,
        color: damagePacket?.projectileColor ?? "#ffe566"
    });
}

// ================================
// UPDATE PROJECTILES
// ================================
export function updateProjectiles(dt, player, enemies) {

    for (let i = projectiles.length - 1; i >= 0; i--) {

        const p = projectiles[i];

        // HOMING
        if (p.homing && p.owner) {

            const target = p.owner.isMob
                ? player
                : findNearestEnemy(p, enemies);

            if (target) {
                const dx = target.x - p.x;
                const dy = target.y - p.y;
                const dist = Math.hypot(dx, dy);

                if (dist > 0) {

                    const tx = dx / dist;
                    const ty = dy / dist;

                    p.vx = p.vx * 0.85 + tx * 0.15;
                    p.vy = p.vy * 0.85 + ty * 0.15;

                    const nd = Math.hypot(p.vx, p.vy);
                    if (nd > 0) {
                        p.vx /= nd;
                        p.vy /= nd;
                    }
                }
            }
        }

        // DÉPLACEMENT
        const dx = p.vx * p.speed * (dt / 1000);
        const dy = p.vy * p.speed * (dt / 1000);

        p.x += dx;
        p.y += dy;

        p.traveled += Math.hypot(dx, dy);

        // FIN DE VIE
        if (p.traveled >= p.range) {
            projectiles.splice(i, 1);
        }
    }
}

// ================================
// COLLISIONS
// ================================
export function handleProjectileCollisions(player, enemies, onHit) {

    for (let i = projectiles.length - 1; i >= 0; i--) {

        const p = projectiles[i];
        let removed = false;

        // PROJECTILE JOUEUR → MOBS
        if (p.owner && !p.owner.isMob) {

            for (let j = enemies.length - 1; j >= 0; j--) {

                const m = enemies[j];
                if (!m || m.dead) continue;

                const dx = m.x - p.x;
                const dy = m.y - p.y;
                const dist = Math.hypot(dx, dy);

                const minDist = (m.size / 2) + (p.size / 2);

                if (dist < minDist) {

                    if (onHit) {
                        onHit(p, m);
                    } else {
                        damageEnemy(m, p.damagePacket);
                    }

                    if (!p.piercing) {
                        projectiles.splice(i, 1);
                        removed = true;
                    }
                    break;
                }
            }
        }

        if (removed) continue;

        // PROJECTILE MOB → JOUEUR
        if (p.owner && p.owner.isMob) {

            const dx = player.x - p.x;
            const dy = player.y - p.y;
            const dist = Math.hypot(dx, dy);

            const minDist = (player.size / 2) + (p.size / 2);

            if (dist < minDist) {

                damagePlayer(player, p.damagePacket);

                if (!p.piercing) {
                    projectiles.splice(i, 1);
                }
            }
        }
    }
}

// ================================
// DRAW PROJECTILES
// ================================
export function drawProjectiles(ctx) {

    for (const p of projectiles) {

        ctx.fillStyle = p.color ?? "#ffe566";

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ================================
// UTIL : cible homing
// ================================
function findNearestEnemy(p, enemies) {

    let best = null;
    let bestDist = Infinity;

    for (const m of enemies) {
        if (!m || m.dead) continue;

        const dx = m.x - p.x;
        const dy = m.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < bestDist) {
            bestDist = dist;
            best = m;
        }
    }

    return best;
}
