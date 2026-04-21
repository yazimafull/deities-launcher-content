// enemyFactory.js — génère un ennemi selon son type + biome + difficulté

import { enemyTypes } from "./enemyTypes.js";

export function createEnemy(type, biome, difficulty, x, y) {
    const base = enemyTypes[type];
    if (!base) {
        console.error("Type d'ennemi inconnu :", type);
        return null;
    }

    // Scaling selon la difficulté
    const hp     = Math.floor(base.baseHp * (1 + (difficulty - 1) * 0.35));
    const damage = Math.floor(base.baseDamage * (1 + (difficulty - 1) * 0.25));
    const speed  = base.baseSpeed * (1 + (difficulty - 1) * 0.05);

    return {
        type,
        biome,
        x, y,
        spawnX: x,
        spawnY: y,
        hp,
        maxHp: hp,
        damage,
        speed,
        size: base.baseSize,
        color: base.color,
        progressValue: base.progressValue,
        dropHealth: base.dropHealth,
        dead: false,
        state: "idle",
        lastDmgTime: 0
    };
}
