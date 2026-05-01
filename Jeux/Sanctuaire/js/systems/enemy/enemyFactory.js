/*
   ROUTE : Jeux/Sanctuaire/js/systems/enemy/enemyFactory.js
   ARBORESCENCE :
     Jeux → Sanctuaire → js → systems → enemy → enemyFactory.js

   RÔLE :
     FABRICATION DES ENNEMIS

   PRINCIPLE :
     - Crée un ennemi à partir du bestiaire
     - Applique scaling difficulté
     - Ne contient AUCUNE IA
     - Ne contient AUCUNE logique de combat
     - Retourne un objet mob prêt à spawn

   DÉPENDANCES :
     - data/bestiary.js
*/

import { Bestiary as enemyTypes } from "../../data/bestiary.js";

const RANGES = {
    normal: { aggroRange: 280, damageCd: 800 },
    elite:  { aggroRange: 320, damageCd: 1000 },
    aggro:  { aggroRange: 350, damageCd: 600 },
    boss:   { aggroRange: 99999, damageCd: 1200 }
};

// ================================
// CREATE ENEMY
// ================================
export function createEnemy(type, biome, difficulty, x, y) {

    const base = enemyTypes[type];
    if (!base) return null;

    const range = RANGES[type] || RANGES.normal;
    const diff = Number(difficulty) || 1;

    // ================================
    // SCALING
    // ================================
    let hp     = Math.floor(base.stats.hp * (1 + (diff - 1) * 0.35));
    let damage = Math.floor(base.stats.damage * (1 + (diff - 1) * 0.25));
    let speed  = base.stats.speed * (1 + (diff - 1) * 0.05);

    const isElite = type === "elite";
    const isBoss = type === "boss";

    const mob = {
        // ========================
        // IDENTITE
        // ========================
        isMob: true,
        type,
        biome,

        isElite,
        isBoss,

        // ========================
        // POSITION
        // ========================
        x,
        y,
        spawnX: x,
        spawnY: y,

        // ========================
        // STATS
        // ========================
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
            damage: damage,
        },


        // ========================
        // COMBAT
        // ========================
        aggroRange: range.aggroRange,
        attackSpeed: base.stats.attackSpeed ?? range.damageCd,
        meleeRange: base.stats.meleeRange ?? 0,

        // ========================
        // PROGRESSION
        // ========================
        objectivePoints: base.rewards?.objectivePoints ?? 1,
        dropHealth: base.dropHealth ?? false,

        // ========================
        // ETAT
        // ========================
        state: "idle",
        lastDmgTime: 0,
        dead: false,
        alpha: 1,

        // ========================
        // STATUS
        // ========================
        resistances: {},
        dots: [],

        // ========================
        // ENTOURAGE (elite only)
        // ========================
        entourage: base.entourage ?? 0,
        entourageType: base.entourageType ?? null
    };

    // ================================
    // ELITE MODIFIERS
    // ================================
    if (isElite) {

        mob.hp = Math.floor(mob.hp * 2);
        mob.maxHp = mob.hp;

        mob.damage = Math.floor(mob.damage * 1.5);
        mob.speed *= 1.1;

        mob.visualSize = mob.size * 1.2;
        mob.meleeRange += 4;

        mob.objectivePoints *= 3;

        if (mob.entourage === 0) mob.entourage = 3;
        if (!mob.entourageType) mob.entourageType = mob.type;
    }

    return mob;
}