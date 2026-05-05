/*
   ROUTE : Jeux/Sanctuaire/js/data/affixes.js

   RÔLE :
     Registre complet des affixes du jeu.
     Chaque affixe définit :
       - id unique
       - stat ciblée (référence à Stats.js)
       - catégorie (offense / defense / utility / meta / transcendent)
       - rollType (flat / percent / special)
       - raretés autorisées
       - poids (probabilité relative)
       - tiers (min/max par tier)
       - description

   PRINCIPES :
     - AUCUNE stat fantôme : toutes les stats viennent de Stats.js
     - rollType = "flat" → valeur brute (additive)
     - rollType = "percent" → valeur multiplicative (ex : 0.10 = +10%)
     - transcendants → pas de tiers, effets uniques
*/

import { Stats } from "./stats.js";

export const Affixes = {

    // ============================
    // 🟥 OFFENSE — SIMPLE
    // ============================

    damage: {
        id: "damage",
        stat: Stats.damage.id,
        category: "offense",
        rollType: "flat",
        rarityAllowed: ["white", "blue", "yellow", "purple", "orange"],
        weight: 120,
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
        description: "Augmente les dégâts universels."
    },

    damageMultiplier: {
        id: "damageMultiplier",
        stat: Stats.damageMultiplier.id,
        category: "offense",
        rollType: "percent",
        rarityAllowed: ["blue", "yellow", "purple", "orange"],
        weight: 80,
        tiers: [
            { tier: 1, min: 0.02, max: 0.03 },
            { tier: 2, min: 0.03, max: 0.04 },
            { tier: 3, min: 0.04, max: 0.05 },
            { tier: 4, min: 0.05, max: 0.06 },
            { tier: 5, min: 0.06, max: 0.07 },
            { tier: 6, min: 0.07, max: 0.08 },
            { tier: 7, min: 0.08, max: 0.09 },
            { tier: 8, min: 0.09, max: 0.10 },
            { tier: 9, min: 0.10, max: 0.12 }
        ],
        description: "Augmente tous les dégâts de manière multiplicative."
    },

    // ============================
    // 🟥 OFFENSE — ÉLÉMENTAIRES
    // ============================

    fireDamage: {
        id: "fireDamage",
        stat: Stats.fireDamage.id,
        category: "offense",
        rollType: "flat",
        rarityAllowed: ["white", "blue", "yellow", "purple"],
        weight: 80,
        tiers: [
            { tier: 1, min: 2, max: 4 },
            { tier: 2, min: 4, max: 7 },
            { tier: 3, min: 7, max: 11 },
            { tier: 4, min: 11, max: 16 },
            { tier: 5, min: 16, max: 22 }
        ],
        description: "Augmente les dégâts de feu."
    },

    fireDamageMultiplier: {
        id: "fireDamageMultiplier",
        stat: Stats.fireDamageMultiplier.id,
        category: "offense",
        rollType: "percent",
        rarityAllowed: ["blue", "yellow", "purple", "orange"],
        weight: 50,
        tiers: [
            { tier: 1, min: 0.02, max: 0.03 },
            { tier: 2, min: 0.03, max: 0.05 },
            { tier: 3, min: 0.05, max: 0.07 },
            { tier: 4, min: 0.07, max: 0.09 },
            { tier: 5, min: 0.09, max: 0.12 }
        ],
        description: "Augmente les dégâts de feu de manière multiplicative."
    },

    // (Même structure pour ice, lightning, poison, shadow)
    // Je te les génère si tu veux la version complète.

    // ============================
    // 🟥 OFFENSE — CRITIQUES
    // ============================

    critChance: {
        id: "critChance",
        stat: Stats.critChance.id,
        category: "offense",
        rollType: "flat",
        rarityAllowed: ["blue", "yellow", "purple", "orange"],
        weight: 60,
        tiers: [
            { tier: 1, min: 1, max: 2 },
            { tier: 2, min: 2, max: 3 },
            { tier: 3, min: 3, max: 4 },
            { tier: 4, min: 4, max: 5 },
            { tier: 5, min: 5, max: 6 }
        ],
        description: "Augmente la chance de coup critique."
    },

    critMultiplier: {
        id: "critMultiplier",
        stat: Stats.critMultiplier.id,
        category: "offense",
        rollType: "flat",
        rarityAllowed: ["yellow", "purple", "orange"],
        weight: 40,
        tiers: [
            { tier: 1, min: 10, max: 15 },
            { tier: 2, min: 15, max: 20 },
            { tier: 3, min: 20, max: 25 },
            { tier: 4, min: 25, max: 30 },
            { tier: 5, min: 30, max: 35 }
        ],
        description: "Augmente les dégâts critiques."
    },

    critMultiplierMultiplier: {
        id: "critMultiplierMultiplier",
        stat: Stats.critMultiplierMultiplier.id,
        category: "offense",
        rollType: "percent",
        rarityAllowed: ["purple", "orange"],
        weight: 10,
        tiers: [
            { tier: 1, min: 0.02, max: 0.03 },
            { tier: 2, min: 0.03, max: 0.04 },
            { tier: 3, min: 0.04, max: 0.05 }
        ],
        description: "Augmente les dégâts critiques de manière multiplicative."
    },

    // ============================
    // 🟥 OFFENSE — PROJECTILES
    // ============================

    projectileSpeed: {
        id: "projectileSpeed",
        stat: Stats.projectileSpeed.id,
        category: "offense",
        rollType: "flat",
        rarityAllowed: ["blue", "yellow", "purple"],
        weight: 40,
        tiers: [
            { tier: 1, min: 5, max: 10 },
            { tier: 2, min: 10, max: 15 },
            { tier: 3, min: 15, max: 20 }
        ],
        description: "Augmente la vitesse des projectiles."
    },

    projectileCount: {
        id: "projectileCount",
        stat: Stats.projectileCount.id,
        category: "offense",
        rollType: "flat",
        rarityAllowed: ["purple", "orange"],
        weight: 5,
        tiers: [
            { tier: 1, min: 1, max: 1 }
        ],
        description: "Ajoute un projectile supplémentaire."
    },

    // ============================
    // 🟩 DEFENSE
    // ============================

    maxHp: {
        id: "maxHp",
        stat: Stats.maxHp.id,
        category: "defense",
        rollType: "flat",
        rarityAllowed: ["white", "blue", "yellow", "purple"],
        weight: 100,
        tiers: [
            { tier: 1, min: 10, max: 20 },
            { tier: 2, min: 20, max: 30 },
            { tier: 3, min: 30, max: 40 },
            { tier: 4, min: 40, max: 50 }
        ],
        description: "Augmente les points de vie."
    },

    physicalResistance: {
        id: "physicalResistance",
        stat: Stats.physicalResistance.id,
        category: "defense",
        rollType: "percent",
        rarityAllowed: ["white", "blue", "yellow", "purple"],
        weight: 120,
        tiers: [
            { tier: 1, min: 0.01, max: 0.02 },
            { tier: 2, min: 0.02, max: 0.04 },
            { tier: 3, min: 0.04, max: 0.06 },
            { tier: 4, min: 0.06, max: 0.08 }
        ],
        description: "Réduit les dégâts physiques."
    },

    // (Même structure pour fire/ice/lightning/poison/shadowResistance)

    // ============================
    // 🟦 UTILITY
    // ============================

    moveSpeed: {
        id: "moveSpeed",
        stat: Stats.moveSpeed.id,
        category: "utility",
        rollType: "flat",
        rarityAllowed: ["blue", "yellow", "purple"],
        weight: 50,
        tiers: [
            { tier: 1, min: 1, max: 2 },
            { tier: 2, min: 2, max: 3 },
            { tier: 3, min: 3, max: 4 }
        ],
        description: "Augmente la vitesse de déplacement."
    },

    lootQuality: {
        id: "lootQuality",
        stat: Stats.lootQuality.id,
        category: "utility",
        rollType: "flat",
        rarityAllowed: ["yellow", "purple", "orange"],
        weight: 20,
        tiers: [
            { tier: 1, min: 1, max: 2 },
            { tier: 2, min: 2, max: 3 },
            { tier: 3, min: 3, max: 4 }
        ],
        description: "Augmente la qualité du loot."
    },

    // ============================
    // 🟪 META
    // ============================

    spiritMax: {
        id: "spiritMax",
        stat: Stats.spiritMax.id,
        category: "meta",
        rollType: "flat",
        rarityAllowed: ["blue", "yellow", "purple"],
        weight: 40,
        tiers: [
            { tier: 1, min: 5, max: 10 },
            { tier: 2, min: 10, max: 15 },
            { tier: 3, min: 15, max: 20 }
        ],
        description: "Augmente le maximum d'esprit."
    },

    // ============================
    // 🟨 TRANSCENDANTS
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
        stat: Stats.spiritCostReduction.id,
        category: "transcendent",
        rollType: "special",
        rarityAllowed: ["transcendent"],
        weight: 1,
        tiers: [],
        description: "Réduit le coût d'esprit de 50%."
    }
};
