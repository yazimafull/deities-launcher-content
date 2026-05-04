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

        stats: {
            hp: 30,
            damage: 4,
            speed: 65,
            size: 22,
            aggroRange: 200,
            attackCooldownMs: 900,   // renommé (ancien attackSpeed)
            meleeRange: 6
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

        stats: {
            hp: 40,
            damage: 8,
            speed: 110,
            size: 26,
            aggroRange: 300,
            attackCooldownMs: 600,   // renommé
            meleeRange: 10
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

        stats: {
            hp: 60,
            damage: 10,
            speed: 75,
            size: 30,
            aggroRange: 260,
            attackCooldownMs: 750,   // renommé
            meleeRange: 12
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

        stats: {
            hp: 800,
            damage: 25,
            speed: 25,
            size: 60,
            aggroRange: 99999,
            attackCooldownMs: 1200,  // renommé
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
