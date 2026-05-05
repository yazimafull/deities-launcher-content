/*
   ROUTE : Jeux/Sanctuaire/js/data/gemProfiles.js

   RÔLE :
     Amplification des stats de base via les sockets.
     Compatible 100% avec stats.js :
       - maxHpMultiplier
       - maxShieldMultiplier
       - damageMultiplier
       - moveSpeedMultiplier
       - regenHpMultiplier
       - regenShieldMultiplier
       - spiritMax

   EXPORTS :
     GemProfiles

   NOTES :
     - Aucune stat inventée.
     - Les gemmes hybrides appliquent plusieurs stats existantes.
*/

export const GemProfiles = {

    single(item) {
        return item.profile || "baseStatGem";
    },

    combined() {
        console.warn("Les gemmes ne peuvent pas être combinées.");
        return null;
    },

    hpGem: {
        id: "hpGem",
        stats: { maxHpMultiplier: 0.10 }
    },

    armorGem: {
        id: "armorGem",
        stats: { physicalResistance: 0.10 }
    },

    shieldGem: {
        id: "shieldGem",
        stats: { maxShieldMultiplier: 0.10 }
    },

    damageGem: {
        id: "damageGem",
        stats: { damageMultiplier: 0.12 }
    },

    speedGem: {
        id: "speedGem",
        stats: { moveSpeedMultiplier: 0.05 }
    },

    spiritGem: {
        id: "spiritGem",
        stats: { spiritMax: 10 }
    },

    regenGem: {
        id: "regenGem",
        stats: { regenHpMultiplier: 0.15 }
    },

    shieldRegenGem: {
        id: "shieldRegenGem",
        stats: { regenShieldMultiplier: 0.15 }
    },

    hybridGem: {
        id: "hybridGem",
        stats: {
            maxHpMultiplier: 0.06,
            physicalResistance: 0.06
        }
    },

    offensiveHybridGem: {
        id: "offensiveHybridGem",
        stats: {
            damageMultiplier: 0.06,
            moveSpeedMultiplier: 0.06
        }
    },

    defensiveHybridGem: {
        id: "defensiveHybridGem",
        stats: {
            maxShieldMultiplier: 0.08,
            regenHpMultiplier: 0.08
        }
    }
};
