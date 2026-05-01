// === ROUTE : /systems/item/profiles/weaponProfiles.js
// === RÔLE : Définit les 4 profils finaux d’armes possibles dans le jeu.
// === EXPORTS : WeaponProfiles
// === DÉPENDANCES : Aucune (module autonome).
// === NOTES :
// - Les profils finaux ne dépendent pas des composants, seulement du type d’association.
// - Utilisé par ItemProfiles.resolve() et ItemProfiles.resolveCombined().
// - Structure simple, scalable, et compatible avec toutes les combinaisons définies.
// - Ne jamais ajouter de profil “oneHand” : n’existe pas dans ton système.

export const WeaponProfiles = {

    // Profil d’un item seul (ex : une arme 1 main seule)
    single(item) {
        // Une arme seule n’a pas de profil combiné → elle garde son propre profil
        return item.profile || "oneHandedWeapon";
    },

    // Profil combiné de deux armes
    combined(itemA, itemB) {

        // 1) Armes à deux mains → impossible de combiner, mais si ça arrive, on force le profil
        if (itemA.category === "twoHanded" || itemB.category === "twoHanded") {
            return "twoHandedWeapon";
        }

        // 2) Arme libre + arme libre
        if (itemA.category === "free" && itemB.category === "free") {
            return "dualOneHand";
        }

        // 3) Arme libre OU baguette + bouclier
        if (
            (itemA.category === "free" && itemB.category === "shield") ||
            (itemB.category === "free" && itemA.category === "shield") ||
            (itemA.category === "wand" && itemB.category === "shield") ||
            (itemB.category === "wand" && itemA.category === "shield")
        ) {
            return "oneHandShield";
        }

        // 4) Arme libre OU baguette + tome
        if (
            (itemA.category === "free" && itemB.category === "tome") ||
            (itemB.category === "free" && itemA.category === "tome") ||
            (itemA.category === "wand" && itemB.category === "tome") ||
            (itemB.category === "wand" && itemA.category === "tome")
        ) {
            return "oneHandTome";
        }

        // Si aucune règle ne correspond
        console.warn("Combinaison d’armes non gérée :", itemA.id, itemB.id);
        return null;
    },

    // === PROFILS FINAUX ===

    twoHandedWeapon: {
        id: "twoHandedWeapon",
        canBlock: false,
        canParry: true,
        canDodge: true,
        dodgePenalty: 0,
    },

    dualOneHand: {
        id: "dualOneHand",
        canBlock: false,
        canParry: true,
        canDodge: true,
        dodgePenalty: 0,
    },

    oneHandShield: {
        id: "oneHandShield",
        canBlock: true,
        canParry: true,
        canDodge: true,
        dodgePenalty: 15,
    },

    oneHandTome: {
        id: "oneHandTome",
        canBlock: false,
        canParry: true,
        canDodge: true,
        dodgePenalty: 0,
    },
};
