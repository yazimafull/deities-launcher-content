/*
   ROUTE : Jeux/Sanctuaire/js/systems/item/profiles/itemProfiles.js

   RÔLE :
     Router central des profils d’items.
     Délègue automatiquement vers :
       - weaponProfiles
       - armorProfiles
       - trinketProfiles
       - gemProfiles (si un jour tu veux les router aussi)

   PRINCIPES :
     - AUCUNE logique métier ici.
     - Ce fichier ne fait que rediriger vers le bon profil.
     - Toute la logique est dans les fichiers dédiés.
*/

import { WeaponProfiles } from "./weaponProfiles.js";
import { ArmorProfiles } from "./armorProfiles.js";
import { TrinketProfiles } from "./trinketProfiles.js";
// import { TalismanProfiles } from "./talismanProfiles.js"; // pas utilisé actuellement
// import { GemProfiles } from "./gemProfiles.js";           // optionnel si tu veux router les gemmes

export const ItemProfiles = {

    /*
       Profil d’un item seul
       - item.type détermine quel fichier de profils est utilisé
    */
    resolve(item) {
        switch (item.type) {

            case "weapon":
                return WeaponProfiles.single(item);

            case "armor":
                return ArmorProfiles.single(item);

            case "trinket":
                return TrinketProfiles.single(item);

            // case "talisman":
            //     return TalismanProfiles.single(item);

            // case "gem":
            //     return GemProfiles.single(item);

            default:
                console.warn("Type d’item inconnu :", item.type);
                return null;
        }
    },

    /*
       Profil d’une combinaison de deux items
       - Seules les armes peuvent se combiner dans ton système actuel
    */
    resolveCombined(itemA, itemB) {

        // Armes → combinaison autorisée
        if (itemA.type === "weapon" && itemB.type === "weapon") {
            return WeaponProfiles.combined(itemA, itemB);
        }

        // Trinkets → jamais combinables
        if (itemA.type === "trinket" || itemB.type === "trinket") {
            return null;
        }

        // Armures → jamais combinables
        if (itemA.type === "armor" || itemB.type === "armor") {
            return null;
        }

        // Talismans (si un jour tu les actives)
        // if (itemA.type === "talisman" && itemB.type === "talisman") {
        //     return TalismanProfiles.combined(itemA, itemB);
        // }

        console.warn("Combinaison non gérée :", itemA.type, itemB.type);
        return null;
    }
};
