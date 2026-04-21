// systems/enemySystem.js
// IA + déplacement + agro + attaque + mort + collisions

import { damagePlayer } from "./damageSystem.js";

export const enemies = [];

// --------------------------------------------------
// SPAWN
// --------------------------------------------------
export function spawnEnemy(mob) {
    enemies.push(mob);
}

// --------------------------------------------------
// UPDATE PRINCIPAL
// --------------------------------------------------
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

// --------------------------------------------------
// IA SIMPLE
// --------------------------------------------------
function updateMobAI(mob, player, dt) {
    const dx = player.x - mob.x;
    const dy = player.y - mob.y;
    const dist = Math.hypot(dx, dy);

    const AGGRO_RANGE = 350;
    const ATTACK_RANGE = mob.size + 20;

    // Agro
    if (dist < AGGRO_RANGE) {
        mob.target = player;
    }

    if (!mob.target) return;

    // Déplacement vers le joueur
    if (dist > ATTACK_RANGE) {
        const angle = Math.atan2(dy, dx);
        mob.x += Math.cos(angle) * mob.speed * dt * 0.1;
        mob.y += Math.sin(angle) * mob.speed * dt * 0.1;
    } else {
        tryAttack(mob, player);
    }
}

// --------------------------------------------------
// ATTAQUE (cooldown d'origine : 1000ms)
// --------------------------------------------------
function tryAttack(mob, player) {
    const now = performance.now();

    if (!mob.lastAttack) mob.lastAttack = 0;

    const ATTACK_COOLDOWN = 1000; // Valeur d'origine

    if (now - mob.lastAttack < ATTACK_COOLDOWN) return;

    mob.lastAttack = now;

    damagePlayer(player, {
        base: mob.damage,
        type: "physical"
    });
}

// --------------------------------------------------
// COLLISION ENTRE MOBS
// --------------------------------------------------
function resolveMobCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            const a = enemies[i];
            const b = enemies[j];

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy);
            const minDist = a.size + b.size;

            if (dist < minDist && dist > 0) {
                const overlap = minDist - dist;
                const pushX = (dx / dist) * (overlap / 2);
                const pushY = (dy / dist) * (overlap / 2);

                a.x -= pushX;
                a.y -= pushY;
                b.x += pushX;
                b.y += pushY;
            }
        }
    }
}

// --------------------------------------------------
// COLLISION MOB → JOUEUR
// --------------------------------------------------
function resolvePlayerCollision(player) {
    for (let mob of enemies) {
        const dx = mob.x - player.x;
        const dy = mob.y - player.y;
        const dist = Math.hypot(dx, dy);
        const minDist = mob.size + player.size;

        if (dist < minDist && dist > 0) {
            const overlap = minDist - dist;
            const pushX = (dx / dist) * overlap;
            const pushY = (dy / dist) * overlap;

            mob.x += pushX;
            mob.y += pushY;
        }
    }
}

// --------------------------------------------------
// DESSIN
// --------------------------------------------------
export function drawEnemies(ctx) {
    for (let mob of enemies) {
        ctx.fillStyle = "#55aa55";
        ctx.beginPath();
        ctx.arc(mob.x, mob.y, mob.size, 0, Math.PI * 2);
        ctx.fill();

        // Barre de vie
        ctx.fillStyle = "red";
        ctx.fillRect(mob.x - mob.size, mob.y - mob.size - 10, mob.size * 2, 5);

        ctx.fillStyle = "lime";
        const hpRatio = mob.hp / mob.maxHp;
        ctx.fillRect(mob.x - mob.size, mob.y - mob.size - 10, mob.size * 2 * hpRatio, 5);
    }
}
