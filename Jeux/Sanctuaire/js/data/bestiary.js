// js/data/bestiary.js
// ============================================================================
// RÔLE : Source de vérité du bestiaire (stats, biomes, niveaux, poids, élites)
// ============================================================================

const BestiaryData = {

    slime: {
        biomes: ["forest"],
        levelRange: { min: 1, max: 15 },
        weight: 3,
        color: "#4a9e4a",

        stats: {
            hp: 30,
            damage: 4,
            speed: 65,
            size: 22,
            aggroRange: 200,
            attackSpeed: 900,   // ms
            meleeRange: 6       // petit reach
        },

        rewards: { objectivePoints: 1, baseXP: 5 },

        dropHealth: false,
        elite: false,
        entourage: 0,
        entourageType: null
    },

    wolf: {
        biomes: ["forest"],
        levelRange: { min: 1, max: 15 },
        weight: 2,
        color: "#7a6a5a",

        stats: {
            hp: 40,
            damage: 8,
            speed: 110,
            size: 26,
            aggroRange: 300,
            attackSpeed: 600,   // rapide
            meleeRange: 10
        },

        rewards: { objectivePoints: 1, baseXP: 8 },

        dropHealth: false,
        elite: false,
        entourage: 0,
        entourageType: null
    },

    skeleton: {
        biomes: ["forest", "ruines"],
        levelRange: { min: 10, max: 20 },
        weight: 1,
        color: "#c8c8a0",

        stats: {
            hp: 60,
            damage: 10,
            speed: 75,
            size: 30,
            aggroRange: 260,
            attackSpeed: 750,   // moyen
            meleeRange: 12
        },

        rewards: { objectivePoints: 3, baseXP: 12 },

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

        stats: {
            hp: 800,
            damage: 25,
            speed: 180,
            size: 60,
            aggroRange: 99999,
            attackSpeed: 1200,  // lent mais violent
            meleeRange: 20
        },

        rewards: { objectivePoints: 0, baseXP: 0 },

        dropHealth: false,
        elite: false,
        entourage: 0,
        entourageType: null
    }
};

export const Bestiary = Object.freeze(BestiaryData);
