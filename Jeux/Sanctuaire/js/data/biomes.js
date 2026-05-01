﻿// js/data/biomes.js
/*
   ROUTE : Jeux/Sanctuaire/js/data/biomes.js
   RÔLE : Registre central des biomes (source de vérité unique pour chargement + paramètres)
   EXPORTS : Biomes
   DÉPENDANCES : imports dynamiques vers biome_foret.js et biome_wip.js
   NOTES :
   - Définit les paramètres de run : objectiveMax, eliteMin, eliteMax
   - Chaque biome fournit load() + start() pour runManager
   - Utilisé par runManager, biomeSpawner et engine
   - Les modules de biome doivent exposer initBiomeForet() ou initBiomeWIP()
*/


export const Biomes = {
    foret: {
        id: "foret",
        label: "Forêt Mourante",

        // === AJOUT : paramètres de run ===
        objectiveMax: 50,
        eliteMin: 4,
        eliteMax: 6,

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

        // === AJOUT : paramètres de run ===
        objectiveMax: 75,
        eliteMin: 5,
        eliteMax: 8,

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

        // === AJOUT : paramètres de run ===
        objectiveMax: 100,
        eliteMin: 6,
        eliteMax: 10,

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
