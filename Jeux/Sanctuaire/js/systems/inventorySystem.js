/*
   ROUTE : js/systems/inventorySystem.js

   RÔLE :
     Gestion de l’inventaire PERMANENT du personnage actif.
     - Stockage des items persistants (hors-run)
     - Support stackable / non-stackable
     - Sauvegarde via saveActiveCharacter()
     - Utilisé par : marchand, forge, assembleur, pylône, lootScreen
*/

import { player } from "../systems/player/player.js";
import { saveActiveCharacter } from "../core/characterManager.js";

/* ============================================================================
   AJOUTER UN OBJET AU COFFRE
   - Stackable : fusionne les quantités
   - Non-stackable : ajoute une instance
============================================================================ */
export function addToInventory(item) {

    // Stackable (composants, matériaux…)
    if (item.quantity != null) {
        const existing = player.inventory.find(i => i.id === item.id);

        if (existing) {
            existing.quantity += item.quantity;
        } else {
            player.inventory.push({ ...item });
        }

        saveActiveCharacter(); // 🔥 Sauvegarde multi-perso
        return;
    }

    // Non stackable (armes, armures, pièces…)
    player.inventory.push({ ...item });
    saveActiveCharacter(); // 🔥 Sauvegarde multi-perso
}

/* ============================================================================
   RETIRER UN OBJET DU COFFRE
   - Stackable : décrémente quantité
   - Non-stackable : supprime l’instance
============================================================================ */
export function removeFromInventory(itemId, amount = 1) {

    const entry = player.inventory.find(i => i.id === itemId);
    if (!entry) return false;

    // Stackable
    if (entry.quantity != null) {
        entry.quantity -= amount;

        if (entry.quantity <= 0) {
            player.inventory = player.inventory.filter(i => i.id !== itemId);
        }

        saveActiveCharacter(); // 🔥 Sauvegarde multi-perso
        return true;
    }

    // Non stackable
    player.inventory = player.inventory.filter(i => i.id !== itemId);
    saveActiveCharacter(); // 🔥 Sauvegarde multi-perso
    return true;
}

/* ============================================================================
   OBTENIR LA QUANTITÉ POSSÉDÉE (stackables uniquement)
============================================================================ */
export function getInventoryQuantity(itemId) {
    const entry = player.inventory.find(i => i.id === itemId);
    return entry?.quantity ?? 0;
}

/* ============================================================================
   ALIAS (Forge / Assembleur)
============================================================================ */
export const countItem = getInventoryQuantity;
export const removeItem = removeFromInventory;
export const addItemToInventory = addToInventory;

/* ============================================================================
   CONSOMMER UNE INSTANCE PRÉCISE (non-stackable)
============================================================================ */
export function consumeItemInstance(instance) {
    const inv = player.inventory;
    const index = inv.indexOf(instance);

    if (index !== -1) {
        inv.splice(index, 1);
        saveActiveCharacter(); // 🔥 Sauvegarde multi-perso
        return true;
    }

    return false;
}

/* ============================================================================
   OBTENIR L’INVENTAIRE ENTIER (lecture seule)
============================================================================ */
export function getInventory() {
    return player.inventory;
}
