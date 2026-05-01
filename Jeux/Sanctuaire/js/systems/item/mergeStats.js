// === ROUTE : /systems/item/mergeStats.js
// === RÔLE : Fusionne les stats de deux items selon les règles du jeu.
// === EXPORTS : mergeStats
// === DÉPENDANCES : stats.js (source de vérité des stats)
// === NOTES :
// - Fonction générique : valable pour armes, armures, talismans, trinkets, pierres, etc.
// - Ne crée JAMAIS de stat qui n’existe pas dans stats.js
// - Ne fusionne que les stats autorisées par allowedStats dans les blueprints
// - Additionne les valeurs numériques
// - Ignore les stats interdites ou absentes

import { Stats } from "../../data/stats.js";

export function mergeStats(itemA, itemB) {

    const finalStats = {};

    // On parcourt TOUTES les stats définies dans stats.js (source de vérité)
    for (const statId in Stats) {

        const aAllowed = itemA.allowedStats?.[statId] === true;
        const bAllowed = itemB.allowedStats?.[statId] === true;

        // Si la stat n'est autorisée par A ni par B → on skip
        if (!aAllowed && !bAllowed) continue;

        const aValue = itemA.stats?.[statId] || 0;
        const bValue = itemB.stats?.[statId] || 0;

        // Fusion = addition simple
        const mergedValue = aValue + bValue;

        // Si la stat existe et a une valeur non nulle → on l'ajoute
        if (mergedValue !== 0) {
            finalStats[statId] = mergedValue;
        }
    }

    return finalStats;
}
