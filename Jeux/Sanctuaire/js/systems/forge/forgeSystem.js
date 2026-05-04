/*
   ROUTE : js/systems/forge/forgeSystem.js
   RÔLE :
     - Logique de craft : vérification des composants, consommation, création d’items.
     - Utilise les recettes définies dans forgeRecipes.js.
     - Ajoute l’item crafté dans l’inventaire permanent (coffre).

   EXPORTS :
     - canCraft(recipeId)
     - craftItem(recipeId)

   DÉPENDANCES :
     - forgeRecipes.js (DATA)
     - inventorySystem.js (countItem, removeItem, addItemToInventory)

   NOTES :
     - Aucun accès à l’UI ici : logique pure.
     - Les items craftés sont des objets complets (armes, armures, pièces…).
*/

import { ForgeRecipes } from "./forgeRecipes.js";
import { countItem, removeItem, addItemToInventory } from "../inventorySystem.js";


// ======================================================
// VÉRIFIER SI LE JOUEUR POSSÈDE LES COMPOSANTS
// ======================================================
export function canCraft(recipeId) {

    const recipe = ForgeRecipes[recipeId];
    if (!recipe) return false;

    for (const req of recipe.cost) {
        const have = countItem(req.id);
        if (have < req.qty) return false;
    }

    return true;
}


// ======================================================
// CRAFTER L’ITEM
// ======================================================
export function craftItem(recipeId) {

    const recipe = ForgeRecipes[recipeId];
    if (!recipe) return null;

    // Vérification
    if (!canCraft(recipeId)) return null;

    // Consommer les composants
    for (const req of recipe.cost) {
        removeItem(req.id, req.qty);
    }

    // Créer l’item crafté
    const item = {
        id: crypto.randomUUID(),
        name: recipe.name,
        type: recipe.result.type,
        slot: recipe.result.slot,
        stats: { ...recipe.result.stats },
        affixes: { ...recipe.result.affixes }
    };



    // Ajouter dans le coffre
    addItemToInventory(item);

    return item;
}
