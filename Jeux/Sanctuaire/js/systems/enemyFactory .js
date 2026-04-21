// enemyFactory.js — génère un ennemi selon son type + biome + difficulté

import { enemyTypes } from "./enemyTypes.js";

// Ranges par défaut selon le type
const RANGES = {
    normal: { aggroRange: 280,   leashRange: 500,   damageCd: 800  },
    elite:  { aggroRange: 320,   leashRange: 600,   damageCd: 1000 },
    aggro:  { aggroRange: 350,   leashRange: 450,   damageCd: 600  },
    boss:   { aggroRange: 99999, leashRange: 99999, damageCd: 1200 }
};

export function createEnemy(type, biome, difficulty, x, y) {
    const base = enemyTypes[type];
    if (!base) {
        console.error("Type d'ennemi inconnu :", type);
        return null;
    }

    const ranges = RANGES[type] || RANGES["normal"];

    // Scaling selon la difficulté
    const hp     = Math.floor(base.baseHp     * (1 + (difficulty - 1) * 0.35));
    const damage = Math.floor(base.baseDamage * (1 + (difficulty - 1) * 0.25));
    const speed  =            base.baseSpeed  * (1 + (difficulty - 1) * 0.05);

    return {
        // Identité
        type,
        biome,
        isElite: type === "elite",
        isBoss:  type === "boss",

        // Position
        x, y,
        spawnX: x,
        spawnY: y,

        // Stats
        hp,
        maxHp: hp,
        damage,
        speed,
        size:   base.baseSize,
        color:  base.color,

        // Ranges IA
        aggroRange: ranges.aggroRange,
        leashRange: ranges.leashRange,
        damageCd:   ranges.damageCd,

        // Gameplay
        progressValue: base.progressValue,
        dropHealth:    base.dropHealth,

        // État IA
        state:       "idle",
        lastDmgTime: 0,
        dead:        false,

        // Transparence (révélation sous les arbres)
        alpha: 1.0
    };
}
