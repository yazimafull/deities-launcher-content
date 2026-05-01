// === ROUTE : /systems/item/disassembler.js
// === RÔLE : Modifier une pièce d’armure sans reconstruire toute l’armure.
// === NOTES :
// - Coût fixe ou dynamique (selon tier).
// - Permet de remplacer une pièce (brassards, gants, bottes…).
// - Permet de reroll un affixe.
// - Permet de retirer une gemme.
// - Permet de retirer un socket (optionnel).
// - Ne reconstruit PAS l’armure complète.

import { LootSystem } from "./lootSystem.js";
import { SocketSystem } from "./socketSystem.js";

export const Disassembler = {

    // === COÛT DE BASE POUR MODIFIER UNE PIÈCE ===
    baseCost: 100000,

    // === CALCUL DU COÛT FINAL ===
    getCost(piece) {
        const tierMult = piece.tier || 1;
        return this.baseCost * tierMult;
    },

    // === VÉRIFIER SI LE JOUEUR PEUT MODIFIER LA PIÈCE ===
    canModify(piece, inventory) {
        const cost = this.getCost(piece);
        return inventory.gold >= cost;
    },

    // === CONSOMMER L’OR ===
    pay(inventory, piece) {
        const cost = this.getCost(piece);
        inventory.gold -= cost;
    },

    // === REMPLACER UNE PIÈCE PAR UNE NOUVELLE ===
    replacePiece(armor, slot, newPiece, inventory) {
        const oldPiece = armor[slot];
        if (!oldPiece) return false;

        if (!this.canModify(oldPiece, inventory)) return false;

        this.pay(inventory, oldPiece);

        armor[slot] = newPiece;
        return true;
    },

    // === REROLL UN AFFIXE SUR UNE PIÈCE ===
    rerollAffix(piece, inventory) {
        if (!this.canModify(piece, inventory)) return false;

        this.pay(inventory, piece);

        const affixKeys = Object.keys(piece.affixes || {});
        if (affixKeys.length === 0) return false;

        // Choisir un affixe à reroll
        const target = affixKeys[Math.floor(Math.random() * affixKeys.length)];

        // Reroll dans la même catégorie
        const category = this.getAffixCategory(target);
        const newAffix = LootSystem.rollAffixFromCategory(category);

        if (!newAffix) return false;

        piece.affixes[target] = newAffix.value;
        return true;
    },

    // === TROUVER LA CATÉGORIE D’UN AFFIXE ===
    getAffixCategory(affixId) {
        // On parcourt toutes les catégories d’affixes
        for (const cat in LootSystem.Affixes) {
            if (LootSystem.Affixes[cat][affixId]) return cat;
        }
        return "utility"; // fallback
    },

    // === RETIRER UNE GEMME D’UN SOCKET ===
    removeGem(piece, index, inventory) {
        if (!piece.gems || !piece.gems[index]) return false;

        if (!this.canModify(piece, inventory)) return false;

        this.pay(inventory, piece);

        piece.gems.splice(index, 1);
        return true;
    },

    // === RETIRER UN SOCKET (optionnel) ===
    removeSocket(piece, inventory) {
        if (!piece.sockets || piece.sockets <= 0) return false;

        if (!this.canModify(piece, inventory)) return false;

        this.pay(inventory, piece);

        piece.sockets--;
        if (piece.gems.length > piece.sockets) {
            piece.gems.length = piece.sockets;
        }

        return true;
    },
};
