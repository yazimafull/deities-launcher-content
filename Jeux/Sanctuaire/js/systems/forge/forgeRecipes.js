/*
   ROUTE : js/systems/forge/forgeRecipes.js
   RÔLE :
     - Définition des recettes de forge (DATA PURE, aucune logique).
     - Chaque recette décrit :
         • un identifiant unique (id)
         • un nom affiché dans l’UI
         • une liste de composants requis (cost[])
         • un item résultant (result)
     - Les IDs des composants correspondent EXACTEMENT aux items vendus par le marchand.

   NOTES :
     - Les recettes produisent des “pièces” (weaponPiece, armorPiece)
       qui seront ensuite assemblées via l’Assembleur.
     - Les stats définies ici sont des valeurs brutes ajoutées à l’item crafté.
*/

export const ForgeRecipes = {

    /* ======================================================
       ARMES (3 pièces : blade, hilt, core)
    ====================================================== */

    basicSword: {
        id: "basicSword",
        name: "Épée simple",
        cost: [
            { id: "iron_fragment", qty: 3 },
            { id: "wood_piece", qty: 1 }
        ],
        result: {
            type: "weaponPiece",
            slot: "blade",
            affixes: { critChance: 0.05 },
            stats: {
                attackDamage: 6,
                attackSpeed: 0.05
            }
        }
    },

    mysticBlade: {
        id: "mysticBlade",
        name: "Lame Mystique",
        cost: [
            { id: "iron_fragment", qty: 2 },
            { id: "mystic_shard", qty: 1 }
        ],
        result: {
            type: "weaponPiece",
            slot: "blade",
            affixes: { critChance: 0.05 },
            stats: {
                attackDamage: 10,
                critChance: 0.05,
                element: "arcane"
            }
        }
    },

    arcFrame: {
        id: "arcFrame",
        name: "Cadre d’arc",
        cost: [
            { id: "wood_piece", qty: 3 },
            { id: "iron_fragment", qty: 1 }
        ],
        result: {
            type: "weaponPiece",
            slot: "frame",
            affixes: { critChance: 0.05 },
            stats: {
                attackRange: 120,
                projectileRange: 300
            }
        }
    },


    arcString: {
        id: "arcString",
        name: "Corde d’arc",
        cost: [
            { id: "wood_piece", qty: 1 }
        ],
        result: {
            type: "weaponPiece",
            slot: "string",
            affixes: { critChance: 0.05 },
            stats: {
                attackSpeed: 0.10,
                projectileSpeed: 350
            }
        }
    },

    arcTip: {
        id: "arcTip",
        name: "Embout d’arc",
        cost: [
            { id: "iron_fragment", qty: 2 }
        ],
        result: {
            type: "weaponPiece",
            slot: "blade",
            affixes: { critChance: 0.05 },
            stats: {
                attackDamage: 4,
                projectileCount: 1
            }
        }
    },


    /* ======================================================
       ARMURES (6 pièces : helmet, chest, gloves, boots, pants, shoulders)
    ====================================================== */

    armor_helmet: {
        id: "armor_helmet",
        name: "Casque brut",
        cost: [
            { id: "iron_fragment", qty: 2 },
            { id: "wood_piece", qty: 1 }
        ],
        result: {
            id: "armor_helmet",
            type: "armorPiece",
            slot: "helmet",
            affixes: { critChance: 0.05 },
            stats: {
                armor: 3,
                maxHp: 20
            }
        }
    },

    armor_chest: {
        id: "armor_chest",
        name: "Plastron brut",
        cost: [
            { id: "iron_fragment", qty: 3 },
            { id: "wood_piece", qty: 2 }
        ],
        result: {
            id: "armor_chest",
            type: "armorPiece",
            slot: "chest",
            affixes: { critChance: 0.05 },
            stats: {
                armor: 6,
                maxHp: 40
            }
        }
    },

    armor_legs: {
        id: "armor_legs",
        name: "Jambières brutes",
        cost: [
            { id: "iron_fragment", qty: 2 },
            { id: "wood_piece", qty: 2 }
        ],
        result: {
            id: "armor_legs",
            type: "armorPiece",
            slot: "pants",
            affixes: { critChance: 0.05 },
            stats: {
                armor: 4,
                maxHp: 30
            }
        }
    },

    /* ======================================================
       NOUVEAU : BOTTES AVEC MOVE SPEED
    ====================================================== */

    armor_boots: {
        id: "armor_boots",
        name: "Bottes brutes",
        cost: [
            { id: "iron_fragment", qty: 1 },
            { id: "wood_piece", qty: 1 }
        ],
        result: {
            id: "armor_boots",
            type: "armorPiece",
            slot: "boots",
            affixes: { critChance: 0.05 },
            stats: {
                armor: 2,
                maxHp: 10,
                moveSpeed: 120   // ⭐ vitesse de déplacement
            }
        }
    },

    /* ======================================================
       TU PEUX AJOUTER PLUS TARD :
       armor_gloves, armor_shoulders
    ====================================================== */

};

