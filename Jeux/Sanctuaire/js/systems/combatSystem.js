/*
   ROUTE : systems/combatSystem.js
   RÔLE : Gestion unifiée du combat (joueur + mobs)
   NOTES :
     - Utilise EXCLUSIVEMENT player.runtime (jamais player.* brut)
     - computeOffense() = dégâts du joueur/mob
     - damageEnemy() / damagePlayer() = application + computeDefense()
*/

import { spawnProjectile } from "./projectileSystem.js";
import { computeOffense, damageEnemy, damagePlayer } from "./damageSystem.js";

// =====================================================
// COOLDOWN CALCULÉ À PARTIR DES STATS
// =====================================================
function computeAttackCooldown(r) {

    // Cooldown brut en millisecondes
    const baseCd = (r.attackCooldownMs ?? 600);

    // Sécurité anti-mitraillette
    if (baseCd <= 0) return 0.6; // 600ms par défaut

    // Bonus de cadence
    const flat = r.attackSpeed ?? 0;
    const mult = r.attackSpeedMultiplier ?? 0;

    // Cooldown final en millisecondes
    const finalMs = baseCd / (1 + flat + mult);

    // CombatSystem travaille en SECONDES
    return finalMs;
}



// =====================================================
// UPDATE COMBAT JOUEUR
// =====================================================
export function updatePlayerCombat(player, enemies, cursor, dt) {

    if (!player.weapon || player.dead) return;

    const r = player.runtime;
    if (!r) return;
    //console.log("PLAYER RUNTIME:", r);

    // 🔥 Init du cooldown si jamais il n'a pas encore été posé
    if (player.attackCooldown == null) {
        player.attackCooldown = computeAttackCooldown(r);
    }

    // décrément
    player.attackCooldown = Math.max(0, player.attackCooldown - dt);
    if (player.attackCooldown > 0) return;

    const cooldown = computeAttackCooldown(r);

    // MELEE
    if (player.weapon.type === "melee") {

        const range = r.attackRange ?? 0;
        const target = findNearestEnemyForMelee(player, enemies, range);
        if (!target) return;

        performMeleeAttack(player, target);
        player.attackCooldown = cooldown;
        return;
    }

    // RANGED AUTO
    if (player.weapon.type === "ranged") {

        const range = r.attackRange ?? 0;
        const target = findNearestEnemyInRange(player, enemies, range);
        if (!target) return;

        performRangedAttack(player, { x: target.x, y: target.y });
        player.attackCooldown = cooldown;
        return;
    }
}


// =====================================================
// UPDATE COMBAT MOBS
// =====================================================
export function updateMobCombat(mob, player, dt) {

    if (mob.dead || player.dead) return;

    const r = mob.runtime ?? mob;

    mob.attackCooldown = Math.max(0, (mob.attackCooldown ?? 0) - dt);
    if (mob.attackCooldown > 0) return;

    const dx = player.x - mob.x;
    const dy = player.y - mob.y;
    const dist = Math.hypot(dx, dy);

    const cooldown = computeAttackCooldown(r);

    // MELEE
    if (mob.weapon?.type === "melee" || !mob.weapon) {

        const meleeReach =
            (mob.size / 2 + player.size / 2) +
            (mob.weapon?.meleeRange ?? 0);

        if (dist <= meleeReach) {
            performMeleeAttack(mob, player);
            mob.attackCooldown = cooldown;
        }

        return;
    }

    // RANGED
    if (mob.weapon?.type === "ranged") {

        const reach =
            (mob.size / 2 + player.size / 2) +
            (r.attackRange ?? mob.attackRange ?? 0);

        if (dist <= reach) {
            performRangedAttack(mob, { x: player.x, y: player.y });
            mob.attackCooldown = cooldown;
        }

        return;
    }
}

// =====================================================
// ENNEMI LE PLUS PROCHE DANS LA RANGE
// =====================================================
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

// =====================================================
// MELEE
// =====================================================
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

// =====================================================
// ATTAQUE MELEE
// =====================================================
function performMeleeAttack(attacker, target) {

    const r = attacker.runtime ?? attacker;

    const dmgPacket = computeOffense(r);

    // AJOUT MANQUANT : type élémentaire
    dmgPacket.type = r.element ?? "physical";

    if (target.isMob) {
        damageEnemy(target, dmgPacket);
    } else {
        damagePlayer(target, dmgPacket);
    }
}

// =====================================================
// ATTAQUE RANGED
// =====================================================
function performRangedAttack(attacker, cursor) {
    if (!cursor) return;
    shootProjectileSpread(attacker, cursor);
}

// =====================================================
// MULTI-PROJECTILES + SPREAD
// =====================================================
function shootProjectileSpread(attacker, cursor) {

    const r = attacker.runtime;
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
            speed: r.projectileSpeed ?? 300,
            range: r.projectileRange ?? 300,
            owner: attacker
        });
    }
}
