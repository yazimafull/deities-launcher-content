﻿// enemyTypes.js

export const enemyTypes = {

    normal: {
        baseHp:        30,
        baseDamage:    5,
        baseSpeed:     1.4,
        baseSize:      28,
        color:         "#884444",
        progressValue: 1,
        dropHealth:    false,

        isElite: false,
        isBoss:  false,

        armor:      0,
        shield:     0,
        resistance: 0
    },

    elite: {
        baseHp:        120,
        baseDamage:    12,
        baseSpeed:     1.1,
        baseSize:      42,
        color:         "#cc6600",
        progressValue: 3,
        dropHealth:    true,

        isElite: true,
        isBoss:  false,

        armor:      5,
        shield:     20,
        resistance: 0.1
    },

    boss: {
        baseHp:        400,
        baseDamage:    20,
        baseSpeed:     1.0,
        baseSize:      60,
        color:         "#7700aa",
        progressValue: 0,
        dropHealth:    true,

        isElite: false,
        isBoss:  true,

        armor:      10,
        shield:     50,
        resistance: 0.2
    }
};
