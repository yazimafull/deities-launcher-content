/*
   ROUTE : /systems/item/assembleWeaponSimple.js
   RÔLE : Fusionner 2 à 3 pièces d’arme pour créer une arme craftée simple.
   EXPORTS : assembleWeaponSimple
*/

export function assembleWeaponSimple(parts) {

    // === 1) Structure de l’arme finale ===
    const finalWeapon = {
        id: "crafted_weapon_" + crypto.randomUUID(),
        type: "weapon",             // type global (catégorie)
        slot: "weapon",             // slot unique
        weaponType: "crafted",      // profil interne
        name: "Arme assemblée",
        icon: "icons/weapon_crafted.png",

        stats: {},
        affixes: {},

        tier: 1,
        quality: "white",
        source: "forge"
    };

    // === 2) Fusion des pièces ===
    for (const part of parts) {
        if (!part) continue;

        // Stats
        if (part.stats) {
            for (const stat in part.stats) {
                finalWeapon.stats[stat] =
                    (finalWeapon.stats[stat] || 0) + part.stats[stat];
            }
        }

        // Affixes
        if (part.affixes) {
            for (const affix in part.affixes) {
                finalWeapon.affixes[affix] =
                    (finalWeapon.affixes[affix] || 0) + part.affixes[affix];
            }
        }

        // Tier = max
        if (part.tier) {
            finalWeapon.tier = Math.max(finalWeapon.tier, part.tier);
        }

        // Qualité = bottleneck
        if (part.quality) {
            const order = ["white", "blue", "yellow", "purple", "orange"];
            if (order.indexOf(part.quality) < order.indexOf(finalWeapon.quality)) {
                finalWeapon.quality = part.quality;
            }
        }
    }

    // ============================================================
    // 🔥 3) Détection automatique du type d’arme (ARC / MELEE / ETC)
    // ============================================================
    const slots = parts.map(p => p.slot);

    // ARC = frame + string + tip
    if (slots.includes("frame") && slots.includes("string") && slots.includes("blade")) {
        finalWeapon.weaponType = "bow";   // ton type interne
        finalWeapon.type = "ranged";      // ⭐ OBLIGATOIRE pour le combatSystem
        finalWeapon.name = "Arc assemblé";
    }

    // (plus tard : épée, hache, bâton, fusil, etc.)

    console.log("DEBUG ARME FINALE :", JSON.stringify(finalWeapon, null, 2));

    return finalWeapon;
}
