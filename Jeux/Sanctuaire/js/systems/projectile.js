// systems/projectile.js

export const projectiles = [];

// ================================
// SPAWN PROJECTILE
// ================================
export function spawnProjectile(player, target) {

    if (!player || !target) return;

    const dx = target.x - player.x;
    const dy = target.y - player.y;

    const dist = Math.hypot(dx, dy);

    if (dist === 0) return;

    const speed = player.bulletSpeed ?? 10;

    projectiles.push({
        x: player.x,
        y: player.y,

        vx: (dx / dist) * speed,
        vy: (dy / dist) * speed,

        size: player.bulletSize ?? 6,
        damage: player.damage ?? 1,

        element: player.element ?? "physical",

        range: player.bulletRange ?? 500,
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

        const speed = Math.hypot(p.vx, p.vy);
        p.traveled += speed;

        if (p.traveled >= p.range) {
            list.splice(i, 1);
        }
    }
}

// ================================
// COLLISION SYSTEM
// ================================
export function handleProjectileCollisions(list, mobs, onHit) {

    for (let i = list.length - 1; i >= 0; i--) {

        const p = list[i];
        if (!p) continue;

        let removed = false;

        for (let j = mobs.length - 1; j >= 0; j--) {

            const m = mobs[j];
            if (!m || m.dead) continue;

            const dx = m.x - p.x;
            const dy = m.y - p.y;

            const dist = Math.hypot(dx, dy);

            const minDist = (m.size ?? 28) / 2 + (p.size ?? 6) / 2;

            if (dist < minDist) {

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
        ctx.arc(p.x, p.y, (p.size ?? 6) / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}