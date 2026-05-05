// js/data/bestiary.js
// ============================================================================
// RÔLE : Source de vérité du bestiaire (stats, biomes, niveaux, poids, élites)
// ============================================================================

const BestiaryData = {

    slime: {
        biomes: ["forest"],
        levelRange: { min: 1, max: 15 },
        weight: 3,
        color: "#6aff6a",

        element: "physical",

        stats: {
            hp: 30,
            damage: 4,
            speed: 65,
            size: 22,
            aggroRange: 200,
            attackCooldownMs: 900,
            meleeRange: 6,

            // Offense
            critChance: 0,
            critMultiplier: 1.5,

            physicalDamage: 0,
            fireDamage: 0,
            iceDamage: 0,
            lightningDamage: 0,
            poisonDamage: 0,
            shadowDamage: 0,

            physicalDamageMultiplier: 0,
            fireDamageMultiplier: 0,
            iceDamageMultiplier: 0,
            lightningDamageMultiplier: 0,
            poisonDamageMultiplier: 0,
            shadowDamageMultiplier: 0,

            // Défense
            physicalResistance: 0,
            fireResistance: 0,
            iceResistance: 0,
            lightningResistance: 0,
            poisonResistance: 0,
            shadowResistance: 0
        },

        rewards: { objectivePoints: 2, baseXP: 50 },

        dropHealth: false,
        elite: false,
        entourage: 0,
        entourageType: null
    },

    wolf: {
        biomes: ["forest"],
        levelRange: { min: 1, max: 15 },
        weight: 2,
        color: "#3a3f55",

        element: "physical",

        stats: {
            hp: 40,
            damage: 8,
            speed: 110,
            size: 26,
            aggroRange: 300,
            attackCooldownMs: 600,
            meleeRange: 10,

            // Offense
            critChance: 0.05,       // les loups peuvent crit un peu
            critMultiplier: 1.6,

            physicalDamage: 0,
            fireDamage: 0,
            iceDamage: 0,
            lightningDamage: 0,
            poisonDamage: 0,
            shadowDamage: 0,

            physicalDamageMultiplier: 0,
            fireDamageMultiplier: 0,
            iceDamageMultiplier: 0,
            lightningDamageMultiplier: 0,
            poisonDamageMultiplier: 0,
            shadowDamageMultiplier: 0,

            // Défense
            physicalResistance: 0.05, // un peu de résistance naturelle
            fireResistance: 0,
            iceResistance: 0,
            lightningResistance: 0,
            poisonResistance: 0,
            shadowResistance: 0
        },

        rewards: { objectivePoints: 2, baseXP: 100 },

        dropHealth: false,
        elite: false,
        entourage: 0,
        entourageType: null
    },

    skeleton: {
        biomes: ["forest", "ruines"],
        levelRange: { min: 10, max: 20 },
        weight: 1,
        color: "#e8e2c8",

        element: "physical",

        stats: {
            hp: 60,
            damage: 10,
            speed: 75,
            size: 30,
            aggroRange: 260,
            attackCooldownMs: 750,
            meleeRange: 12,

            // Offense
            critChance: 0.1,        // squelettes = attaques imprévisibles
            critMultiplier: 1.7,

            physicalDamage: 0,
            fireDamage: 0,
            iceDamage: 0,
            lightningDamage: 0,
            poisonDamage: 0,
            shadowDamage: 0,

            physicalDamageMultiplier: 0,
            fireDamageMultiplier: 0,
            iceDamageMultiplier: 0,
            lightningDamageMultiplier: 0,
            poisonDamageMultiplier: 0,
            shadowDamageMultiplier: 0,

            // Défense
            physicalResistance: 0.1,
            fireResistance: -0.2,   // faiblesse au feu
            iceResistance: 0.1,
            lightningResistance: 0,
            poisonResistance: 0.2,  // résistants au poison
            shadowResistance: 0.1
        },

        rewards: { objectivePoints: 1, baseXP: 12 },

        dropHealth: false,
        elite: false,
        entourage: 0,
        entourageType: null
    },

    boss: {
        biomes: ["forest", "ruines", "abysses"],
        levelRange: { min: 1, max: 99 },
        weight: 0,
        color: "#7700aa",

        element: "shadow",

        stats: {
            hp: 800,
            damage: 25,
            speed: 25,
            size: 60,
            aggroRange: 99999,
            attackCooldownMs: 1200,
            meleeRange: 20,

            // Offense
            critChance: 0.15,
            critMultiplier: 2.0,

            physicalDamage: 0,
            fireDamage: 0,
            iceDamage: 0,
            lightningDamage: 0,
            poisonDamage: 0,
            shadowDamage: 10, // boss = dégâts ombre

            physicalDamageMultiplier: 0,
            fireDamageMultiplier: 0,
            iceDamageMultiplier: 0,
            lightningDamageMultiplier: 0,
            poisonDamageMultiplier: 0,
            shadowDamageMultiplier: 0.2,

            // Défense
            physicalResistance: 0.2,
            fireResistance: 0.1,
            iceResistance: 0.1,
            lightningResistance: 0.1,
            poisonResistance: 0.3,
            shadowResistance: 0.5
        },

        rewards: { objectivePoints: 0, baseXP: 0 },

        dropHealth: false,
        elite: false,
        entourage: 0,
        entourageType: null
    }
};

export const Bestiary = Object.freeze(BestiaryData);
