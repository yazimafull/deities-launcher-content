/*
   ROUTE : Jeux/Sanctuaire/js/data/skillProfiles.js

   RÔLE :
     Définition pure des compétences du jeu.
     Aucune logique, aucun calcul.
     Chaque skill fournit :
       - element : type élémentaire (physical, fire, ice, lightning, poison, shadow)
       - coefficient : multiplicateur appliqué dans computeOffense()
       - category : melee / spell / projectile / aoe / dot
       - cost : coût en ressource (spirit ou energy)
       - cooldown : temps de recharge
       - tags : pour talents, affixes, synergies

   PRINCIPES :
     - computeOffense() lit : element + coefficient
     - damageSystem ne doit JAMAIS contenir de données de skill
     - skillProfiles est la source de vérité des compétences
*/

export const Skills = {

    /* ============================================================
       🟥 MELEE
    ============================================================ */

    slash: {
        id: "slash",
        name: "Slash",
        element: "physical",
        coefficient: 1.0,          // dégâts = (base + bonus) * 1.0
        category: "melee",
        cost: 0,
        cooldown: 0.3,
        tags: ["melee", "physical"]
    },

    heavyStrike: {
        id: "heavyStrike",
        name: "Heavy Strike",
        element: "physical",
        coefficient: 1.6,
        category: "melee",
        cost: 10,
        cooldown: 1.0,
        tags: ["melee", "physical", "slow"]
    },

    /* ============================================================
       🔥 FIRE SPELLS
    ============================================================ */

    fireball: {
        id: "fireball",
        name: "Fireball",
        element: "fire",
        coefficient: 1.2,
        category: "spell",
        cost: 20,
        cooldown: 0.8,
        tags: ["spell", "fire", "projectile"]
    },

    flameBurst: {
        id: "flameBurst",
        name: "Flame Burst",
        element: "fire",
        coefficient: 1.4,
        category: "aoe",
        cost: 25,
        cooldown: 1.2,
        tags: ["spell", "fire", "aoe"]
    },

    /* ============================================================
       ⚡ LIGHTNING SPELLS
    ============================================================ */

    lightningStrike: {
        id: "lightningStrike",
        name: "Lightning Strike",
        element: "lightning",
        coefficient: 1.5,
        category: "spell",
        cost: 25,
        cooldown: 1.0,
        tags: ["spell", "lightning"]
    },

    chainLightning: {
        id: "chainLightning",
        name: "Chain Lightning",
        element: "lightning",
        coefficient: 1.1,
        category: "spell",
        cost: 30,
        cooldown: 1.5,
        tags: ["spell", "lightning", "bounce"]
    },

    /* ============================================================
       ❄ ICE SPELLS
    ============================================================ */

    frostBolt: {
        id: "frostBolt",
        name: "Frost Bolt",
        element: "ice",
        coefficient: 1.0,
        category: "projectile",
        cost: 15,
        cooldown: 0.7,
        tags: ["spell", "ice", "slow"]
    },

    iceNova: {
        id: "iceNova",
        name: "Ice Nova",
        element: "ice",
        coefficient: 1.3,
        category: "aoe",
        cost: 25,
        cooldown: 1.3,
        tags: ["spell", "ice", "aoe"]
    },

    /* ============================================================
       ☠ POISON / DOT
    ============================================================ */

    poisonDart: {
        id: "poisonDart",
        name: "Poison Dart",
        element: "poison",
        coefficient: 0.8,
        category: "projectile",
        cost: 10,
        cooldown: 0.5,
        tags: ["projectile", "poison", "dot"],
        dot: {
            type: "poison",
            amount: 5,
            duration: 4
        }
    },

    toxicCloud: {
        id: "toxicCloud",
        name: "Toxic Cloud",
        element: "poison",
        coefficient: 0.6,
        category: "aoe",
        cost: 20,
        cooldown: 1.5,
        tags: ["aoe", "poison", "dot"],
        dot: {
            type: "poison",
            amount: 8,
            duration: 5
        }
    },

    /* ============================================================
       🟪 SHADOW SPELLS
    ============================================================ */

    shadowBolt: {
        id: "shadowBolt",
        name: "Shadow Bolt",
        element: "shadow",
        coefficient: 1.3,
        category: "projectile",
        cost: 20,
        cooldown: 0.9,
        tags: ["spell", "shadow"]
    },

    voidNova: {
        id: "voidNova",
        name: "Void Nova",
        element: "shadow",
        coefficient: 1.5,
        category: "aoe",
        cost: 30,
        cooldown: 1.8,
        tags: ["spell", "shadow", "aoe"]
    }
};
