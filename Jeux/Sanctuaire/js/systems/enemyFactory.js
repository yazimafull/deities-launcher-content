// systems/enemyFactory.js
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
    // SCALING
    // ================================
    let hp     = Math.floor(base.baseHp     * (1 + (diff - 1) * 0.35));
    let damage = Math.floor(base.baseDamage * (1 + (diff - 1) * 0.25));
    let speed  = base.baseSpeed * (1 + (diff - 1) * 0.05);

    // ================================
    // MOB BASE
    // ================================
    const mob = {
        type,
        biome,

        isElite: type === "elite",
        isBoss:  type === "boss",

        x, y,
        spawnX: x,
        spawnY: y,

        hp,
        maxHp: hp,
        damage,
        speed,
        size: base.baseSize,
        color: base.color,

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

        // IMPORTANT: bestiary override prioritaire
        elite: bestiaryData?.elite ?? (type === "elite"),

        entourage: bestiaryData?.entourage ?? 0,
        entourageType: bestiaryData?.entourageType ?? null
    };

    // ================================
    // ELITE BONUS (UNIQUEMENT SI ELITE FINAL)
    // ================================
    if (mob.elite) {

        mob.hp     = Math.floor(mob.hp * 2.0);
        mob.maxHp  = mob.hp;
        mob.damage = Math.floor(mob.damage * 1.5);
        mob.speed *= 1.1;
        mob.size  *= 1.2;

        mob.objectivePoints *= 3;

        // fallback entourage si pas défini
        if (mob.entourage === 0) {
            mob.entourage = 3;
        }

        if (!mob.entourageType) {
            mob.entourageType = mob.type;
        }
    }

    // ================================
    // AFFIXES (placeholder)
    // ================================
    if (bestiaryData?.affixes) {
        for (const affix of bestiaryData.affixes) {
            // affix.apply?.(mob)
        }
    }

    return mob;
}