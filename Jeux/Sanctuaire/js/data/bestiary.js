export const Bestiary = {

    slime: {
        // Où il peut apparaître
        biomes: ["forest"],

        // Niveau de map où il peut spawn
        minLevel: 1,
        maxLevel: 15,

        // Probabilité relative
        weight: 3,

        // Stats de base
        hp: 30,
        damage: 4,
        speed: 0.8,
        size: 22,
        aggroRange: 200,

        // Objectif (points donnés à la mort)
        objectivePoints: 1,

        // Élites ?
        elite: false,          // si true → scaling élite appliqué automatiquement
        entourage: 0,          // pas d’entourage
        entourageType: null
    },

    wolf: {
        biomes: ["forest"],
        minLevel: 1,
        maxLevel: 15,
        weight: 2,

        hp: 40,
        damage: 8,
        speed: 1.4,
        size: 26,
        aggroRange: 300,

        objectivePoints: 1,

        elite: false,          // si tu veux un wolf élite → passe à true
        entourage: 0,
        entourageType: null
    },

    skeleton: {
        biomes: ["forest", "graveyard"],
        minLevel: 10,
        maxLevel: 20,
        weight: 1,

        hp: 60,
        damage: 10,
        speed: 0.9,
        size: 30,
        aggroRange: 260,

        objectivePoints: 3,

        elite: false,
        entourage: 0,
        entourageType: null
    }
};
