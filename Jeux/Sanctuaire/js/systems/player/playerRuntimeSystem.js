/*
   ROUTE : Jeux/Sanctuaire/js/systems/player/playerRuntimeSystem.js

   RÔLE :
     Convertit les stats finales + l’arme équipée en valeurs runtime utilisables
     par le moteur (combat, projectiles, vitesse, survie…).
     Ne contient aucune logique gameplay : uniquement de la transformation.
*/

// ================================
// APPLY RUNTIME STATS
// ================================
export function applyPlayerRuntimeStats(player) {

    const s = player.stats;
    if (!s) return;

    // ============================
    // SURVIE
    // ============================
    player.maxHp = s.maxHp;
    player.hpRegen = s.regenHp;

    if (player.hp > player.maxHp) {
        player.hp = player.maxHp;
    }

    // ============================
    // SHIELD
    // ============================
    player.maxShield = s.maxShield;
    player.shieldRegen = s.regenShield;

    if (player.shield > player.maxShield) {
        player.shield = player.maxShield;
    }

    // ============================
    // MOVEMENT (runtime uniquement)
    // ============================
    player.runtime = player.runtime || {};
    player.runtime.speed = 240 * (s.moveSpeed || 1);

    // ============================
    // OFFENSE (stats de base)
    // ============================
    player.runtime.attackDamage = s.attackDamage;
    player.runtime.attackSpeed = s.attackSpeed;
    player.runtime.attackRange = s.attackRange;

    player.runtime.projectileSpeed = s.projectileSpeed;
    player.runtime.projectileRange = s.projectileRange;
    player.runtime.projectileCount = s.projectileCount;

    player.runtime.critChance = s.critChance;
    player.runtime.critMultiplier = s.critMultiplier;

    // ============================
    // ARME ÉQUIPÉE (debug ou réelle)
    // ============================
    const w = player.weapon;

    if (w) {
        // L’arme écrase ou modifie les valeurs runtime
        player.runtime.attackRange = w.attackRange ?? player.runtime.attackRange;
        player.runtime.attackSpeed = w.attackSpeed ?? player.runtime.attackSpeed;
        
        player.runtime.projectileSpeed = w.projectileSpeed ?? player.runtime.projectileSpeed;
        player.runtime.projectileCount = w.projectileCount ?? player.runtime.projectileCount;

        player.runtime.attackDamage = w.damage ?? player.runtime.attackDamage;

        player.runtime.element = w.element ?? "physical";
    } else {
        // Pas d’arme → pas de projectiles
        player.runtime.projectileCount = 0;
    }
}
