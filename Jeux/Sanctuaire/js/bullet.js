// bullet.js
import { enemies } from "./enemy.js";

export const bullets = [];

// --------------------------------------------------
// CRÉATION D'UNE BALLE
// --------------------------------------------------
export function spawnBullet(player, target) {
    const dx = target.x - player.x;
    const dy = target.y - player.y;
    const d = Math.hypot(dx, dy);

    const vx = (dx / d) * player.bulletSpeed;
    const vy = (dy / d) * player.bulletSpeed;

    bullets.push({
        x: player.x,
        y: player.y,
        vx,
        vy,
        size: player.bulletSize,
        damage: player.damage,
        element: player.element || "physical",
        range: player.bulletRange,
        traveled: 0,
        piercing: player.piercing
    });
}

// --------------------------------------------------
// UPDATE DES BALLES
// --------------------------------------------------
export function updateBullets(dt) {
    for (let b of bullets) {
        b.x += b.vx;
        b.y += b.vy;
        b.traveled += Math.hypot(b.vx, b.vy);
    }

    // Supprimer les balles hors portée
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].traveled > bullets[i].range) {
            bullets.splice(i, 1);
        }
    }

    // ❌ PAS de collision ici — c'est collisionSystem.js qui s'en charge
}

// --------------------------------------------------
// DESSIN DES BALLES
// --------------------------------------------------
export function drawBullets(ctx) {
    ctx.fillStyle = "#ffffff";
    for (let b of bullets) {
        ctx.fillRect(b.x - b.size / 2, b.y - b.size / 2, b.size, b.size);
    }
}
