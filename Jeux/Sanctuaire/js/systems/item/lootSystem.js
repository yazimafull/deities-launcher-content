/*
   ROUTE : Jeux/Sanctuaire/js/systems/item/lootSystem.js

   RÔLE :
     Générer un item brut :
       - type (weapon / armor / trinket)
       - qualité (white → orange)
       - affixes (pondérés selon le type d’item)
       - tiers d’affixes
       - sockets
       - structure compatible avec ItemProfiles + playerStatsSystem

   PRINCIPES :
     - Ne connaît PAS les profils (weaponProfiles, armorProfiles…)
     - Ne connaît PAS les stats finales (playerStatsSystem s’en charge)
     - Ne connaît PAS les gemmes (socketSystem s’en charge)
     - Produit un item minimal, propre, cohérent
*/

import { Affixes } from "../../data/affixes.js";
import { SocketSystem } from "./socketSystem.js";

export const LootSystem = {

    // ================================
    // QUALITÉ
    // ================================
    qualityTable: [
        { q: "white",  weight: 50 },
        { q: "blue",   weight: 30 },
        { q: "yellow", weight: 15 },
        { q: "purple", weight: 4  },
        { q: "orange", weight: 1  },
    ],

    rollQuality() {
        const total = this.qualityTable.reduce((a, b) => a + b.weight, 0);
        let r = Math.random() * total;

        for (const entry of this.qualityTable) {
            if (r < entry.weight) return entry.q;
            r -= entry.weight;
        }
        return "white";
    },

    // ================================
    // TYPES D’ITEMS
    // ================================
    itemTypes: [
        { type: "weapon",  weight: 40 },
        { type: "armor",   weight: 35 },
        { type: "trinket", weight: 25 },
    ],

    rollType() {
        const total = this.itemTypes.reduce((a, b) => a + b.weight, 0);
        let r = Math.random() * total;

        for (const entry of this.itemTypes) {
            if (r < entry.weight) return entry.type;
            r -= entry.weight;
        }
        return "weapon";
    },

    // ================================
    // NOMBRE D’AFFIXES PAR QUALITÉ
    // ================================
    rollAffixCount(quality) {
        switch (quality) {
            case "white":  return 0;
            case "blue":   return 1;
            case "yellow": return 2;
            case "purple": return 3;
            case "orange": return 4;
        }
        return 0;
    },

    // ================================
    // POIDS DES CATÉGORIES PAR TYPE (OPTION C)
    // ================================
    categoryWeights: {
        weapon: [
            { cat: "offense", weight: 70 },
            { cat: "utility", weight: 30 },
        ],
        armor: [
            { cat: "defense", weight: 70 },
            { cat: "utility", weight: 30 },
        ],
        trinket: [
            { cat: "utility", weight: 60 },
            { cat: "meta",    weight: 40 },
        ],
    },

    rollCategoryForType(type) {
        const table = this.categoryWeights[type];
        if (!table) return "utility";

        const total = table.reduce((a, b) => a + b.weight, 0);
        let r = Math.random() * total;

        for (const entry of table) {
            if (r < entry.weight) return entry.cat;
            r -= entry.weight;
        }
        return table[0].cat;
    },

    // ================================
    // POOL D’AFFIXES PAR CATÉGORIE
    // ================================
    getAffixPool(category) {
        return Object.values(Affixes).filter(a => a.category === category);
    },

    // ================================
    // TIRAGE D’UN AFFIXE
    // ================================
    rollAffix(category) {
        const pool = this.getAffixPool(category);
        if (!pool.length) return null;

        const affix = pool[Math.floor(Math.random() * pool.length)];

        const tier = this.rollTier(affix);
        const value = this.rollTierValue(affix, tier);

        return {
            id: affix.id,
            value,
        };
    },

    // ================================
    // TIER
    // ================================
    rollTier(affix) {
        if (!affix.tiers || affix.tiers.length === 0) return null;

        const index = Math.floor(Math.random() * affix.tiers.length);
        return affix.tiers[index];
    },

    rollTierValue(affix, tier) {
        if (!tier) return 0;

        const min = tier.min;
        const max = tier.max;

        if (affix.rollType === "percent") {
            return (Math.random() * (max - min) + min);
        }

        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // ================================
    // SOCKETS
    // ================================
    rollSocket(item) {
        const chance = 5; // 5%
        return SocketSystem.rollLootSocket(item, chance);
    },

    // ================================
    // GÉNÉRATION D’UN ITEM COMPLET
    // ================================
    generateItem(tier = 1) {

        const type = this.rollType();
        const quality = this.rollQuality();
        const affixCount = this.rollAffixCount(quality);

        const item = {
            id: crypto.randomUUID(),
            type,
            tier,
            quality,
            baseStats: {},
            affixes: {},
            sockets: 0,
            gems: [],
            profile: null,
        };

        // Affixes pondérés selon le type
        for (let i = 0; i < affixCount; i++) {
            const category = this.rollCategoryForType(type);
            const affix = this.rollAffix(category);

            if (affix) {
                item.affixes[affix.id] = affix.value;
            }
        }

        // Sockets
        this.rollSocket(item);

        return item;
    },
};
