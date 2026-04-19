// player.js
import { isDown } from "./input.js";
import { dist2 } from "./utils.js";
import { spawnBullet } from "./bullet.js";

export const player = {
    x: 0,
    y: 0,
    size: 30,

    // --- MOUVEMENT ---
    speed: 3,
    moveSpeedMultiplier: 1,

    // --- VIE ---
    hp: 100,
    maxHp: 100,
    hpRegen: 0,

    // --- BOUCLIERS ---
    shieldPhysical: 0,
    maxShieldPhysical: 0,
    shieldMagic: 0,
    maxShieldMagic: 0,

    // --- DÉFENSE ---
    armor: 0,
    resistance: 0,
    dodgeChance: 0,
    parryChance: 0,
    parryReduction: 0.7,
    blockChance: 0,
    blockValue: 0,

    // --- COMBAT ---
    damage: 10,
    fireRate: 400,
    lastShot: 0,
    critChance: 0.1,
    critMultiplier: 2,
    element: null,

    // --- PROJECTILES ---
    bulletSpeed: 6,
    bulletSize: 8,
    bulletRange: 2000,
    piercing: false
};

export function updatePlayer(dt, enemies) {
    const canvas = document.getElementById("game-canvas");
    const half = player.size / 2;

    // Déplacement ZQSD
    let move = player.speed * player.moveSpeedMultiplier;
    if (isDown("z")) player.y -= move;
    if (isDown("s")) player.y += move;
    if (isDown("q")) player.x -= move;
    if (isDown("d")) player.x += move;

    // 🔒 Clamp : empêche le joueur de sortir de l'écran
    player.x = Math.max(half, Math.min(canvas.width  - half, player.x));
    player.y = Math.max(half, Math.min(canvas.height - half, player.y));

    // Régénération de vie
    if (player.hp < player.maxHp && player.hpRegen > 0) {
        player.hp += (player.hpRegen * dt) / 1000;
        if (player.hp > player.maxHp) player.hp = player.maxHp;
    }

    // Tir automatique
    if (enemies.length > 0) {
        let now = performance.now();
        if (now - player.lastShot > player.fireRate) {
            shootNearest(enemies);
            player.lastShot = now;
        }
    }
}

function shootNearest(enemies) {
    let best = null;
    let bestDist = Infinity;

    for (let e of enemies) {
        let d = dist2(player.x, player.y, e.x, e.y);
        if (d < bestDist) {
            bestDist = d;
            best = e;
        }
    }

    if (best) spawnBullet(player, best);
}

export function drawPlayer(ctx) {
    ctx.fillStyle = "#4aa3ff";
    ctx.fillRect(
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );
}
