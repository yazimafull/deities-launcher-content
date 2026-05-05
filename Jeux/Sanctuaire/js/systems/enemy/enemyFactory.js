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
    // TAILLE DE BASE (source unique)
    // ================================
    const baseSize = base.stats.size ?? 28;

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

        size: baseSize,
        visualSize: baseSize,

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

        mob.visualSize = baseSize * 1.25;
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

        // === Offense ===
        damage: mob.damage,
        critChance: base.stats.critChance ?? 0,
        critMultiplier: base.stats.critMultiplier ?? 1.5,

        // Dégâts élémentaires
        physicalDamage: base.stats.physicalDamage ?? 0,
        fireDamage: base.stats.fireDamage ?? 0,
        iceDamage: base.stats.iceDamage ?? 0,
        lightningDamage: base.stats.lightningDamage ?? 0,
        poisonDamage: base.stats.poisonDamage ?? 0,
        shadowDamage: base.stats.shadowDamage ?? 0,

        // Multiplicateurs élémentaires
        physicalDamageMultiplier: base.stats.physicalDamageMultiplier ?? 0,
        fireDamageMultiplier: base.stats.fireDamageMultiplier ?? 0,
        iceDamageMultiplier: base.stats.iceDamageMultiplier ?? 0,
        lightningDamageMultiplier: base.stats.lightningDamageMultiplier ?? 0,
        poisonDamageMultiplier: base.stats.poisonDamageMultiplier ?? 0,
        shadowDamageMultiplier: base.stats.shadowDamageMultiplier ?? 0,

        // === Défense ===
        physicalResistance: base.stats.physicalResistance ?? 0,
        fireResistance: base.stats.fireResistance ?? 0,
        iceResistance: base.stats.iceResistance ?? 0,
        lightningResistance: base.stats.lightningResistance ?? 0,
        poisonResistance: base.stats.poisonResistance ?? 0,
        shadowResistance: base.stats.shadowResistance ?? 0,

        // === Élément du mob ===
        element: base.element ?? "physical",

        // === Combat ===
        attackCooldownMs: base.stats.attackCooldownMs ?? range.damageCd,
        meleeRange: mob.meleeRange,
        aggroRange: mob.aggroRange,

        // === Mouvement ===
        moveSpeed: mob.speed,

        // === Taille ===
        size: mob.size,

        // === Ranged (si un mob en a) ===
        projectileSpeed: base.stats.projectileSpeed ?? 0,
        projectileRange: base.stats.projectileRange ?? 0,

        // === Cadence ===
        attackSpeed: base.stats.attackSpeed ?? 0,
        attackSpeedMultiplier: base.stats.attackSpeedMultiplier ?? 0
    };

    return mob;
}
