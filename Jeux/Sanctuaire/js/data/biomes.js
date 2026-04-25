// js/data/biomes.js
/* 
   ROUTE : js/data/biomes.js
   RÔLE : Registre central des biomes (source de vérité unique)
   EXPORTS : Biomes
   DÉPENDANCES : import dynamique vers biome_foret.js et biome_wip.js
   NOTES : Standardise le chargement + démarrage des biomes via runManager
*/

export const Biomes = {
    foret: {
        id: "foret",
        label: "Forêt Mourante",

        // Charge le module du biome Forêt
        load: () => import("../world/biome_foret.js"),

        // Démarre le biome Forêt
        start: (module, config) => {
            if (typeof module.initBiomeForet === "function") {
                module.initBiomeForet(config);
            } else {
                console.error("[Biomes.foret] initBiomeForet() introuvable dans biome_foret.js");
            }
        }
    },

    ruines: {
        id: "ruines",
        label: "Ruines Oubliées",

        // Charge le module WIP
        load: () => import("../world/biome_wip.js"),

        // Démarre le biome Ruines
        start: (module, config) => {
            if (typeof module.initBiomeWIP === "function") {
                module.initBiomeWIP("ruines", config);
            } else {
                console.error("[Biomes.ruines] initBiomeWIP() introuvable dans biome_wip.js");
            }
        }
    },

    abysses: {
        id: "abysses",
        label: "Abysses",

        // Charge le module WIP
        load: () => import("../world/biome_wip.js"),

        // Démarre le biome Abysses
        start: (module, config) => {
            if (typeof module.initBiomeWIP === "function") {
                module.initBiomeWIP("abysses", config);
            } else {
                console.error("[Biomes.abysses] initBiomeWIP() introuvable dans biome_wip.js");
            }
        }
    }
};
