// === ROUTE : /systems/item/socketSystem.js
// === RÔLE : Gestion des sockets, ajout, coût, recyclage, auto-combine.
// === NOTES :
// - Les sockets sont un état de l’item (item.sockets).
// - Les gemmes sont insérées dans item.gems.
// - Le coût dépend de la qualité et du tier.
// - Le recyclage donne SocketDust → auto-combine → SocketCore.

export const SocketSystem = {

    // === MULTIPLICATEURS DE QUALITÉ ===
    qualityMultiplier: {
        white: 1,
        blue: 2,
        yellow: 4,
        purple: 8,
        orange: 16,
    },

    // === MULTIPLICATEURS DE TIER ===
    tierMultiplier: {
        1: 1,
        2: 2,
        3: 4,
        4: 8,
        5: 16,
    },

    // === COÛT DE BASE POUR AJOUTER UN SOCKET ===
    baseCost: 1, // 1 SocketCore avant multiplicateurs

    // === CALCUL DU COÛT FINAL ===
    getSocketCost(item) {
        const q = this.qualityMultiplier[item.quality] || 1;
        const t = this.tierMultiplier[item.tier] || 1;
        return this.baseCost * q * t;
    },

    // === AJOUTER UN SOCKET À UN ITEM ===
    addSocket(item, inventory) {
        if (!item.canHaveSocket) {
            console.warn("Cet item ne peut pas avoir de socket :", item.id);
            return false;
        }

        const cost = this.getSocketCost(item);

        if (inventory.SocketCore < cost) {
            console.warn("Pas assez de SocketCore :", inventory.SocketCore, "/", cost);
            return false;
        }

        // Consommer les SocketCore
        inventory.SocketCore -= cost;

        // Ajouter le socket
        item.sockets = (item.sockets || 0) + 1;

        // Initialiser le tableau de gemmes si nécessaire
        if (!item.gems) item.gems = [];

        return true;
    },

    // === INSÉRER UNE GEMME DANS UN SOCKET ===
    insertGem(item, gem) {
        if (!item.sockets || item.sockets <= 0) {
            console.warn("Aucun socket disponible sur cet item :", item.id);
            return false;
        }

        if (!item.gems) item.gems = [];

        if (item.gems.length >= item.sockets) {
            console.warn("Tous les sockets sont déjà remplis :", item.id);
            return false;
        }

        item.gems.push(gem);
        return true;
    },

    // === RECYCLAGE : OBTENIR DES SOCKET DUST ===
    recycleItem(item, inventory) {
        if (!inventory.SocketDust) inventory.SocketDust = 0;

        if (item.sockets && item.sockets > 0) {
            inventory.SocketDust += item.sockets; // 1 socket = 1 dust
        }

        // Auto-combine
        this.autoCombineDust(inventory);
    },

    // === AUTO-COMBINE : 10 DUST → 1 CORE ===
    autoCombineDust(inventory) {
        if (!inventory.SocketDust) return;

        const cores = Math.floor(inventory.SocketDust / 10);
        if (cores > 0) {
            inventory.SocketDust -= cores * 10;
            inventory.SocketCore = (inventory.SocketCore || 0) + cores;
        }
    },

    // === CHANCE DE LOOTER UN ITEM AVEC SOCKET ===
    rollLootSocket(item, chance = 5) {
        // chance = % de drop avec socket
        const roll = Math.random() * 100;
        if (roll < chance) {
            item.sockets = 1;
            item.gems = [];
        }
        return item;
    },
};
