// === ROUTE : /systems/merchant/merchantLevels.js
// === RÔLE : Gestion du niveau du marchand, XP, stock, qualité, reset.
// === NOTES :
// - Le marchand gagne de l'XP via les actions du joueur.
// - Chaque niveau améliore la qualité du stock.
// - Le stock est régénéré à chaque niveau ou via un reset payant.
// - Le marchand ne vend que des items bruts (lootSystem génère).

import { LootSystem } from "../item/lootSystem.js";

export const Merchant = {

    level: 1,
    xp: 0,
    xpToNext: 100,
    stock: [],
    maxStock: 8,

    // === TABLE DE QUALITÉ PAR NIVEAU ===
    qualityUnlock: {
        1: ["white", "blue"],
        2: ["white", "blue", "yellow"],
        3: ["white", "blue", "yellow", "purple"],
        4: ["white", "blue", "yellow", "purple", "orange"],
    },

    // === XP GAGNÉE PAR ACTION ===
    xpGain: {
        buy: 5,
        sell: 2,
        recycle: 1,
        runClear: 20,
    },

    // === AJOUTER DE L’XP AU MARCHAND ===
    addXP(amount) {
        this.xp += amount;

        while (this.xp >= this.xpToNext) {
            this.xp -= this.xpToNext;
            this.levelUp();
        }
    },

    // === PASSAGE DE NIVEAU ===
    levelUp() {
        this.level++;
        this.xpToNext = Math.floor(this.xpToNext * 1.4); // scaling XP
        this.refreshStock();
    },

    // === GÉNÉRER LE STOCK DU MARCHAND ===
    refreshStock() {
        this.stock = [];

        const allowedQualities = this.qualityUnlock[this.level] || ["white"];

        for (let i = 0; i < this.maxStock; i++) {
            const item = LootSystem.generateItem(this.level);

            // Forcer la qualité dans les limites du marchand
            if (!allowedQualities.includes(item.quality)) {
                item.quality = allowedQualities[
                    Math.floor(Math.random() * allowedQualities.length)
                ];
            }

            this.stock.push(item);
        }
    },

    // === ACHETER UN ITEM ===
    buyItem(index, inventory) {
        const item = this.stock[index];
        if (!item) return false;

        const cost = this.getItemCost(item);

        if (inventory.gold < cost) return false;

        inventory.gold -= cost;
        inventory.items.push(item);

        this.addXP(this.xpGain.buy);

        // Retirer l’item du stock
        this.stock.splice(index, 1);

        return true;
    },

    // === VENDRE UN ITEM AU MARCHAND ===
    sellItem(item, inventory) {
        const value = this.getSellValue(item);

        inventory.gold += value;
        this.addXP(this.xpGain.sell);

        return true;
    },

    // === RECYCLAGE ===
    recycleItem(item, inventory) {
        // Le recyclage est géré par socketSystem, ici on donne juste l’XP
        this.addXP(this.xpGain.recycle);
    },

    // === RESET PAYANT DU STOCK ===
    forceReset(inventory) {
        const cost = 5000 * this.level;

        if (inventory.gold < cost) return false;

        inventory.gold -= cost;
        this.refreshStock();

        return true;
    },

    // === PRIX D’UN ITEM ===
    getItemCost(item) {
        const base = 100 * item.tier;

        const qualityMult = {
            white: 1,
            blue: 2,
            yellow: 4,
            purple: 8,
            orange: 16,
        };

        return base * (qualityMult[item.quality] || 1);
    },

    // === VALEUR DE REVENTE ===
    getSellValue(item) {
        return Math.floor(this.getItemCost(item) * 0.25);
    },
};
