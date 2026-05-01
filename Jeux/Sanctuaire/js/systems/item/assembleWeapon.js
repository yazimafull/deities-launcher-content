// === ROUTE : /systems/item/assembleWeapon.js
// === RÔLE : Construire l’arme finale à partir de ses pièces (si tu en as) ou d’une seule arme.
// === NOTES :
// - Fusionne les stats de base.
// - Applique les gemmes (multiplicateurs sur stats de base).
// - Fusionne les affixes.
// - Applique le profil d’arme (twoHanded, bow, wand, etc.).
// - Retourne un objet "finalWeapon" prêt pour le biome.

import { WeaponProfiles } from "./profiles/weaponProfiles.js";
import { GemProfiles } from "./profiles/gemProfiles.js";

export const assembleWeapon = (parts = []) => {
    // Si tu utilises une seule arme (pas de pièces), tu peux aussi passer directement un item
    if (!Array.isArray(parts)) parts = [parts];

    const finalWeapon = {
        baseStats: {},
        affixes: {},
        profile: null,
        tier: 1,
        quality: "white",
    };

    for (const part of parts) {
        if (!part) continue;

        // === 1) Stats de base
        if (part.baseStats) {
            for (const stat in part.baseStats) {
                finalWeapon.baseStats[stat] =
                    (finalWeapon.baseStats[stat] || 0) + part.baseStats[stat];
            }
        }

        // === 2) Affixes
        if (part.affixes) {
            for (const affix in part.affixes) {
                finalWeapon.affixes[affix] =
                    (finalWeapon.affixes[affix] || 0) + part.affixes[affix];
            }
        }

        // === 3) Profil d’arme
        if (!finalWeapon.profile && part.profile) {
            finalWeapon.profile = part.profile;
        }

        // === 4) Tier = max
        finalWeapon.tier = Math.max(finalWeapon.tier, part.tier || 1);

        // === 5) Qualité = bottleneck simple (même logique que l’armure)
        const q = part.quality;
        const order = ["white", "blue", "yellow", "purple", "orange"];
        if (order.indexOf(q) < order.indexOf(finalWeapon.quality)) {
            finalWeapon.quality = q;
        }

        // === 6) Gemmes sur la pièce
        if (part.gems) {
            for (const gem of part.gems) {
                const gemProfile = GemProfiles[gem.id];
                if (!gemProfile) continue;

                // Gemme simple
                if (gemProfile.stat) {
                    const stat = gemProfile.stat;
                    const mult = gemProfile.multiplier / 100;
                    finalWeapon.baseStats[stat] =
                        (finalWeapon.baseStats[stat] || 0) * (1 + mult);
                }

                // Gemme hybride
                if (gemProfile.stats) {
                    for (const stat of gemProfile.stats) {
                        const mult = gemProfile.multiplier / 100;
                        finalWeapon.baseStats[stat] =
                            (finalWeapon.baseStats[stat] || 0) * (1 + mult);
                    }
                }
            }
        }
    }

    // === 7) Appliquer le profil d’arme (comportement offensif)
    if (finalWeapon.profile && WeaponProfiles[finalWeapon.profile]) {
        const profile = WeaponProfiles[finalWeapon.profile];

        for (const key in profile) {
            const value = profile[key];
            if (typeof value === "number") {
                finalWeapon.baseStats[key] =
                    (finalWeapon.baseStats[key] || 0) + value;
            }
        }
    }

    return finalWeapon;
};
