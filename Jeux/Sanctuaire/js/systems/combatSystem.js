/*
   ROUTE : systems/combatSystem.js
   RÔLE : Gestion unifiée du combat (joueur + mobs)
   NOTES :
     - Utilise EXCLUSIVEMENT player.runtime (jamais player.* brut)
     - Compatible avec playerRuntimeSystem + debugSystem
*/

import { spawnProjectile } from "./projectileSystem.js";
import { damageEnemy, damagePlayer } from "./damageSystem.js";

// ================================
// UPDATE COMBAT JOUEUR
// ================================
export function updatePlayerCombat(player, enemies, cursor, dt) {

    if (!player.weapon || player.dead) return;

    const r = player.runtime;
    if (!r) return;

    // cooldown en ms (stocké sur player, mais basé sur runtime)
    player.attackCooldown = Math.max(0, (player.attackCooldown ?? 0) - dt);
    if (player.attackCooldown > 0) return;

    // ================================
    // MELEE
    // ================================
    if (player.weapon.type === "melee") {

        const target = findNearestEnemyForMelee(player, enemies, r.attackRange);
        if (!target) return;

        performMeleeAttack(player, target, r);
        player.attackCooldown = r.attackSpeed;
        return;
    }

    // ================================
    // RANGED AUTO
    // ================================
    if (player.weapon.type === "ranged") {

        const target = findNearestEnemyInRange(player, enemies, r.attackRange);
        if (!target) return;

        performRangedAttack(player, { x: target.x, y: target.y }, r);

        player.attackCooldown = r.attackSpeed;
        return;
    }
}

// ================================
// UPDATE COMBAT MOBS
// ================================
export function updateMobCombat(mob, player, dt) {

    if (mob.dead || player.dead) return;

    const r = mob.runtime ?? mob; // fallback sécurisé
    mob.attackCooldown = Math.max(0, (mob.attackCooldown ?? 0) - dt);
    if (mob.attackCooldown > 0) return;

    const dx = player.x - mob.x;
    const dy = player.y - mob.y;
    const dist = Math.hypot(dx, dy);

    // ================================
    // MELEE
    // ================================
    if (mob.weapon?.type === "melee" || !mob.weapon) {

        const meleeReach =
            (mob.size / 2 + player.size / 2) +
            (mob.weapon?.meleeRange ?? 0);

        if (dist <= meleeReach) {
            performMeleeAttack(mob, player, r);
            mob.attackCooldown = r.attackSpeed ?? mob.attackSpeed;
        }

        return;
    }

    // ================================
    // RANGED
    // ================================
    if (mob.weapon?.type === "ranged") {

        const reach =
            (mob.size / 2 + player.size / 2) +
            (r.attackRange ?? mob.attackRange);

        if (dist <= reach) {
            performRangedAttack(mob, { x: player.x, y: player.y }, r);
            mob.attackCooldown = r.attackSpeed ?? mob.attackSpeed;
        }

        return;
    }
}

// ================================
// ENNEMI LE PLUS PROCHE DANS LA RANGE
// ================================
function findNearestEnemyInRange(attacker, enemies, range) {

    let best = null;
    let bestDist = Infinity;

    for (const e of enemies) {
        if (e.dead) continue;

        const dx = e.x - attacker.x;
        const dy = e.y - attacker.y;
        const dist = Math.hypot(dx, dy);

        const reach = (attacker.size / 2 + e.size / 2) + range;

        if (dist <= reach && dist < bestDist) {
            bestDist = dist;
            best = e;
        }
    }

    return best;
}

// ================================
// MELEE
// ================================
function findNearestEnemyForMelee(attacker, enemies, range) {

    let best = null;
    let bestDist = Infinity;

    for (const e of enemies) {
        if (e.dead) continue;

        const dx = e.x - attacker.x;
        const dy = e.y - attacker.y;
        const dist = Math.hypot(dx, dy);

        const meleeReach = (attacker.size / 2 + e.size / 2) + range;

        if (dist <= meleeReach && dist < bestDist) {
            bestDist = dist;
            best = e;
        }
    }

    return best;
}

// ================================
// ATTAQUE MELEE
// ================================
function performMeleeAttack(attacker, target, r) {

    const dmg = r.attackDamage;

    if (target.isMob) {
        damageEnemy(target, { base: dmg, type: r.element });
    } else {
        damagePlayer(target, { base: dmg, type: r.element });
    }
}

// ================================
// ATTAQUE RANGED
// ================================
function performRangedAttack(attacker, cursor, r) {
    if (!cursor) return;
    shootProjectileSpread(attacker, cursor, r);
}

// ================================
// MULTI-PROJECTILES + SPREAD
// ================================
function shootProjectileSpread(attacker, cursor, r) {

    const count = r.projectileCount ?? 1;
    const spread = attacker.weapon.spreadAngle ?? 0;

    const dx = cursor.x - attacker.x;
    const dy = cursor.y - attacker.y;
    const baseAngle = Math.atan2(dy, dx);

    for (let i = 0; i < count; i++) {

        const offset = (i - (count - 1) / 2) *
            (spread * Math.PI / 180) /
            (count - 1 || 1);

        const angle = baseAngle + offset;

        const vx = Math.cos(angle);
        const vy = Math.sin(angle);

        spawnProjectile({
            x: attacker.x,
            y: attacker.y,
            vx,
            vy,
            speed: r.projectileSpeed,
            range: r.projectileRange,
            damage: r.attackDamage,
            piercing: attacker.weapon.piercing,
            homing: attacker.weapon.homing,
            owner: attacker
        });
    }
}
