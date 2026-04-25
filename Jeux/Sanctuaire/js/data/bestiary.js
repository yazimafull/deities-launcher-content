// bestiary.js
/*
   ROUTE : js/data/bestiary.js
   RÔLE : Source de vérité unique des ennemis (stats, biomes, niveaux, récompenses)
   EXPORTS : Bestiary
   DÉPENDANCES : Aucune
   NOTES :
   - Ajout uniquement des couleurs demandées.
   - Aucune autre modification structurelle.
   - Respect strict du format existant.
*/

export const Bestiary = Object.freeze({

    slime: {
        biomes: ["forest"],

        levelRange: { min: 1, max: 15 },
        weight: 3,

        color: "#4a9e4a",

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

        color: "#7a6a5a",

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

        color: "#c8c8a0",

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
