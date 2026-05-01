// === ROUTE : /systems/item/profiles/gemProfiles.js
// === RÔLE : Amplification des stats de base via les sockets.
// === NOTES :
// - Les gemmes ne modifient que les stats de base (HP, Armor, Damage, Speed, Spirit, Shield).
// - Elles ne modifient pas les affixes.
// - Elles sont appliquées AVANT l’assemblage final de l’armure/arme.
// - Leur puissance est exprimée en pourcentage (multiplicateur).

export const GemProfiles = {

    single(item) {
        return item.profile || "baseStatGem";
    },

    combined() {
        console.warn("Les gemmes ne peuvent pas être combinées.");
        return null;
    },

    // === GEMMES DE BASE ===

    hpGem: {
        id: "hpGem",
        role: "baseStat",
        stat: "hp",
        multiplier: 10,   // +10% HP de base
    },

    armorGem: {
        id: "armorGem",
        role: "baseStat",
        stat: "armor",
        multiplier: 10,   // +10% Armor de base
    },

    shieldGem: {
        id: "shieldGem",
        role: "baseStat",
        stat: "shield",
        multiplier: 10,   // +10% Shield de base
    },

    damageGem: {
        id: "damageGem",
        role: "baseStat",
        stat: "damage",
        multiplier: 12,   // +12% Damage de base
    },

    speedGem: {
        id: "speedGem",
        role: "baseStat",
        stat: "speed",
        multiplier: 5,    // +5% Speed de base
    },

    spiritGem: {
        id: "spiritGem",
        role: "baseStat",
        stat: "spirit",
        multiplier: 10,   // +10% Spirit de base
    },

    regenGem: {
        id: "regenGem",
        role: "baseStat",
        stat: "hpRegen",
        multiplier: 15,   // +15% HP regen de base
    },

    shieldRegenGem: {
        id: "shieldRegenGem",
        role: "baseStat",
        stat: "shieldRegen",
        multiplier: 15,   // +15% Shield regen de base
    },

    // === GEMMES AVANCÉES (T3+ / endgame) ===

    hybridGem: {
        id: "hybridGem",
        role: "baseStat",
        stats: ["hp", "armor"],
        multiplier: 6,    // +6% HP & +6% Armor de base
    },

    offensiveHybridGem: {
        id: "offensiveHybridGem",
        role: "baseStat",
        stats: ["damage", "speed"],
        multiplier: 6,    // +6% Damage & +6% Speed
    },

    defensiveHybridGem: {
        id: "defensiveHybridGem",
        role: "baseStat",
        stats: ["shield", "hpRegen"],
        multiplier: 8,    // +8% Shield & +8% HP regen
    },
};
