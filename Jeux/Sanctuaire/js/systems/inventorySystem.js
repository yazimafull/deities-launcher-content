/*
   ROUTE : js/systems/inventorySystem.js
   RÔLE : Gestion de l'inventaire PERMANENT du joueur (coffre du sanctuaire)
   EXPORTS : addToInventory, removeFromInventory, getInventoryQuantity, loadInventory
   DÉPENDANCES : ../data/playerBase.js (playerBase)
   NOTES :
     - Utilise playerBase.inventory comme coffre unique.
     - Supporte les items stackables (quantity) et non-stackables.
     - Sauvegarde automatique dans localStorage.
     - Utilisé par : marchand, forge, assembleur, pylône, récompenses.
*/

import { basePlayer as player } from "../data/playerBase.js";


// ===============================
// SAUVEGARDE INVENTAIRE
// ===============================
function saveInventory() {
    try {
        localStorage.setItem("playerInventory", JSON.stringify(player.inventory));
    } catch (e) {
        console.warn("[Inventory] Impossible de sauvegarder l'inventaire", e);
    }
}


// ===============================
// CHARGEMENT INVENTAIRE
// ===============================
export function loadInventory() {
    try {
        const raw = localStorage.getItem("playerInventory");
        if (raw) {
            player.inventory = JSON.parse(raw);
        }
    } catch (e) {
        console.warn("[Inventory] Impossible de charger l'inventaire", e);
    }
}


// ===============================
// AJOUTER UN OBJET AU COFFRE
// ===============================
export function addToInventory(item) {

    // Items stackables (composants, matériaux…)
    if (item.quantity != null) {
        const existing = player.inventory.find(i => i.id === item.id);

        if (existing) {
            existing.quantity += item.quantity;
        } else {
            player.inventory.
            
            
            ({ ...item });
        }

        saveInventory();
        return;
    }

    // Items non stackables (armes, armures, pièces…)
    player.inventory.push({ ...item });
    saveInventory();
}



// ===============================
// RETIRER UN OBJET DU COFFRE
// ===============================
export function removeFromInventory(itemId, amount = 1) {

    const entry = player.inventory.find(i => i.id === itemId);
    if (!entry) return false;

    // Stackable
    if (entry.quantity != null) {
        entry.quantity -= amount;

        if (entry.quantity <= 0) {
            player.inventory = player.inventory.filter(i => i.id !== itemId);
        }

        saveInventory();
        return true;
    }

    // Non stackable
    player.inventory = player.inventory.filter(i => i.id !== itemId);
    saveInventory();
    return true;
}

// ===============================
// OBTENIR LA QUANTITÉ POSSÉDÉE
// ===============================
export function getInventoryQuantity(itemId) {
    const entry = player.inventory.find(i => i.id === itemId);
    return entry?.quantity ?? 0;
}
// ===============================
// COMPTEUR (alias plus lisible pour la Forge)
// ===============================
export function countItem(itemId) {
    return getInventoryQuantity(itemId);
}
// ===============================
// SUPPRESSION (alias Forge)
// ===============================
export function removeItem(itemId, qty = 1) {
    return removeFromInventory(itemId, qty);
}
// ===============================
// CONSOMMER UNE INSTANCE PRÉCISE
// ===============================
export function consumeItemInstance(instance) {
    const inv = player.inventory;
    const index = inv.indexOf(instance);

    if (index !== -1) {
        inv.splice(index, 1);
        saveInventory();
        return true;
    }

    return false;
}

// ===============================
// AJOUT (alias Forge)
// ===============================
export function addItemToInventory(item) {
    return addToInventory(item);
}
// ===============================
// OBTENIR L'INVENTAIRE ENTIER (lecture seule)
// ===============================
export function getInventory() {
    return player.inventory;
}
