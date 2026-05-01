/*
   ROUTE : Jeux/Sanctuaire/js/systems/item/lootSystem.js
   ARBORESCENCE :
     Jeux → Sanctuaire → js → systems → item → lootSystem.js

   RÔLE :
     Générer un item brut : type, qualité, tier, affixes, sockets, gemmes.
     Ne connaît pas les profils (weapon/armor/trinket/talisman).
     Ne connaît pas stats.data (affixes.js gère les valeurs).
     Ne connaît pas gemProfiles (socketSystem gère les gemmes).
     Produit un item minimal, cohérent, prêt pour getFinalProfile().

   DÉPENDANCES :
     - data/affixes.js (pool d’affixes par catégorie)
     - systems/item/socketSystem.js (gestion des sockets)
*/

import { Affixes } from "../../data/affixes.js";
import { SocketSystem } from "./socketSystem.js";

export const LootSystem = {

    // ================================
    // TABLE DE QUALITÉ
    // ================================
    qualityTable: [
        { q: "white",  weight: 50 },
        { q: "blue",   weight: 30 },
        { q: "yellow", weight: 15 },
        { q: "purple", weight: 4  },
        { q: "orange", weight: 1  },
    ],

    // ================================
    // TABLE DES TYPES D’ITEMS
    // ================================
    itemTypes: [
        { type: "weapon",   weight: 30 },
        { type: "armor",    weight: 30 },
        { type: "trinket",  weight: 25 },
        { type: "talisman", weight: 15 },
    ],

    // ================================
    // ROLL QUALITÉ
    // ================================
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
    // ROLL TYPE
    // ================================
    rollType() {
        const total = this.itemTypes.reduce((a, b) => a + b.weight, 0);
        let r = Math.random() * total;

        for (const entry of this.itemTypes) {
            if (r < entry.weight) return entry.type;
            r -= entry.weight;
        }
        return "armor";
    },

    // ================================
    // ROLL NOMBRE D’AFFIXES
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
    // ROLL AFFIXES
    // ================================
    rollAffixes(count) {
        const result = {};

        for (let i = 0; i < count; i++) {
            const category = this.rollAffixCategory();
            const affix = this.rollAffixFromCategory(category);

            if (affix) {
                result[affix.id] = affix.value;
            }
        }

        return result;
    },

    // ================================
    // ROLL CATÉGORIE
    // ================================
    rollAffixCategory() {
        const categories = ["offense", "defense", "utility", "transcendent", "skill"];
        return categories[Math.floor(Math.random() * categories.length)];
    },

    // ================================
    // ROLL AFFIXE DANS UNE CATÉGORIE
    // ================================
    rollAffixFromCategory(category) {
        const pool = Affixes[category];
        if (!pool) return null;

        const keys = Object.keys(pool);
        const id = keys[Math.floor(Math.random() * keys.length)];

        const affix = pool[id];
        return {
            id,
            value: this.rollAffixValue(affix),
        };
    },

    // ================================
    // ROLL VALEUR D’AFFIXE
    // ================================
    rollAffixValue(affix) {
        const min = affix.min ?? 1;
        const max = affix.max ?? 5;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // ================================
    // ROLL SOCKET
    // ================================
    rollSocket(item) {
        const chance = 5; // 5% de chance
        return SocketSystem.rollLootSocket(item, chance);
    },

    // ================================
    // GÉNÉRER UN ITEM BRUT
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
            baseStats: {},      // rempli plus tard via profiles
            affixes: this.rollAffixes(affixCount),
            sockets: 0,
            gems: [],
            profile: null,      // appliqué par getFinalProfile()
        };

        this.rollSocket(item);

        return item;
    },
};
