/*
   ROUTE : Jeux/Sanctuaire/js/systems/enemy/enemyFactory.js

   RÔLE :
     Fabrique les ennemis à partir du bestiaire.
     - Applique le scaling de difficulté
     - Applique les modificateurs élite / boss
     - Génère des stats complètes pour mob.stats (compatibles combatSystem)
     - Ne gère aucune IA (enemySystem) ni combat (combatSystem)
*/

import { Bestiary as enemyTypes } from "../../data/bestiary.js";

// ============================================================================
// TABLE DES RANGES PAR TYPE
// ============================================================================
const RANGES = {
    normal: { aggroRange: 250, damageCd: 800 },
    elite:  { aggroRange: 320, damageCd: 1000 },
    aggro:  { aggroRange: 350, damageCd: 600 },
    boss:   { aggroRange: 99999, damageCd: 1200 }
};

// ============================================================================
// CREATE ENEMY
// ============================================================================
export function createEnemy(type, biome, difficulty, x, y, bestiaryData, flags = {}) {

    const base = enemyTypes[type];
    if (!base) return null;

    const range = RANGES[type] || RANGES.normal;
    const diff = Number(difficulty) || 1;

    // ================================
    // SCALING DIFFICULTÉ
    // ================================
    let hp     = Math.floor(base.stats.hp * (1 + (diff - 1) * 0.35));
    let damage = Math.floor(base.stats.damage * (1 + (diff - 1) * 0.25));
    let speed  = base.stats.speed * (1 + (diff - 1) * 0.05);

    const isElite = flags.elite === true;
    const isBoss  = type === "boss";

    // ================================
    // MOB DE BASE
    // ================================
    const mob = {
        isMob: true,
        type,
        biome,
        isElite,
        isBoss,

        difficulty: diff,

        x, y,
        spawnX: x,
        spawnY: y,

        hp,
        maxHp: hp,
        damage,
        speed,
        attackDamage: damage,

        size: base.stats.size,
        visualSize: base.stats.size,

        color: base.color ?? "#884444",

        weapon: {
            type: "melee",
            meleeRange: base.stats.meleeRange ?? 15,
            damage: damage
        },

        aggroRange: range.aggroRange,
        meleeRange: base.stats.meleeRange ?? 0,

        objectivePoints: base.rewards?.objectivePoints ?? 1,
        baseXP: base.rewards?.baseXP ?? 1,
        dropHealth: base.dropHealth ?? false,

        state: "idle",
        lastDmgTime: 0,
        dead: false,
        alpha: 1,

        resistances: {},
        dots: [],

        entourage: base.entourage ?? 0,
        entourageType: base.entourageType ?? null,

        eliteOutline: false
    };

    // ================================
    // MODIFICATEURS BOSS
    // ================================
    if (isBoss) {

        mob.meleeRange = mob.size * 0.6;

        mob.entourage = 0;
        mob.entourageRandom = false;

        mob.eliteOutline = false;
    }

    // ================================
    // MODIFICATEURS ÉLITE
    // ================================
    if (isElite && !isBoss) {

        mob.hp = Math.floor(mob.hp * 2);
        mob.maxHp = mob.hp;

        mob.damage = Math.floor(mob.damage * 1.5);
        mob.attackDamage = mob.damage;

        mob.speed *= 1.1;

        mob.visualSize = mob.size * 1.25;
        mob.size = mob.visualSize;

        mob.meleeRange += 6;

        mob.objectivePoints *= 3;

        mob.entourage = 3;
        mob.entourageRandom = true;

        mob.eliteOutline = true;
    }

    // ========================================================================
    // STATS COMPLÈTES POUR RUNTIME (combatSystem + enemySystem)
    // ========================================================================
    mob.stats = {
        // HP
        hp: mob.hp,
        maxHp: mob.maxHp,

        // Dégâts
        attackDamage: mob.damage,

        // Cooldown d’attaque
        attackCooldownMs: base.stats.attackCooldownMs ?? range.damageCd,

        // Portée melee
        meleeRange: mob.meleeRange,

        // Portée d’aggro
        aggroRange: mob.aggroRange,

        // Vitesse
        moveSpeed: mob.speed,

        // Taille
        size: mob.size,

        // Ranged (si jamais un mob en a)
        projectileSpeed: base.stats.projectileSpeed ?? 0,
        projectileRange: base.stats.projectileRange ?? 0,

        // Cadence
        attackSpeed: base.stats.attackSpeed ?? 0,
        attackSpeedMultiplier: base.stats.attackSpeedMultiplier ?? 0,

        // Élémentaire
        elementalDamage: base.stats.elementalDamage ?? 0,
        elementalDamageMultiplier: base.stats.elementalDamageMultiplier ?? 0
    };

    return mob;
}
