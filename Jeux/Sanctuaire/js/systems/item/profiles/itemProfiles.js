// === ROUTE : /systems/item/profiles/itemProfiles.js
// === RÔLE : Router central des profils d’items.
// === EXPORTS : ItemProfiles
// === NOTES :
// - Chaque type d’item a son fichier de profils dédié.
// - Ce fichier ne contient AUCUNE règle spécifique.
// - Il délègue aux bons profils selon item.type.

/*import { WeaponProfiles } from "./weaponProfiles.js";
import { ArmorProfiles } from "./armorProfiles.js";
import { TalismanProfiles } from "./talismanProfiles.js";
import { TrinketProfiles } from "./trinketProfiles.js";
//import { AffixStoneProfiles } from "./affixStoneProfiles.js";

export const ItemProfiles = {

    // Profil d’un item seul
    resolve(item) {
        switch (item.type) {
            case "weapon": return WeaponProfiles.single(item);
            case "armor": return ArmorProfiles.single(item);
            case "talisman": return TalismanProfiles.single(item);
            case "trinket": return TrinketProfiles.single(item);
            //case "affixStone": return AffixStoneProfiles.single(item);
            default:
                console.warn("Type d’item inconnu :", item.type);
                return null;
        }
    },

    // Profil d’une combinaison de deux items
    resolveCombined(itemA, itemB) {
        // Les armes se combinent entre elles
        if (itemA.type === "weapon" && itemB.type === "weapon") {
            return WeaponProfiles.combined(itemA, itemB);
        }

        // Les talismans peuvent se combiner entre eux (si tu veux)
        if (itemA.type === "talisman" && itemB.type === "talisman") {
            return TalismanProfiles.combined(itemA, itemB);
        }

        // Les pierres d’affixes peuvent se combiner avec n’importe quoi
        /*if (itemA.type === "affixStone" || itemB.type === "affixStone") {
            return AffixStoneProfiles.apply(itemA, itemB);
        }

        // Les trinkets (ring/amulette) ne se combinent pas entre eux
        if (itemA.type === "trinket" || itemB.type === "trinket") {
            return null;
        }

        // Les armures ne se combinent pas entre elles
        if (itemA.type === "armor" || itemB.type === "armor") {
            return null;
        }

        console.warn("Combinaison non gérée :", itemA.type, itemB.type);
        return null;
    }
};*/


// === ITEM PROFILES TEMPORAIREMENT DÉSACTIVÉ ===
// Ce fichier sera réactivé quand les profils d’items seront créés.

export const ItemProfiles = {
    resolve() { return null; },
    resolveCombined() { return null; }
};
