/*
   ROUTE : systems/projectileSystem.js
   RÔLE : Gestion des projectiles (spawn, update, collisions, draw)

   NORMALISATION :
     ✔ projectiles du joueur touchent mobs + boss
     ✔ projectiles des mobs touchent le joueur
     ✔ suppression de l'import boss (inutile)
     ✔ computeOffense utilise owner.stats
*/

import { computeOffense, damageEnemy, damagePlayer } from "./damageSystem.js";
import { applyElementalEffects } from "./effects/index.js";
import { onEnemyKilled } from "./xp/runXP.js";

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

    if (owner) {

        // 🔥 Normalisation : on utilise owner.stats
        // 🔥 Toujours utiliser runtime si dispo
        const s = owner.runtime ?? owner.stats ?? owner;

        // Dégâts basés sur runtime
        damagePacket = computeOffense(s);

        // Élément basé sur runtime > stats > fallback
        damagePacket.type =
            s.element ??
            owner.runtime?.element ??
            owner.element ??
            "physical";


        // Couleur selon élément
        switch (damagePacket.type) {
            case "fire":      damagePacket.projectileColor = "#ff6633"; break;
            case "ice":       damagePacket.projectileColor = "#66ccff"; break;
            case "lightning": damagePacket.projectileColor = "#ffff55"; break;
            case "shadow":    damagePacket.projectileColor = "#cc66ff"; break;
            case "poison":    damagePacket.projectileColor = "#66ff66"; break;
            default:          damagePacket.projectileColor = "#ffe566"; break;
        }

        // Effets élémentaires
        damagePacket = applyElementalEffects(s, damagePacket);
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
        owner,
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

            const target = p.owner === player
                ? findNearestEnemy(p, enemies)
                : player;

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

        // PROJECTILE JOUEUR → ENNEMIS
        if (p.owner === player) {

            for (let j = enemies.length - 1; j >= 0; j--) {

                const m = enemies[j];
                if (!m || m.dead) continue;

                const dx = m.x - p.x;
                const dy = m.y - p.y;
                const dist = Math.hypot(dx, dy);

                const minDist = (m.size / 2) + (p.size / 2);

                if (dist < minDist) {

                    const wasAlive = !m.dead;

                    if (onHit) onHit(p, m);
                    else damageEnemy(m, p.damagePacket);

                    // 🔥 Si le mob vient de mourir → XP + objectif
                    if (wasAlive && m.dead) {

                        // Objectif
                        if (typeof window.gameContext?.onMobKilled === "function") {
                            window.gameContext.onMobKilled(m);
                        }

                        // XP drop
                        onEnemyKilled(m, window.gameContext, player);
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

        // PROJECTILE MOB/BOSS → JOUEUR
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
        if (m === p.owner) continue; // 🔥 évite auto‑ciblage

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

