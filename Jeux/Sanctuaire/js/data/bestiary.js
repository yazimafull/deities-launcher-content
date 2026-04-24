export const Bestiary = Object.freeze({

    slime: {
        biomes: ["forest"],

        levelRange: { min: 1, max: 15 },
        weight: 3,

        stats: {
            hp: 30,
            damage: 4,
            speed: 0.8,
            size: 22,
            aggroRange: 200
        },

        rewards: {
            objectivePoints: 1
        },

        elite: false,
        entourage: 0,
        entourageType: null
    },

    wolf: {
        biomes: ["forest"],

        levelRange: { min: 1, max: 15 },
        weight: 2,

        stats: {
            hp: 40,
            damage: 8,
            speed: 1.4,
            size: 26,
            aggroRange: 300
        },

        rewards: {
            objectivePoints: 1
        },

        elite: false,
        entourage: 0,
        entourageType: null
    },

    skeleton: {
        biomes: ["forest", "graveyard"],

        levelRange: { min: 10, max: 20 },
        weight: 1,

        stats: {
            hp: 60,
            damage: 10,
            speed: 0.9,
            size: 30,
            aggroRange: 260
        },

        rewards: {
            objectivePoints: 3
        },

        elite: false,
        entourage: 0,
        entourageType: null
    }
});