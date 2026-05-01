/*
   ROUTE : Jeux/Sanctuaire/js/data/stats.js

   ARBORESCENCE :
     Jeux → Sanctuaire → js → data → stats.js

   RÔLE :
     Registre central et unique de toutes les statistiques du jeu.
     Source de vérité absolue pour : player, ennemis, items, affixes, talents, biomes.

   PRINCIPES :
     - Définition pure : aucune logique, aucun calcul, aucune formule.
     - Chaque stat possède : id, category, type (additive/multiplicative), description.
     - Catégories normalisées : offense / defense / utility / meta.
     - Utilisé par : itemisation, crafting, affixes, calculs de combat, build des stats joueur.
     - Garantit la cohérence globale : aucune stat ne doit exister ailleurs.

   DÉPENDANCES :
     - Aucune (module autonome).
     - Importé par tous les systèmes nécessitant des stats.

   NOTES :
     - Toute nouvelle stat doit être ajoutée ici avant d’être utilisée.
     - Les systèmes ne doivent jamais inventer de stat hors registre.
     - Le type “multiplicative” est appliqué dans playerStatsSystem (calcul externe).
*/


export const Stats = {

    // ============================
    // 🟥 OFFENSIF
    // ============================

    attackDamage: {
        id: "attackDamage",
        category: "offense",
        type: "additive",
        description: "Augmente les dégâts d'attaque."
    },

    attackSpeed: {
        id: "attackSpeed",
        category: "offense",
        type: "multiplicative",
        description: "Augmente la vitesse d'attaque."
    },

    attackRange: {
        id: "attackRange",
        category: "offense",
        type: "additive",
        description: "Portée d'attaque de l'arme."
    },

    attackAngle: {
        id: "attackAngle",
        category: "offense",
        type: "additive",
        description: "Angle du cône d'attaque."
    },

    projectileSpeed: {
        id: "projectileSpeed",
        category: "offense",
        type: "additive",
        description: "Vitesse des projectiles."
    },

    projectileRange: {
        id: "projectileRange",
        category: "offense",
        type: "additive",
        description: "Distance maximale parcourue par les projectiles."
    },

    critChance: {
        id: "critChance",
        category: "offense",
        type: "additive",
        description: "Chance de coup critique."
    },

    critMultiplier: {
        id: "critMultiplier",
        category: "offense",
        type: "multiplicative",
        description: "Multiplicateur de dégâts critiques."
    },

    dotDamage: {
        id: "dotDamage",
        category: "offense",
        type: "additive",
        description: "Augmente les dégâts sur la durée."
    },

    dotDuration: {
        id: "dotDuration",
        category: "offense",
        type: "additive",
        description: "Durée des effets de dégâts sur la durée."
    },

    elementalDamage: {
        id: "elementalDamage",
        category: "offense",
        type: "additive",
        description: "Augmente les dégâts élémentaires."
    },

    // ============================
    // 🟩 DÉFENSIF
    // ============================

    maxHp: {
        id: "maxHp",
        category: "defense",
        type: "additive",
        description: "Points de vie maximum."
    },

    regenHp: {
        id: "regenHp",
        category: "defense",
        type: "additive",
        description: "Régénération de vie par seconde."
    },

    armor: {
        id: "armor",
        category: "defense",
        type: "additive",
        description: "Réduit les dégâts physiques."
    },

    resistance: {
        id: "resistance",
        category: "defense",
        type: "additive",
        description: "Réduit les dégâts élémentaires."
    },

    dodgeChance: {
        id: "dodgeChance",
        category: "defense",
        type: "additive",
        description: "Chance d'esquiver une attaque."
    },

    blockChance: {
        id: "blockChance",
        category: "defense",
        type: "additive",
        description: "Chance de bloquer une attaque."
    },

    blockPower: {
        id: "blockPower",
        category: "defense",
        type: "additive",
        description: "Réduction des dégâts lors d'un blocage."
    },

    shieldMax: {
        id: "shieldMax",
        category: "defense",
        type: "additive",
        description: "Bouclier maximum."
    },

    shieldRegen: {
        id: "shieldRegen",
        category: "defense",
        type: "additive",
        description: "Régénération du bouclier."
    },

    biomeResistance: {
        id: "biomeResistance",
        category: "defense",
        type: "additive",
        description: "Réduit les dégâts du biome (DOT pulsé)."
    },

    // ============================
    // 🟦 UTILITAIRE
    // ============================

    moveSpeed: {
        id: "moveSpeed",
        category: "utility",
        type: "multiplicative",
        description: "Vitesse de déplacement."
    },

    lootQuantity: {
        id: "lootQuantity",
        category: "utility",
        type: "additive",
        description: "Quantité de loot obtenu."
    },

    lootQuality: {
        id: "lootQuality",
        category: "utility",
        type: "additive",
        description: "Qualité du loot obtenu."
    },

    currencyGain: {
        id: "currencyGain",
        category: "utility",
        type: "additive",
        description: "Gain de monnaie augmenté."
    },

    cooldownReduction: {
        id: "cooldownReduction",
        category: "utility",
        type: "multiplicative",
        description: "Réduit les temps de recharge."
    },

    xpGain: {
        id: "xpGain",
        category: "utility",
        type: "additive",
        description: "Augmente l'expérience gagnée."
    },

    pickupRange: {
        id: "pickupRange",
        category: "utility",
        type: "additive",
        description: "Portée de ramassage des objets."
    },

    // ============================
    // 🟪 MÉTA (Équipement)
    // ============================

    spiritCost: {
        id: "spiritCost",
        category: "meta",
        type: "additive",
        description: "Coût d'esprit pour équiper la pièce."
    },

    energyMax: {
        id: "energyMax",
        category: "meta",
        type: "additive",
        description: "Énergie maximale de la pièce."
    },

    energyCost: {
        id: "energyCost",
        category: "meta",
        type: "additive",
        description: "Coût de rapatriement à la mort."
    }
};
