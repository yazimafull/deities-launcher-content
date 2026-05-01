// === ROUTE : /systems/item/assembleArmor.js
// === RÔLE : Fusionner toutes les pièces d’armure en une armure finale utilisable en biome.
// === NOTES :
// - Combine les stats de base des pièces.
// - Applique les gemmes (multiplicateurs).
// - Combine les affixes.
// - Applique les talismans (amplification d’affixes).
// - Applique le profil d’armure (heavy/light/enchanted).
// - Retourne un objet "finalArmor" prêt pour le biome.

import { ArmorProfiles } from "./profiles/armorProfiles.js";
import { GemProfiles } from "./profiles/gemProfiles.js";

export const assembleArmor = (pieces, talismans = []) => {

    // === 1) Structure de l’armure finale ===
    const finalArmor = {
        baseStats: {},
        affixes: {},
        profile: null,
        tier: 1,
        quality: "white",
    };

    // === 2) Fusion des pièces ===
    for (const piece of pieces) {
        if (!piece) continue;

        // Fusion des stats de base
        for (const stat in piece.baseStats) {
            finalArmor.baseStats[stat] = 
                (finalArmor.baseStats[stat] || 0) + piece.baseStats[stat];
        }

        // Fusion des affixes
        for (const affix in piece.affixes) {
            finalArmor.affixes[affix] = 
                (finalArmor.affixes[affix] || 0) + piece.affixes[affix];
        }

        // Déterminer le profil d’armure (toutes les pièces doivent matcher)
        if (!finalArmor.profile) {
            finalArmor.profile = piece.profile;
        }

        // Tier = max des tiers des pièces
        finalArmor.tier = Math.max(finalArmor.tier, piece.tier);

        // Qualité = la plus basse (bottleneck)
        // (optionnel, tu peux changer la règle)
        if (piece.quality === "white") finalArmor.quality = "white";
        else if (piece.quality === "blue" && finalArmor.quality !== "white") finalArmor.quality = "blue";
        else if (piece.quality === "yellow" && !["white","blue"].includes(finalArmor.quality)) finalArmor.quality = "yellow";
        else if (piece.quality === "purple" && !["white","blue","yellow"].includes(finalArmor.quality)) finalArmor.quality = "purple";
        else if (piece.quality === "orange") finalArmor.quality = "orange";

        // === 3) Appliquer les gemmes de la pièce ===
        if (piece.gems) {
            for (const gem of piece.gems) {
                const gemProfile = GemProfiles[gem.id];
                if (!gemProfile) continue;

                // Gemme simple (1 stat)
                if (gemProfile.stat) {
                    const stat = gemProfile.stat;
                    const mult = gemProfile.multiplier / 100;
                    finalArmor.baseStats[stat] = 
                        (finalArmor.baseStats[stat] || 0) * (1 + mult);
                }

                // Gemme hybride (2 stats)
                if (gemProfile.stats) {
                    for (const stat of gemProfile.stats) {
                        const mult = gemProfile.multiplier / 100;
                        finalArmor.baseStats[stat] = 
                            (finalArmor.baseStats[stat] || 0) * (1 + mult);
                    }
                }
            }
        }
    }

    // === 4) Appliquer les talismans (amplification d’affixes) ===
    for (const talisman of talismans) {
        if (!talisman.affixMultiplier) continue;

        const mult = talisman.affixMultiplier / 100;

        for (const affix in finalArmor.affixes) {
            finalArmor.affixes[affix] *= (1 + mult);
        }
    }

    // === 5) Appliquer le profil d’armure (heavy/light/enchanted) ===
    if (finalArmor.profile && ArmorProfiles[finalArmor.profile]) {
        const profile = ArmorProfiles[finalArmor.profile];

        // Appliquer les modificateurs du profil
        for (const stat in profile) {
            if (typeof profile[stat] === "number") {
                finalArmor.baseStats[stat] = 
                    (finalArmor.baseStats[stat] || 0) + profile[stat];
            }
        }
    }

    return finalArmor;
};
