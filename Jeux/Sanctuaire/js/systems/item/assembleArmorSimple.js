/*
   ROUTE : /systems/item/assembleArmorSimple.js
   RÔLE : Fusionner plusieurs pièces d’armure en une armure craftée simple.
   EXPORTS : assembleArmorSimple
   DÉPENDANCES : Aucune directe (reçoit des pièces déjà formatées).
   NOTES :
     - Stats et affixes fusionnés sous forme d’objets (cohérent avec tout le jeu).
     - Produit un item final compatible pylône / inventaire / tooltip.
     - Tier = max des pièces, qualité = bottleneck.
     - Le slot final est "armor" (armure complète).
*/

export function assembleArmorSimple(pieces) {

    // === 1) Structure de l’armure finale ===
    const finalArmor = {
        id: "crafted_armor_" + crypto.randomUUID(),
        type: "armor",              // ✔ type global
        slot: "armor",              // ✔ armure complète (pas helmet/chest/etc.)
        armorType: "crafted",       // ✔ utile plus tard pour les profils
        name: "Armure assemblée",
        icon: "icons/armor_crafted.png",

        stats: {},                  // ✔ fusion des stats
        affixes: {},                // ✔ fusion des affixes

        tier: 1,                    // ✔ max des pièces
        quality: "white",           // ✔ bottleneck
        source: "forge"
    };

    // === 2) Fusion des pièces ===
    for (const piece of pieces) {
        if (!piece) continue;

        /* -----------------------------
           FUSION DES STATS
        ------------------------------ */
        if (piece.stats) {
            for (const stat in piece.stats) {
                finalArmor.stats[stat] =
                    (finalArmor.stats[stat] || 0) + piece.stats[stat];
            }
        }

        /* -----------------------------
           FUSION DES AFFIXES
        ------------------------------ */
        if (piece.affixes) {
            for (const affix in piece.affixes) {
                finalArmor.affixes[affix] =
                    (finalArmor.affixes[affix] || 0) + piece.affixes[affix];
            }
        }

        /* -----------------------------
           TIER = MAX
        ------------------------------ */
        if (piece.tier) {
            finalArmor.tier = Math.max(finalArmor.tier, piece.tier);
        }

        /* -----------------------------
           QUALITÉ = BOTTLENECK
           (white < blue < yellow < purple < orange)
        ------------------------------ */
        if (piece.quality) {
            const order = ["white", "blue", "yellow", "purple", "orange"];
            if (order.indexOf(piece.quality) < order.indexOf(finalArmor.quality)) {
                finalArmor.quality = piece.quality;
            }
        }
    }
    console.log("DEBUG ARMURE FINALE :", JSON.stringify(finalArmor, null, 2));
    // === 3) Retour de l’armure finale ===
    return finalArmor;
}
