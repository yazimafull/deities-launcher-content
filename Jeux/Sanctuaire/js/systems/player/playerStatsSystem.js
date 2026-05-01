/*
   ROUTE : Jeux/Sanctuaire/js/systems/player/playerStatsSystem.js

   RÔLE :
     Calcul pur des statistiques finales du joueur.
     Combine : basePlayer + weapon + affixes + talents + buffs.
     Gère aussi la régénération HP / Shield (stat-based).

   PRINCIPES :
     - buildPlayerStats = fonction pure (aucun effet de bord)
     - updateHP / updateShield = logique runtime simple (pas de gameplay)
     - Ne modifie jamais les stats de base, seulement player.hp / shield
     - Additive / multiplicative gérées ici uniquement
*/

import { Stats } from "../../data/stats.js";
import { basePlayer } from "../../data/playerBase.js";

// ================================
// BUILD FINAL PLAYER STATS
// ================================
export function buildPlayerStats(player) {

    const stats = createBaseStats();

    if (player.weapon) {
        applyWeapon(stats, player.weapon);
    }

    applyList(stats, player.affixes);
    applyList(stats, player.talents);
    applyList(stats, player.buffs);

    return stats;
}

// ================================
// HP / SHIELD RUNTIME UPDATE
// ================================
export function updateHP(player, dt) {
    if (!player.stats) return;

    const regen = player.stats.regenHp ?? 0;
    if (regen > 0) {
        player.hp += regen * (dt / 1000);
        if (player.hp > player.stats.maxHp) {
            player.hp = player.stats.maxHp;
        }
    }
}

export function updateShield(player, dt) {
    if (!player.stats) return;

    const regen = player.stats.regenShield ?? 0;
    if (regen > 0) {
        player.shield += regen * (dt / 1000);
        if (player.shield > player.stats.maxShield) {
            player.shield = player.stats.maxShield;
        }
    }
}

// ================================
// INTERNAL HELPERS
// ================================
function createBaseStats() {

    const s = {};

    // Initialise toutes les stats à 0
    for (const id in Stats) {
        s[id] = 0;
    }

    // Applique les stats de base du joueur
    for (const id in basePlayer) {
        if (s[id] !== undefined) {
            s[id] = basePlayer[id];
        }
    }

    return s;
}

function applyList(stats, list) {

    if (!list) return;

    for (const item of list) {

        const def = Stats[item.id];
        if (!def) continue;

        if (def.type === "additive") {
            stats[item.id] += item.value;
        }

        if (def.type === "multiplicative") {
            stats[item.id] *= (1 + item.value);
        }
    }
}

function applyWeapon(stats, w) {

    const mapping = {
        attackDamage: "baseDamage",
        attackSpeed: "attackSpeed",
        attackRange: "attackRange",
        projectileSpeed: "projectileSpeed",
        projectileRange: "projectileRange",
        projectileCount: "projectileCount",
        critChance: "critChance",
        critMultiplier: "critMultiplier"
    };

    for (const statId in mapping) {
        const weaponKey = mapping[statId];
        if (w[weaponKey] !== undefined) {
            stats[statId] += w[weaponKey];
        }
    }
}
