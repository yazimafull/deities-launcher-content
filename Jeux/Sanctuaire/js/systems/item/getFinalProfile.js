// === ROUTE : /systems/item/getFinalProfile.js
// === RÔLE : Détermine le profil final d’un item combiné.
// === EXPORTS : getFinalProfile
// === DÉPENDANCES : itemProfiles (profils spécifiques par type d’item)
// === NOTES :
// - Fonction générique : valable pour armes, armures, talismans, trinkets, etc.
// - Les règles spécifiques (ex : dualOneHand, oneHandShield) sont définies
//   dans /systems/item/profiles/*Profiles.js
// - Cette fonction lit simplement les catégories et renvoie le profil final.

import { ItemProfiles } from "./profiles/itemProfiles.js";

export function getFinalProfile(itemA, itemB) {

    // Si un seul item → son profil direct
    if (!itemB) {
        return ItemProfiles.resolve(itemA);
    }

    // Si les deux items existent → profil combiné
    return ItemProfiles.resolveCombined(itemA, itemB);
}

