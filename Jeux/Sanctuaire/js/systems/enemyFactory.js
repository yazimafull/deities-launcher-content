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

    const ranges = RANGES[type] || RANGES["normal"];
    const diff   = Number(difficulty) || 1;

    // Scaling difficulté
    const hp     = Math.floor(base.baseHp     * (1 + (diff - 1) * 0.35));
    const damage = Math.floor(base.baseDamage * (1 + (diff - 1) * 0.25));
    const speed  =            base.baseSpeed  * (1 + (diff - 1) * 0.05);

    // Mob final
    const mob = {
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

        resistances: {},
        dots:        [],

        // Ajout pour le système procédural
        objectivePoints: bestiaryData?.objectivePoints ?? 1,
        elite: bestiaryData?.elite ?? false,
        entourage: 0,
        entourageType: null
    };

    // -----------------------------
    // BONUS ÉLITE (si elite = true)
    // -----------------------------
    if (mob.elite) {
        mob.hp     = Math.floor(mob.hp * 2.0);
        mob.maxHp  = mob.hp;
        mob.damage = Math.floor(mob.damage * 1.5);
        mob.speed  *= 1.1;
        mob.size   *= 1.2;

        mob.objectivePoints = Math.floor(mob.objectivePoints * 3);

        // entourage automatique
        mob.entourage = 3;
        mob.entourageType = mob.type;
    }

    // -----------------------------
    // AFFIXES (placeholder)
    // -----------------------------
    if (bestiaryData?.affixes) {
        for (let affix of bestiaryData.affixes) {
            // Exemple : affix.apply(mob)
            // Tu ajouteras ton système d'affixes ici
        }
    }

    return mob;
}
