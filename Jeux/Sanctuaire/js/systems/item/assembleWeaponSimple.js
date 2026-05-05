/*
   ROUTE : /systems/item/assembleWeaponSimple.js
   RÔLE :
     Fusionner 2 à 3 pièces d’arme pour créer une arme craftée simple.
   EXPORTS :
     assembleWeaponSimple
*/

export function assembleWeaponSimple(parts) {

    // === 1) Structure de l’arme finale ===
    const finalWeapon = {
        id: "crafted_weapon_" + crypto.randomUUID(),
        type: "weapon",
        slot: "weapon",
        weaponType: "crafted",
        name: "Arme assemblée",
        icon: "icons/weapon_crafted.png",

        stats: {},
        affixes: {},

        tier: 1,
        quality: "white",
        source: "forge",

        // ⭐ Ajout : élément par défaut
        element: "physical"
    };

    // === 2) Fusion des pièces ===
    for (const part of parts) {
        if (!part) continue;

        // -----------------------------
        // FUSION DES STATS
        // -----------------------------
        if (part.stats) {
            for (const stat in part.stats) {
                finalWeapon.stats[stat] =
                    (finalWeapon.stats[stat] || 0) + part.stats[stat];
            }
        }

        // -----------------------------
        // FUSION DES AFFIXES
        // -----------------------------
        if (part.affixes) {
            for (const affix in part.affixes) {
                finalWeapon.affixes[affix] =
                    (finalWeapon.affixes[affix] || 0) + part.affixes[affix];
            }
        }

        // -----------------------------
        // TIER = MAX
        // -----------------------------
        if (part.tier) {
            finalWeapon.tier = Math.max(finalWeapon.tier, part.tier);
        }

        // -----------------------------
        // QUALITÉ = BOTTLENECK
        // -----------------------------
        if (part.quality) {
            const order = ["white", "blue", "yellow", "purple", "orange"];
            if (order.indexOf(part.quality) < order.indexOf(finalWeapon.quality)) {
                finalWeapon.quality = part.quality;
            }
        }
        // -----------------------------
        // ⭐ EXTRACTION DE L’ÉLÉMENT (UNIQUEMENT BLADE / TIP)
        // -----------------------------
        if (part.slot === "blade" || part.slot === "tip") {
            if (part.element) {
                finalWeapon.element = part.element;
            }
        }

    }

    // ============================================================
    // 🔥 3) Détection automatique du type d’arme (ARC / MELEE / ETC)
    // ============================================================
    const slots = parts.map(p => p.slot);

    if (
        slots.includes("frame") &&
        slots.includes("string") &&
        (slots.includes("blade") || slots.includes("tip"))
    ) {
        finalWeapon.weaponType = "bow";
        finalWeapon.type = "ranged";
        finalWeapon.name = "Arc assemblé";
        finalWeapon.icon = "icons/weapon_bow.png";
    }

    console.log("DEBUG ARME FINALE :", JSON.stringify(finalWeapon, null, 2));

    return finalWeapon;
}
