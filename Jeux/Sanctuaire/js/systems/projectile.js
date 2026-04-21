// projectile.js

export const projectiles = [];

// ================================
// SPAWN UN PROJECTILE
// ================================
export function spawnProjectile(player, target) {
    const dx = target.x - player.x;
    const dy = target.y - player.y;
    const d  = Math.hypot(dx, dy);
    if (d === 0) return;

    projectiles.push({
        x:        player.x,
        y:        player.y,
        vx:       (dx / d) * player.bulletSpeed,
        vy:       (dy / d) * player.bulletSpeed,
        size:     player.bulletSize,
        damage:   player.damage,
        element:  player.element || "physical",
        range:    player.bulletRange,
        traveled: 0,
        piercing: player.piercing
    });
}

// ================================
// UPDATE DES PROJECTILES
// ================================
export function updateProjectiles(list) {
    for (let p of list) {
        p.x        += p.vx;
        p.y        += p.vy;
        p.traveled += Math.hypot(p.vx, p.vy);
    }

    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].traveled > list[i].range) {
            list.splice(i, 1);
        }
    }
}

// ================================
// COLLISIONS PROJECTILES → MOBS
// ================================
export function handleProjectileCollisions(list, mobs, onHit) {
    for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        let removed = false;

        for (let j = mobs.length - 1; j >= 0; j--) {
            const m = mobs[j];
            if (m.dead) continue;

            const dx   = m.x - p.x;
            const dy   = m.y - p.y;
            const dist = Math.hypot(dx, dy);

            if (dist < (m.size/2 + p.size/2)) {
                onHit(p, m, j);

                if (!p.piercing) {
                    list.splice(i, 1);
                    removed = true;
                    break;
                }
            }
        }

        if (removed) continue;
    }
}

// ================================
// DESSIN DES PROJECTILES
// ================================
export function drawProjectiles(ctx, list) {
    ctx.fillStyle = "#ffe566";
    for (let p of list) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}
