﻿// systems/enemyFactory.js
// Version étendue — supporte élite, entourage, affixes, scaling

import { enemyTypes } from "./enemyTypes.js";

const RANGES = {
    normal: { aggroRange: 280,   leashRange: 500,   damageCd: 800  },
    elite:  { aggroRange: 320,   leashRange: 600,   damageCd: 1000 },
    aggro:  { aggroRange: 350,   leashRange: 450,   damageCd: 600  },
    boss:   { aggroRange: 99999, leashRange: 99999, damageCd: 1200 }
};

export function createEnemy(type, biome, difficulty, x, y, bestiaryData = null) {

    const base = enemyTypes[type];
    if (!base) {
        console.error("Type d'ennemi inconnu :", type);
        return null;
    }

    const ranges = RANGES[type] || RANGES.normal;
    const diff   = Number(difficulty) || 1;

    // ================================
    // 1. BASE enemyTypes
    // ================================
    let hp     = base.baseHp;
    let damage = base.baseDamage;
    let speed  = base.baseSpeed;
    let size   = base.baseSize;
    let color  = base.color;

    // ================================
    // 2. OVERRIDES Bestiary (prioritaires)
    // ================================
    if (bestiaryData) {
        hp     = bestiaryData.hp     ?? hp;
        damage = bestiaryData.damage ?? damage;
        speed  = bestiaryData.speed  ?? speed;
        size   = bestiaryData.size   ?? size;
        color  = bestiaryData.color  ?? color;
    }

    // ================================
    // 3. SCALING (après Bestiary)
    // ================================
    hp     = Math.floor(hp     * (1 + (diff - 1) * 0.35));
    damage = Math.floor(damage * (1 + (diff - 1) * 0.25));
    speed  = speed * (1 + (diff - 1) * 0.05);

    // ================================
    // 4. MOB FINAL (avant élite)
    // ================================
    const mob = {
        type,
        biome,

        isElite: bestiaryData?.elite ?? false,
        isBoss:  type === "boss",

        x, y,
        spawnX: x,
        spawnY: y,

        hp,
        maxHp: hp,
        damage,
        speed,
        size,
        color,

        aggroRange: ranges.aggroRange,
        leashRange: ranges.leashRange,
        damageCd: ranges.damageCd,

        progressValue: base.progressValue ?? 1,
        dropHealth: base.dropHealth ?? false,

        state: "idle",
        lastDmgTime: 0,
        dead: false,
        alpha: 1.0,

        resistances: {},
        dots: [],

        objectivePoints: bestiaryData?.objectivePoints ?? 1,

        entourage: bestiaryData?.entourage ?? 0,
        entourageType: bestiaryData?.entourageType ?? null
    };

    // ================================
    // 5. ELITE BONUS (après fusion)
    // ================================
    if (mob.isElite) {

        mob.hp     = Math.floor(mob.hp * 2.0);
        mob.maxHp  = mob.hp;
        mob.damage = Math.floor(mob.damage * 1.5);
        mob.speed *= 1.1;
        mob.size  *= 1.2;

        mob.objectivePoints *= 3;

        if (mob.entourage === 0) {
            mob.entourage = 3;
        }

        if (!mob.entourageType) {
            mob.entourageType = mob.type;
        }
    }

    // ================================
    // 6. AFFIXES (placeholder)
    // ================================
    if (bestiaryData?.affixes) {
        for (const affix of bestiaryData.affixes) {
            // affix.apply?.(mob)
        }
    }

    return mob;
}
