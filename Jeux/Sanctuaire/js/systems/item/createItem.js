// === ROUTE : /systems/item/createItem.js
// === RÔLE : Crée un item final à partir de deux items (ou un seul).
// === EXPORTS : createItem
// === DÉPENDANCES : canCombine, getFinalProfile, mergeStats
// === NOTES :
// - Fonction générique : valable pour armes, armures, talismans, trinkets, runes, pierres, etc.
// - Ne modifie JAMAIS les items d’origine.
// - Renvoie un NOUVEL objet propre, prêt à être équipé ou looté.

import { canCombine } from "./canCombine.js";
import { getFinalProfile } from "./getFinalProfile.js";
import { mergeStats } from "./mergeStats.js";

export function createItem(itemA, itemB = null) {

    // --- 1) Si un seul item → on renvoie un clone propre ---
    if (!itemB) {
        return {
            ...itemA,
            stats: { ...itemA.stats },
            components: [itemA.id],
            profile: getFinalProfile(itemA)
        };
    }

    // --- 2) Vérification de la combinaison ---
    if (!canCombine(itemA, itemB)) {
        console.warn("Combinaison interdite :", itemA.id, itemB.id);
        return null;
    }

    // --- 3) Déterminer le profil final ---
    const finalProfile = getFinalProfile(itemA, itemB);

    // --- 4) Fusionner les stats ---
    const finalStats = mergeStats(itemA, itemB);

    // --- 5) Générer un ID unique pour l’item final ---
    const finalId = `${itemA.id}_${itemB.id}_${finalProfile}`;

    // --- 6) Créer l’objet final ---
    const finalItem = {
        id: finalId,
        type: itemA.type, // même type (weapon, armor, talisman…)
        profile: finalProfile,
        stats: finalStats,
        components: [itemA.id, itemB.id],
        rarity: Math.max(itemA.rarity || 1, itemB.rarity || 1), // optionnel
    };

    return finalItem;
}
