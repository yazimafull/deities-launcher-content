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

    attackDamage: { id: "attackDamage", category: "offense", type: "additive", description: "Dégâts universels." },
    attackDamageMultiplier: { id: "attackDamageMultiplier", category: "offense", type: "multiplicative", description: "Multiplicateur de dégâts." },

    attackSpeed: { id: "attackSpeed", category: "offense", type: "additive", description: "Vitesse d'attaque (flat)." },
    attackSpeedMultiplier: { id: "attackSpeedMultiplier", category: "offense", type: "multiplicative", description: "Multiplicateur de vitesse d'attaque." },

    attackRange: { id: "attackRange", category: "offense", type: "additive", description: "Portée d'attaque." },
    attackRangeMultiplier: { id: "attackRangeMultiplier", category: "offense", type: "multiplicative", description: "Multiplicateur de portée." },

    projectileSpeed: { id: "projectileSpeed", category: "offense", type: "additive", description: "Vitesse des projectiles." },
    projectileSpeedMultiplier: { id: "projectileSpeedMultiplier", category: "offense", type: "multiplicative", description: "Multiplicateur de vitesse des projectiles." },

    projectileRange: { id: "projectileRange", category: "offense", type: "additive", description: "Portée des projectiles." },
    projectileRangeMultiplier: { id: "projectileRangeMultiplier", category: "offense", type: "multiplicative", description: "Multiplicateur de portée des projectiles." },

    projectileCount: { id: "projectileCount", category: "offense", type: "additive", description: "Nombre de projectiles." },
    projectileCountMultiplier: { id: "projectileCountMultiplier", category: "offense", type: "multiplicative", description: "Multiplicateur de projectiles." },

    critChance: { id: "critChance", category: "offense", type: "additive", description: "Chance de critique." },
    critChanceMultiplier: { id: "critChanceMultiplier", category: "offense", type: "multiplicative", description: "Multiplicateur de chance de critique." },

    critMultiplier: { id: "critMultiplier", category: "offense", type: "additive", description: "Multiplicateur critique de base." },
    critMultiplierMultiplier: { id: "critMultiplierMultiplier", category: "offense", type: "multiplicative", description: "Bonus % au multiplicateur critique." },

    elementalDamage: { id: "elementalDamage", category: "offense", type: "additive", description: "Dégâts élémentaires." },
    elementalDamageMultiplier: { id: "elementalDamageMultiplier", category: "offense", type: "multiplicative", description: "Multiplicateur de dégâts élémentaires." },

    dotDamage: { id: "dotDamage", category: "offense", type: "additive", description: "Dégâts sur la durée." },
    dotDamageMultiplier: { id: "dotDamageMultiplier", category: "offense", type: "multiplicative", description: "Multiplicateur de dégâts sur la durée." },

    dotDuration: { id: "dotDuration", category: "offense", type: "additive", description: "Durée des DOT." },
    dotDurationMultiplier: { id: "dotDurationMultiplier", category: "offense", type: "multiplicative", description: "Multiplicateur de durée des DOT." },


    // ============================
    // 🟩 DÉFENSIF
    // ============================

    maxHp: { id: "maxHp", category: "defense", type: "additive", description: "PV max." },
    maxHpMultiplier: { id: "maxHpMultiplier", category: "defense", type: "multiplicative", description: "Multiplicateur de PV max." },

    regenHp: { id: "regenHp", category: "defense", type: "additive", description: "Régénération de vie." },
    regenHpMultiplier: { id: "regenHpMultiplier", category: "defense", type: "multiplicative", description: "Multiplicateur de régénération de vie." },

    maxShield: { id: "maxShield", category: "defense", type: "additive", description: "Bouclier max." },
    maxShieldMultiplier: { id: "maxShieldMultiplier", category: "defense", type: "multiplicative", description: "Multiplicateur de bouclier max." },

    regenShield: { id: "regenShield", category: "defense", type: "additive", description: "Régénération du bouclier." },
    regenShieldMultiplier: { id: "regenShieldMultiplier", category: "defense", type: "multiplicative", description: "Multiplicateur de régénération du bouclier." },

    dodgeChance: { id: "dodgeChance", category: "defense", type: "additive", description: "Esquive." },
    dodgeChanceMultiplier: { id: "dodgeChanceMultiplier", category: "defense", type: "multiplicative", description: "Multiplicateur d'esquive." },

    blockChance: { id: "blockChance", category: "defense", type: "additive", description: "Blocage." },
    blockChanceMultiplier: { id: "blockChanceMultiplier", category: "defense", type: "multiplicative", description: "Multiplicateur de blocage." },

    blockPower: { id: "blockPower", category: "defense", type: "additive", description: "Puissance de blocage." },
    blockPowerMultiplier: { id: "blockPowerMultiplier", category: "defense", type: "multiplicative", description: "Multiplicateur de puissance de blocage." },

    biomeResistance: { id: "biomeResistance", category: "defense", type: "additive", description: "Résistance au biome." },
    biomeResistanceMultiplier: { id: "biomeResistanceMultiplier", category: "defense", type: "multiplicative", description: "Multiplicateur de résistance au biome." },

    physicalResistance: { id: "physicalResistance", category: "defense", type: "additive" },
    physicalResistanceMultiplier: { id: "physicalResistanceMultiplier", category: "defense", type: "multiplicative" },

    fireResistance: { id: "fireResistance", category: "defense", type: "additive" },
    fireResistanceMultiplier: { id: "fireResistanceMultiplier", category: "defense", type: "multiplicative" },

    iceResistance: { id: "iceResistance", category: "defense", type: "additive" },
    iceResistanceMultiplier: { id: "iceResistanceMultiplier", category: "defense", type: "multiplicative" },

    lightningResistance: { id: "lightningResistance", category: "defense", type: "additive" },
    lightningResistanceMultiplier: { id: "lightningResistanceMultiplier", category: "defense", type: "multiplicative" },

    poisonResistance: { id: "poisonResistance", category: "defense", type: "additive" },
    poisonResistanceMultiplier: { id: "poisonResistanceMultiplier", category: "defense", type: "multiplicative" },

    shadowResistance: { id: "shadowResistance", category: "defense", type: "additive" },
    shadowResistanceMultiplier: { id: "shadowResistanceMultiplier", category: "defense", type: "multiplicative" },


    // ============================
    // 🟦 UTILITAIRE
    // ============================

    moveSpeed: { id: "moveSpeed", category: "utility", type: "additive", description: "Vitesse de déplacement." },
    moveSpeedMultiplier: { id: "moveSpeedMultiplier", category: "utility", type: "multiplicative", description: "Multiplicateur de vitesse." },

    lootQuantity: { id: "lootQuantity", category: "utility", type: "additive" },
    lootQuantityMultiplier: { id: "lootQuantityMultiplier", category: "utility", type: "multiplicative" },

    lootQuality: { id: "lootQuality", category: "utility", type: "additive" },
    lootQualityMultiplier: { id: "lootQualityMultiplier", category: "utility", type: "multiplicative" },

    currencyGain: { id: "currencyGain", category: "utility", type: "additive" },
    currencyGainMultiplier: { id: "currencyGainMultiplier", category: "utility", type: "multiplicative" },

    cooldownReduction: { id: "cooldownReduction", category: "utility", type: "additive" },
    cooldownReductionMultiplier: { id: "cooldownReductionMultiplier", category: "utility", type: "multiplicative" },

    xpGain: { id: "xpGain", category: "utility", type: "additive" },
    xpGainMultiplier: { id: "xpGainMultiplier", category: "utility", type: "multiplicative" },

    pickupRange: { id: "pickupRange", category: "utility", type: "additive" },
    pickupRangeMultiplier: { id: "pickupRangeMultiplier", category: "utility", type: "multiplicative" },


    // ============================
    // 🟪 MÉTA
    // ============================

    spiritCost: { id: "spiritCost", category: "meta", type: "additive" },
    spiritCostMultiplier: { id: "spiritCostMultiplier", category: "meta", type: "multiplicative" },

    energyMax: { id: "energyMax", category: "meta", type: "additive" },
    energyMaxMultiplier: { id: "energyMaxMultiplier", category: "meta", type: "multiplicative" },

    energyCost: { id: "energyCost", category: "meta", type: "additive" },
    energyCostMultiplier: { id: "energyCostMultiplier", category: "meta", type: "multiplicative" },
};
