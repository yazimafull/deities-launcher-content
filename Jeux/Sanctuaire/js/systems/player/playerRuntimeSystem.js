/*
   ROUTE : playerRuntimeSystem.js
   RÔLE :
     - Copier player.stats → player.runtime
     - Appliquer HP / Shield runtime
     - Définir l’élément de l’arme
     - Régénération HP / Shield
     - AUCUNE logique de dégâts
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
    // TYPE ÉLÉMENTAIRE DE L’ARME
    // ============================
    const w = player.equipment?.weapon;

    if (w && w.element) {
        r.element = w.element;
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
