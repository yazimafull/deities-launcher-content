// enemyTypes.js — définition des types d’ennemis

export const enemyTypes = {
    normal: {
        baseHp: 30,
        baseDamage: 5,
        baseSpeed: 1.4,
        baseSize: 28,
        color: "#884444",
        progressValue: 1,
        dropHealth: false
    },

    elite: {
        baseHp: 80,
        baseDamage: 12,
        baseSpeed: 1.6,
        baseSize: 34,
        color: "#cc3333",
        progressValue: 5,
        dropHealth: false
    },

    aggro: {
        baseHp: 20,
        baseDamage: 4,
        baseSpeed: 2.0,
        baseSize: 24,
        color: "#ffaa00",
        progressValue: 0,
        dropHealth: true
    },

    boss: {
        baseHp: 300,
        baseDamage: 20,
        baseSpeed: 1.2,
        baseSize: 55,
        color: "#7700aa",
        progressValue: 0,
        dropHealth: false
    }
};
