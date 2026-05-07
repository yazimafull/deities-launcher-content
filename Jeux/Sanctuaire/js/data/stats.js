/*
   ROUTE : Jeux/Sanctuaire/js/data/stats.js

   RÔLE :
     Registre central et unique de toutes les statistiques du jeu.
     Source de vérité absolue pour : player, ennemis, items, affixes, talents, biomes.

   PRINCIPES :
     - Définition pure : aucune logique, aucun calcul.
     - Chaque stat possède : id, category, type (additive/multiplicative), description.
     - Catégories normalisées : offense / defense / utility / meta.
     - Toute stat utilisée dans le jeu DOIT exister ici.
*/

export const Stats = {

    // ============================
    // 🟥 OFFENSIF
    // ============================

    damage: { id: "damage", category: "offense", type: "additive", description: "Dégâts universels." },
    damageMultiplier: { id: "damageMultiplier", category: "offense", type: "multiplicative" },

    physicalDamage: { id: "physicalDamage", category: "offense", type: "additive" },
    fireDamage: { id: "fireDamage", category: "offense", type: "additive" },
    iceDamage: { id: "iceDamage", category: "offense", type: "additive" },
    lightningDamage: { id: "lightningDamage", category: "offense", type: "additive" },
    shadowDamage: { id: "shadowDamage", category: "offense", type: "additive" },
    poisonDamage: { id: "poisonDamage", category: "offense", type: "additive" },

    physicalDamageMultiplier: { id: "physicalDamageMultiplier", category: "offense", type: "multiplicative" },
    fireDamageMultiplier: { id: "fireDamageMultiplier", category: "offense", type: "multiplicative" },
    iceDamageMultiplier: { id: "iceDamageMultiplier", category: "offense", type: "multiplicative" },
    lightningDamageMultiplier: { id: "lightningDamageMultiplier", category: "offense", type: "multiplicative" },
    shadowDamageMultiplier: { id: "shadowDamageMultiplier", category: "offense", type: "multiplicative" },
    poisonDamageMultiplier: { id: "poisonDamageMultiplier", category: "offense", type: "multiplicative" },

    critChance: { id: "critChance", category: "offense", type: "additive" },
    critChanceMultiplier: { id: "critChanceMultiplier", category: "offense", type: "multiplicative" },

    critMultiplier: { id: "critMultiplier", category: "offense", type: "additive" },
    critMultiplierMultiplier: { id: "critMultiplierMultiplier", category: "offense", type: "multiplicative" },

    projectileSpeed: { id: "projectileSpeed", category: "offense", type: "additive" },
    projectileSpeedMultiplier: { id: "projectileSpeedMultiplier", category: "offense", type: "multiplicative" },

    projectileRange: { id: "projectileRange", category: "offense", type: "additive" },
    projectileRangeMultiplier: { id: "projectileRangeMultiplier", category: "offense", type: "multiplicative" },

    projectileCount: { id: "projectileCount", category: "offense", type: "additive" },
    projectileCountMultiplier: { id: "projectileCountMultiplier", category: "offense", type: "multiplicative" },

    dotDamage: { id: "dotDamage", category: "offense", type: "additive" },
    dotDamageMultiplier: { id: "dotDamageMultiplier", category: "offense", type: "multiplicative" },

    dotDuration: { id: "dotDuration", category: "offense", type: "additive" },
    dotDurationMultiplier: { id: "dotDurationMultiplier", category: "offense", type: "multiplicative" },

    attackSpeed: { id: "attackSpeed", category: "offense", type: "additive" },
    attackSpeedMultiplier: { id: "attackSpeedMultiplier", category: "offense", type: "multiplicative" },

    attackRange: { id: "attackRange", category: "offense", type: "additive" },
    attackRangeMultiplier: { id: "attackRangeMultiplier", category: "offense", type: "multiplicative" },


    // ============================
    // 🟩 DÉFENSIF
    // ============================

    maxHp: { id: "maxHp", category: "defense", type: "additive" },
    maxHpMultiplier: { id: "maxHpMultiplier", category: "defense", type: "multiplicative" },

    regenHp: { id: "regenHp", category: "defense", type: "additive" },
    regenHpMultiplier: { id: "regenHpMultiplier", category: "defense", type: "multiplicative" },

    maxShield: { id: "maxShield", category: "defense", type: "additive" },
    maxShieldMultiplier: { id: "maxShieldMultiplier", category: "defense", type: "multiplicative" },

    regenShield: { id: "regenShield", category: "defense", type: "additive" },
    regenShieldMultiplier: { id: "regenShieldMultiplier", category: "defense", type: "multiplicative" },

    dodgeChance: { id: "dodgeChance", category: "defense", type: "additive" },
    parryChance: { id: "parryChance", category: "defense", type: "additive" },
    blockChance: { id: "blockChance", category: "defense", type: "additive" },
    blockPower: { id: "blockPower", category: "defense", type: "additive" },

    physicalResistance: { id: "physicalResistance", category: "defense", type: "additive" },
    fireResistance: { id: "fireResistance", category: "defense", type: "additive" },
    iceResistance: { id: "iceResistance", category: "defense", type: "additive" },
    lightningResistance: { id: "lightningResistance", category: "defense", type: "additive" },
    poisonResistance: { id: "poisonResistance", category: "defense", type: "additive" },
    shadowResistance: { id: "shadowResistance", category: "defense", type: "additive" },

    shieldEfficiencyPhysical: { id: "shieldEfficiencyPhysical", category: "defense", type: "additive" },
    shieldEfficiencyFire: { id: "shieldEfficiencyFire", category: "defense", type: "additive" },
    shieldEfficiencyIce: { id: "shieldEfficiencyIce", category: "defense", type: "additive" },
    shieldEfficiencyLightning: { id: "shieldEfficiencyLightning", category: "defense", type: "additive" },
    shieldEfficiencyPoison: { id: "shieldEfficiencyPoison", category: "defense", type: "additive" },
    shieldEfficiencyShadow: { id: "shieldEfficiencyShadow", category: "defense", type: "additive" },


    // ============================
    // 🟦 UTILITAIRE
    // ============================

    moveSpeed: { id: "moveSpeed", category: "utility", type: "additive" },
    moveSpeedMultiplier: { id: "moveSpeedMultiplier", category: "utility", type: "multiplicative" },

    lootQuantity: { id: "lootQuantity", category: "utility", type: "additive" },
    lootQuality: { id: "lootQuality", category: "utility", type: "additive" },

    goldGain: { id: "goldGain", category: "utility", type: "additive", description: "Bonus d'or gagné." },
    crystalGain: { id: "crystalGain", category: "utility", type: "additive" },
    soulGain: { id: "soulGain", category: "utility", type: "additive" },
    componentGain: { id: "componentGain", category: "utility", type: "additive" },

    pickupRange: { id: "pickupRange", category: "utility", type: "additive" },


    // ============================
    // 🟪 MÉTA
    // ============================

    runXpBonus: { id: "runXpBonus", category: "meta", type: "additive", description: "Bonus d'XP de run." },

    soulXpGain: { id: "soulXpGain", category: "meta", type: "additive", description: "Bonus d'XP d'âme." },
    jobXpGain: { id: "jobXpGain", category: "meta", type: "additive", description: "Bonus d'XP de métier." },

    spiritMax: { id: "spiritMax", category: "meta", type: "additive" },
    spiritRegen: { id: "spiritRegen", category: "meta", type: "additive" },
    spiritCostReduction: { id: "spiritCostReduction", category: "meta", type: "additive" },

    energyMax: { id: "energyMax", category: "meta", type: "additive" },
    energyRegen: { id: "energyRegen", category: "meta", type: "additive" },
};
