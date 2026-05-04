/*
   ROUTE : Jeux/Sanctuaire/js/systems/player/playerStatsSystem.js

   RÔLE :
     Fusionner TOUTES les sources de stats :
       - arme
       - armure
       - trinkets
       - buffs
       - talents
       - gemmes
     pour produire les stats finales du joueur.

   PRINCIPES :
     - Le joueur n’a PAS de stats de base (âme = coquille vide)
     - Toutes les stats viennent de l’équipement + talents + buffs + gemmes
     - Stats.js = registre unique (source de vérité)
*/

import { Stats } from "../../data/stats.js";
import { basePlayer } from "../../data/playerBase.js";

export function buildPlayerStats(player) {

    // 1) On part des stats de base du joueur (basePlayer.stats)
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

    // 7) Gemmes
    if (player.gems) {
        for (const g of player.gems) {
            applySource(stats, g);
        }
    }

    return stats;
}

function applySource(stats, source) {
    if (!source) return;

    const pool = source.stats || source;
    if (!pool) return;

    for (const id in Stats) {
        if (pool[id] !== undefined) {
            const def = Stats[id];
            const value = pool[id];

            if (def.type === "additive") stats[id] += value;
            else if (def.type === "multiplicative") stats[id] *= (1 + value);
        }
    }

    if (source.affixes) {
        for (const id in source.affixes) {
            if (!Stats[id]) continue;

            const def = Stats[id];
            const value = source.affixes[id];

            if (def.type === "additive") stats[id] += value;
            else if (def.type === "multiplicative") stats[id] *= (1 + value);
        }
    }
}

function applyList(stats, list) {
    if (!list) return;
    for (const item of list) applySource(stats, item);
}

