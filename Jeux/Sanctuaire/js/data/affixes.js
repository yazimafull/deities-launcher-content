// data/affixes.js

import { Stats } from "./stats.js";

export const Affixes = {

    // ============================
    // 🟥 OFFENSIFS
    // ============================

    attackDamage: {
        id: "attackDamage",
        stat: Stats.attackDamage.id,
        category: "offense",
        rollType: "flat",
        rarityAllowed: ["white", "blue", "yellow", "purple", "orange", "transcendent"],
        weight: 100,
        tiers: [
            { tier: 1, min: 2,  max: 4 },
            { tier: 2, min: 4,  max: 7 },
            { tier: 3, min: 7,  max: 11 },
            { tier: 4, min: 11, max: 16 },
            { tier: 5, min: 16, max: 22 },
            { tier: 6, min: 22, max: 29 },
            { tier: 7, min: 29, max: 37 },
            { tier: 8, min: 37, max: 46 },
            { tier: 9, min: 46, max: 56 }
        ],
        description: "Augmente les dégâts d'attaque."
    },

    critChance: {
        id: "critChance",
        stat: Stats.critChance.id,
        category: "offense",
        rollType: "percent",
        rarityAllowed: ["blue", "yellow", "purple", "orange", "transcendent"],
        weight: 40,
        tiers: [
            { tier: 1, min: 1, max: 2 },
            { tier: 2, min: 2, max: 3 },
            { tier: 3, min: 3, max: 4 },
            { tier: 4, min: 4, max: 5 },
            { tier: 5, min: 5, max: 6 },
            { tier: 6, min: 6, max: 7 },
            { tier: 7, min: 7, max: 8 },
            { tier: 8, min: 8, max: 9 },
            { tier: 9, min: 9, max: 10 }
        ],
        description: "Chance de coup critique."
    },

    // ============================
    // 🟩 DÉFENSIFS
    // ============================

    physicalResistance: {
        id: "physicalResistance",
        stat: Stats.physicalResistance.id,
        category: "defense",
        rollType: "percent",
        rarityAllowed: ["white", "blue", "yellow", "purple", "orange", "transcendent"],
        weight: 120,
        tiers: [
            { tier: 1, min: 1, max: 2 },
            { tier: 2, min: 2, max: 4 },
            { tier: 3, min: 4, max: 6 },
            { tier: 4, min: 6, max: 8 },
            { tier: 5, min: 8, max: 10 },
            { tier: 6, min: 10, max: 12 },
            { tier: 7, min: 12, max: 14 },
            { tier: 8, min: 14, max: 16 },
            { tier: 9, min: 16, max: 18 }
        ],
        description: "Réduit les dégâts physiques."
    },

    biomeResistance: {
        id: "biomeResistance",
        stat: Stats.biomeResistance.id,
        category: "defense",
        rollType: "percent",
        rarityAllowed: ["white", "blue", "yellow", "purple", "orange", "transcendent"],
        weight: 80,
        tiers: [
            { tier: 1, min: 1, max: 2 },
            { tier: 2, min: 2, max: 4 },
            { tier: 3, min: 4, max: 6 },
            { tier: 4, min: 6, max: 8 },
            { tier: 5, min: 8, max: 10 },
            { tier: 6, min: 10, max: 12 },
            { tier: 7, min: 12, max: 14 },
            { tier: 8, min: 14, max: 16 },
            { tier: 9, min: 16, max: 18 }
        ],
        description: "Réduit les dégâts du biome."
    },

    // ============================
    // 🟩 RÉSISTANCES ÉLÉMENTAIRES
    // ============================

    fireResistance: {
        id: "fireResistance",
        stat: Stats.fireResistance.id,
        category: "defense",
        rollType: "percent",
        rarityAllowed: ["blue", "yellow", "purple", "orange", "transcendent"],
        weight: 60,
        tiers: [
            { tier: 1, min: 1, max: 3 },
            { tier: 2, min: 3, max: 5 },
            { tier: 3, min: 5, max: 7 },
            { tier: 4, min: 7, max: 9 },
            { tier: 5, min: 9, max: 11 },
            { tier: 6, min: 11, max: 13 },
            { tier: 7, min: 13, max: 15 },
            { tier: 8, min: 15, max: 17 },
            { tier: 9, min: 17, max: 20 }
        ],
        description: "Réduit les dégâts de feu."
    },

    iceResistance: {
        id: "iceResistance",
        stat: Stats.iceResistance.id,
        category: "defense",
        rollType: "percent",
        rarityAllowed: ["blue", "yellow", "purple", "orange", "transcendent"],
        weight: 60,
        tiers: [
            { tier: 1, min: 1, max: 3 },
            { tier: 2, min: 3, max: 5 },
            { tier: 3, min: 5, max: 7 },
            { tier: 4, min: 7, max: 9 },
            { tier: 5, min: 9, max: 11 },
            { tier: 6, min: 11, max: 13 },
            { tier: 7, min: 13, max: 15 },
            { tier: 8, min: 15, max: 17 },
            { tier: 9, min: 17, max: 20 }
        ],
        description: "Réduit les dégâts de glace."
    },

    lightningResistance: {
        id: "lightningResistance",
        stat: Stats.lightningResistance.id,
        category: "defense",
        rollType: "percent",
        rarityAllowed: ["blue", "yellow", "purple", "orange", "transcendent"],
        weight: 60,
        tiers: [
            { tier: 1, min: 1, max: 3 },
            { tier: 2, min: 3, max: 5 },
            { tier: 3, min: 5, max: 7 },
            { tier: 4, min: 7, max: 9 },
            { tier: 5, min: 9, max: 11 },
            { tier: 6, min: 11, max: 13 },
            { tier: 7, min: 13, max: 15 },
            { tier: 8, min: 15, max: 17 },
            { tier: 9, min: 17, max: 20 }
        ],
        description: "Réduit les dégâts de foudre."
    },

    poisonResistance: {
        id: "poisonResistance",
        stat: Stats.poisonResistance.id,
        category: "defense",
        rollType: "percent",
        rarityAllowed: ["blue", "yellow", "purple", "orange", "transcendent"],
        weight: 60,
        tiers: [
            { tier: 1, min: 1, max: 3 },
            { tier: 2, min: 3, max: 5 },
            { tier: 3, min: 5, max: 7 },
            { tier: 4, min: 7, max: 9 },
            { tier: 5, min: 9, max: 11 },
            { tier: 6, min: 11, max: 13 },
            { tier: 7, min: 13, max: 15 },
            { tier: 8, min: 15, max: 17 },
            { tier: 9, min: 17, max: 20 }
        ],
        description: "Réduit les dégâts de poison."
    },

    shadowResistance: {
        id: "shadowResistance",
        stat: Stats.shadowResistance.id,
        category: "defense",
        rollType: "percent",
        rarityAllowed: ["blue", "yellow", "purple", "orange", "transcendent"],
        weight: 60,
        tiers: [
            { tier: 1, min: 1, max: 3 },
            { tier: 2, min: 3, max: 5 },
            { tier: 3, min: 5, max: 7 },
            { tier: 4, min: 7, max: 9 },
            { tier: 5, min: 9, max: 11 },
            { tier: 6, min: 11, max: 13 },
            { tier: 7, min: 13, max: 15 },
            { tier: 8, min: 15, max: 17 },
            { tier: 9, min: 17, max: 20 }
        ],
        description: "Réduit les dégâts d'ombre."
    },

    // ============================
    // 🟦 UTILITAIRES
    // ============================

    moveSpeed: {
        id: "moveSpeed",
        stat: Stats.moveSpeed.id,
        category: "utility",
        rollType: "percent",
        rarityAllowed: ["blue", "yellow", "purple", "orange", "transcendent"],
        weight: 50,
        tiers: [
            { tier: 1, min: 1, max: 2 },
            { tier: 2, min: 2, max: 3 },
            { tier: 3, min: 3, max: 4 },
            { tier: 4, min: 4, max: 5 },
            { tier: 5, min: 5, max: 6 },
            { tier: 6, min: 6, max: 7 },
            { tier: 7, min: 7, max: 8 },
            { tier: 8, min: 8, max: 9 },
            { tier: 9, min: 9, max: 10 }
        ],
        description: "Augmente la vitesse de déplacement."
    },

    lootQuality: {
        id: "lootQuality",
        stat: Stats.lootQuality.id,
        category: "utility",
        rollType: "percent",
        rarityAllowed: ["yellow", "purple", "orange", "transcendent"],
        weight: 20,
        tiers: [
            { tier: 1, min: 1, max: 2 },
            { tier: 2, min: 2, max: 3 },
            { tier: 3, min: 3, max: 4 },
            { tier: 4, min: 4, max: 5 },
            { tier: 5, min: 5, max: 6 },
            { tier: 6, min: 6, max: 7 },
            { tier: 7, min: 7, max: 8 },
            { tier: 8, min: 8, max: 9 },
            { tier: 9, min: 9, max: 10 }
        ],
        description: "Augmente la qualité du loot."
    },

    // ============================
    // 🟪 TRANSCENDANTS
    // ============================

    unbreakable: {
        id: "unbreakable",
        stat: null,
        category: "transcendent",
        rollType: "special",
        rarityAllowed: ["transcendent"],
        weight: 1,
        tiers: [],
        description: "Cette pièce ne peut jamais descendre sous 1 énergie."
    },

    spiritHalf: {
        id: "spiritHalf",
        stat: Stats.spiritCost.id,
        category: "transcendent",
        rollType: "special",
        rarityAllowed: ["transcendent"],
        weight: 1,
        tiers: [],
        description: "Réduit le coût d'esprit de cette pièce de 50%."
    }
};
