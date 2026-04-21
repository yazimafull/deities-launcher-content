// enemyTypes.js
// Données de base des ennemis — aucun comportement, juste les valeurs

export const enemyTypes = {

    // --------------------------------
    // NORMAL — mob standard
    // --------------------------------
    normal: {
        baseHp:        30,
        baseDamage:    5,
        baseSpeed:     1.4,
        baseSize:      28,
        color:         "#884444",
        aggroRange:    280,
        leashRange:    500,
        damageCd:      800,     // ms entre chaque tick de dégât
        progressValue: 1,       // valeur pour la barre de progression
        dropHealth:    false,
        isElite:       false
    },

    // --------------------------------
    // ELITE — plus gros, plus fort
    // --------------------------------
    elite: {
        baseHp:        120,
        baseDamage:    12,
        baseSpeed:     1.1,
        baseSize:      42,
        color:         "#cc6600",
        aggroRange:    320,
        leashRange:    600,
        damageCd:      1000,
        progressValue: 3,
        dropHealth:    true,
        isElite:       true
    },

    // --------------------------------
    // BOSS — unique par carte
    // --------------------------------
    boss: {
        baseHp:        400,
        baseDamage:    20,
        baseSpeed:     1.0,
        baseSize:      60,
        color:         "#7700aa",
        aggroRange:    99999,   // aggro toujours
        leashRange:    99999,   // jamais de leash
        damageCd:      1200,
        progressValue: 0,       // ne compte pas dans la barre
        dropHealth:    true,
        isElite:       false,
        isBoss:        true
    }
};
