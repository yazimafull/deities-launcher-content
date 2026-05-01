// === ROUTE : /systems/item/canCombine.js
// === RÔLE : Vérifie si deux items peuvent être combinés.
// === EXPORTS : canCombine
// === DÉPENDANCES : aucune logique spécifique, juste les données des items.
// === NOTES :
// - Fonction générique : valable pour armes, armures, talismans, trinkets, pierres, etc.
// - Les règles spécifiques (ex : double bouclier interdit) seront définies
//   dans les données de chaque item (ex : itemData[type].forbiddenCombos).
// - Cette fonction lit simplement les propriétés des items pour décider.

// Exemple d’itemData attendu :
// itemA = { id: "wand", type: "weapon", category: "rightOnly", forbiddenCombos: ["wand"] }
// itemB = { id: "shield", type: "weapon", category: "leftOnly", forbiddenCombos: ["shield"] }

export function canCombine(itemA, itemB) {

    // Si un des deux items est manquant → impossible
    if (!itemA || !itemB) return false;

    // Si les deux items sont identiques et que l’item interdit le doublon
    if (itemA.id === itemB.id) {
        if (itemA.forbiddenCombos && itemA.forbiddenCombos.includes(itemA.id)) {
            return false;
        }
    }

    // Si itemA interdit itemB
    if (itemA.forbiddenCombos && itemA.forbiddenCombos.includes(itemB.id)) {
        return false;
    }

    // Si itemB interdit itemA
    if (itemB.forbiddenCombos && itemB.forbiddenCombos.includes(itemA.id)) {
        return false;
    }

    // Si un item est twoHanded → impossible de combiner
    if (itemA.category === "twoHanded" || itemB.category === "twoHanded") {
        return false;
    }

    // Si un item est "uniqueSlot" (ex : amulette) → impossible de combiner
    if (itemA.uniqueSlot || itemB.uniqueSlot) {
        return false;
    }

    // Tout le reste est autorisé
    return true;
}
