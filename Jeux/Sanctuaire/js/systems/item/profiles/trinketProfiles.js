// === ROUTE : /systems/item/profiles/trinketProfiles.js
// === RÔLE : Définit les profils de trinkets (anneaux + amulettes).
// === EXPORTS : TrinketProfiles
// === NOTES :
// - Les trinkets ne se combinent pas.
// - Ils donnent des bonus utilitaires permanents.
// - Ils peuvent influencer le loot, le craft, le spirit, etc.
// - La qualité, les affixes et les sockets sont indépendants du profil.

export const TrinketProfiles = {

    // Profil d’un trinket seul
    single(item) {
        return item.profile || "genericTrinket";
    },

    // Les trinkets ne se combinent pas
    combined(itemA, itemB) {
        console.warn("Les trinkets ne peuvent pas être combinés :", itemA.id, itemB.id);
        return null;
    },

    // === PROFILS DE TRINKETS ===

    lootTrinket: {
        id: "lootTrinket",
        role: "loot",
        lootBonus: 10,            // +10% qualité/quantité de loot
    },

    spiritTrinket: {
        id: "spiritTrinket",
        role: "spirit",
        maxSpiritBonus: 20,       // +20 max spirit
        spiritRegenBonus: 5,      // +5% regen spirit
    },

    regenTrinket: {
        id: "regenTrinket",
        role: "regeneration",
        hpRegenBonus: 5,          // +5% regen HP
        shieldRegenBonus: 5,      // +5% regen shield
    },

    craftTrinket: {
        id: "craftTrinket",
        role: "crafting",
        craftCostReduction: 10,   // -10% coût de craft
        socketChanceBonus: 5,     // +5% chance de trouver un item avec socket
    },

    affixTrinket: {
        id: "affixTrinket",
        role: "affixes",
        rareAffixChance: 10,      // +10% chance d’affixes rares
        affixPowerBonus: 5,       // +5% puissance globale des affixes
    },

    genericTrinket: {
        id: "genericTrinket",
        role: "utility",
        utilityBonus: 5,          // bonus générique si aucun profil défini
    },
};
