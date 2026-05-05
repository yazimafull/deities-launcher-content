/*
   ROUTE : Jeux/Sanctuaire/js/data/trinketProfiles.js

   RÔLE :
     Profils de trinkets (anneaux / amulettes).
     Appliquent des stats UTILITAIRES cohérentes avec stats.js :
       - lootQuantity / lootQuality
       - spiritMax / spiritRegen
       - regenHp / regenShield
       - pickupRange

   EXPORTS :
     TrinketProfiles

   NOTES :
     - Les trinkets ne se combinent pas.
     - Les stats craft/affixes avancées seront ajoutées quand elles existeront dans stats.js.
*/

export const TrinketProfiles = {

    single(item) {
        return item.profile || "genericTrinket";
    },

    combined() {
        console.warn("Les trinkets ne peuvent pas être combinés.");
        return null;
    },

    lootTrinket: {
        id: "lootTrinket",
        role: "loot",
        stats: {
            lootQuantity: 10,
            lootQuality: 10
        }
    },

    spiritTrinket: {
        id: "spiritTrinket",
        role: "spirit",
        stats: {
            spiritMax: 20,
            spiritRegen: 5
        }
    },

    regenTrinket: {
        id: "regenTrinket",
        role: "regeneration",
        stats: {
            regenHp: 5,
            regenShield: 5
        }
    },

    craftTrinket: {
        id: "craftTrinket",
        role: "crafting",
        stats: {
            currencyGain: 5,
            xpGain: 5
        }
    },

    affixTrinket: {
        id: "affixTrinket",
        role: "affixes",
        stats: {
            lootQuality: 5
        }
    },

    genericTrinket: {
        id: "genericTrinket",
        role: "utility",
        stats: {
            pickupRange: 1
        }
    }
};
