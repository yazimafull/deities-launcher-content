// collisionSystem.js
import { bullets } from "./bullet.js";
import { enemies } from "./enemy.js";
import { player } from "./player.js";

import { applyDamage } from "./damageSystem.js";
import { spawnDamageNumber } from "./damageNumbers.js";
import { updateHealthBar } from "./healthbar.js";

// --------------------------------------------------
// UPDATE DES COLLISIONS
// --------------------------------------------------
export function updateCollisions() {
    handleBulletEnemyCollisions();
    handleEnemyPlayerCollisions();
}

// --------------------------------------------------
// COLLISION : BALLE → ENNEMI
// --------------------------------------------------
function handleBulletEnemyCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        let bulletRemoved = false;

        for (let j = enemies.length - 1; j >= 0; j--) {
            const e = enemies[j];

            const dx = e.x - b.x;
            const dy = e.y - b.y;
            const dist = Math.hypot(dx, dy);

            if (dist < (e.size / 2 + b.size / 2)) {

                // Dégâts : le joueur attaque l'ennemi
                let result = applyDamage(player, e, b.damage, b.element);
                spawnDamageNumber(e.x, e.y, result.dmgTaken, result.reason);

                // ✅ La mort de l'ennemi + spawnXP est gérée dans updateEnemies

                // Si pas piercing → supprimer la balle
                if (!b.piercing) {
                    bullets.splice(i, 1);
                    bulletRemoved = true;
                    break;
                }
            }
        }

        if (bulletRemoved) continue;
    }
}

// --------------------------------------------------
// COLLISION : ENNEMI → JOUEUR
// --------------------------------------------------
function handleEnemyPlayerCollisions() {
    for (let e of enemies) {

        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const dist = Math.hypot(dx, dy);

        if (dist < (player.size / 2 + e.size / 2)) {

            // Dégâts : l'ennemi attaque le joueur
            applyDamage(e, player, e.damage, e.damageType || "physical");

            // ✅ Mettre à jour la barre de vie après chaque coup
            updateHealthBar();
        }
    }
}