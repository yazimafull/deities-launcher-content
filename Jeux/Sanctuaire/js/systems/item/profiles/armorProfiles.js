/*
   ROUTE : Jeux/Sanctuaire/js/data/armorProfiles.js

   RÔLE :
     Profils d’armure (heavy / light / enchanted).
     Appliquent des stats DEFENSIVES cohérentes avec stats.js :
       - résistances élémentaires
       - moveSpeedMultiplier
       - dodgeChance (additif)
       - maxShieldMultiplier

   EXPORTS :
     ArmorProfiles

   NOTES :
     - Les armures ne se combinent pas.
     - Aucune stat fantôme : uniquement celles présentes dans stats.js.
*/

export const ArmorProfiles = {

    single(item) {
        return item.profile || "lightArmor";
    },

    combined() {
        console.warn("Les armures ne peuvent pas être combinées.");
        return null;
    },

    heavyArmor: {
        id: "heavyArmor",
        role: "tank",
        stats: {
            dodgeChance: -20,
            moveSpeedMultiplier: -0.10,
            physicalResistance: 0.20,
            fireResistance: 0.05,
            iceResistance: 0.05,
            lightningResistance: 0.05,
            shadowResistance: 0.05,
            poisonResistance: 0.05
        }
    },

    lightArmor: {
        id: "lightArmor",
        role: "balanced",
        stats: {
            physicalResistance: 0.10,
            fireResistance: 0.10,
            iceResistance: 0.10,
            lightningResistance: 0.10,
            shadowResistance: 0.10,
            poisonResistance: 0.10
        }
    },

    enchantedArmor: {
        id: "enchantedArmor",
        role: "magic",
        stats: {
            moveSpeedMultiplier: 0.05,
            physicalResistance: 0.05,
            fireResistance: 0.20,
            iceResistance: 0.20,
            lightningResistance: 0.20,
            shadowResistance: 0.20,
            poisonResistance: 0.20,
            maxShieldMultiplier: 0.15
        }
    }
};
