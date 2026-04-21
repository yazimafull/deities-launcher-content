// systems/enemyFactory.js
// Version synchrone — génère un ennemi complet depuis enemyTypes.js

import { enemyTypes } from "./enemyTypes.js";

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
    const diff   = Number(difficulty) || 1;

    const hp     = Math.floor(base.baseHp     * (1 + (diff - 1) * 0.35));
    const damage = Math.floor(base.baseDamage * (1 + (diff - 1) * 0.25));
    const speed  =            base.baseSpeed  * (1 + (diff - 1) * 0.05);

    return {
        type,
        biome,
        isElite: type === "elite",
        isBoss:  type === "boss",

        x, y,
        spawnX: x,
        spawnY: y,

        hp,
        maxHp:  hp,
        damage,
        speed,
        size:   base.baseSize,
        color:  base.color,

        aggroRange:    ranges.aggroRange,
        leashRange:    ranges.leashRange,
        damageCd:      ranges.damageCd,

        progressValue: base.progressValue ?? 1,
        dropHealth:    base.dropHealth    ?? false,

        state:       "idle",
        lastDmgTime: 0,
        dead:        false,
        alpha:       1.0,

        // Pour damageSystem
        resistances: {},
        dots:        []
    };
}