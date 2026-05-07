/*
   ROUTE : Jeux/Sanctuaire/js/systems/player/playerStatsSystem.js

   RÔLE :
     Fusionner TOUTES les sources de stats du joueur pour produire
     player.stats final, utilisé par :
       - damageSystem (offense + defense)
       - regenSystem (HP / Shield)
       - movementSystem (moveSpeed)
       - skillSystem (spirit / energy)
       - UI (fiche de stats)

   SOURCES DE STATS :
     - basePlayer.stats (stats de départ du personnage)
     - arme (weapon.stats + affixes)
     - armure (armor.stats + affixes)
     - trinkets (stats + affixes)
     - buffs temporaires
     - talents permanents
     - gemmes (stats uniquement)
     - affixes (tous les items)

   PRINCIPES :
     - Stats.js = registre unique (source de vérité)
     - additive → stats[id] += value
     - multiplicative → stats[id] *= (1 + value)
     - Aucune stat fantôme : si une stat n’existe pas dans Stats.js, elle est ignorée
*/

import { Stats } from "../../data/stats.js";
import { basePlayer } from "../../data/playerBase.js";

export function buildPlayerStats(player) {

    // 1) Base : clone propre des stats du joueur
    const stats = structuredClone(basePlayer.stats);

    // 2) Armure
    if (player.equipment?.armor) {
        applySource(stats, player.equipment.armor);
    }

    // 3) Arme
    if (player.equipment?.weapon) {
        applySource(stats, player.equipment.weapon);
    }

    // 4) Trinkets
    if (player.trinkets) {
        for (const t of player.trinkets) {
            applySource(stats, t);
        }
    }

    // 5) Buffs temporaires
    applyList(stats, player.buffs);

    // 6) Talents permanents
    applyList(stats, player.talents);

    // 7) Gemmes (stats uniquement)
    if (player.gems) {
        for (const g of player.gems) {
            applySource(stats, g);
        }
    }

    return stats;
}

/*
   applySource :
     - lit source.stats (ou source directement si déjà plat)
     - applique additive / multiplicative selon Stats.js
     - applique aussi les affixes (source.affixes)
*/
function applySource(stats, source) {
    if (!source) return;

    const pool = source.stats || source;
    if (!pool) return;

    // Stats principales
    for (const id in Stats) {
        if (pool[id] !== undefined) {
            const def = Stats[id];
            const value = pool[id];

            if (def.type === "additive") {
                stats[id] += value;
            }
            else if (def.type === "multiplicative") {
                stats[id] *= (1 + value);
            }
        }
    }

    // Affixes secondaires
    if (source.affixes) {
        for (const id in source.affixes) {
            if (!Stats[id]) continue;

            const def = Stats[id];
            const value = source.affixes[id];

            if (def.type === "additive") {
                stats[id] += value;
            }
            else if (def.type === "multiplicative") {
                stats[id] *= (1 + value);
            }
        }
    }
}

/*
   applyList :
     - applique une liste d’objets (buffs, talents)
     - chaque item est traité comme une source
*/
function applyList(stats, list) {
    if (!list) return;

    if (Array.isArray(list)) {
        for (const item of list) applySource(stats, item);
        return;
    }

    if (typeof list === "object") {
        for (const key in list) {
            applySource(stats, list[key]);
        }
    }
}

