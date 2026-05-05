/*
   ROUTE : Jeux/Sanctuaire/js/systems/player/playerRuntimeSystem.js

   RÔLE :
     Convertir les stats finales (player.stats) en valeurs runtime prêtes pour le moteur :
       - HP / Shield runtime (max, regen, clamp)
       - Copie 1:1 de toutes les stats dans player.runtime
       - Définition de l’élément d’arme (physical par défaut)
       - Régénération HP / Shield frame-by-frame

   PRINCIPES :
     - AUCUNE logique de dégâts ici
     - AUCUNE modification des stats finales
     - Runtime = valeurs prêtes à l’usage immédiat par le moteur
     - player.stats = source de vérité (calculé par playerStatsSystem)
*/

export function applyPlayerRuntimeStats(player) {

    const s = player.stats;
    if (!s) return;

    // ============================
    // HP / SHIELD RUNTIME
    // ============================
    player.maxHp = s.maxHp ?? 0;
    player.hpRegen = s.regenHp ?? 0;

    player.maxShield = s.maxShield ?? 0;
    player.shieldRegen = s.regenShield ?? 0;

    // Clamp HP / Shield
    if (player.hp > player.maxHp) player.hp = player.maxHp;
    if (player.shield > player.maxShield) player.shield = player.maxShield;

    // ============================
    // RUNTIME = COPIE 1:1 DES STATS
    // ============================
    const r = player.runtime = {};

    for (const id in s) {
        r[id] = s[id];
    }

    // ============================
    // TYPE ÉLÉMENTAIRE DE L’ARME / JOUEUR
    // ============================
    const w = player.equipment?.weapon;

    // priorité : arme → élément actif → physical
    if (w && w.element) {
        r.element = w.element;
    } else if (player.activeElement) {
        r.element = player.activeElement;
    } else {
        r.element = "physical";
    }


}

// ================================
// HP REGEN
// ================================
export function updateHP(player, dt) {

    const regen = player.stats?.regenHp ?? 0;
    if (regen <= 0) return;

    player.hp += regen * (dt / 1000);

    if (player.hp > player.stats.maxHp) {
        player.hp = player.stats.maxHp;
    }
}



// ================================
// SHIELD REGEN
// ================================
export function updateShield(player, dt) {

    const regen = player.stats?.regenShield ?? 0;
    if (regen <= 0) return;

    player.shield = player.shield ?? 0;
    player.shield += regen * (dt / 1000);

    if (player.shield > player.stats.maxShield) {
        player.shield = player.stats.maxShield;
    }
}
