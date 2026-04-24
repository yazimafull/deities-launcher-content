// projectile.js

export const projectiles = [];

// ================================
// SPAWN PROJECTILE
// ================================
export function spawnProjectile(player, target) {
    if (!player || !target) return;

    const dx = target.x - player.x;
    const dy = target.y - player.y;
    const d = Math.hypot(dx, dy);

    if (d === 0) return;

    projectiles.push({
        x: player.x,
        y: player.y,
        vx: (dx / d) * (player.bulletSpeed || 10),
        vy: (dy / d) * (player.bulletSpeed || 10),
        size: player.bulletSize || 6,
        damage: player.damage || 1,
        element: player.element || "physical",
        range: player.bulletRange || 500,
        traveled: 0,
        piercing: !!player.piercing
    });
}

// ================================
// UPDATE PROJECTILES
// ================================
export function updateProjectiles(list) {
    for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];

        p.x += p.vx;
        p.y += p.vy;
        p.traveled += Math.hypot(p.vx, p.vy);

        if (p.traveled > p.range) {
            list.splice(i, 1);
        }
    }
}

// ================================
// COLLISION PROJECTILE → MOB
// ================================
export function handleProjectileCollisions(list, mobs, onHit) {
    for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];

        let removed = false;

        for (let j = mobs.length - 1; j >= 0; j--) {
            const m = mobs[j];
            if (!m || m.dead) continue;

            const dx = m.x - p.x;
            const dy = m.y - p.y;
            const dist = Math.hypot(dx, dy);

            if (dist < (m.size / 2 + p.size / 2)) {
                onHit?.(p, m, j);

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
// DRAW PROJECTILES
// ================================
export function drawProjectiles(ctx, list) {
    if (!ctx) return;

    ctx.fillStyle = "#ffe566";

    for (const p of list) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}