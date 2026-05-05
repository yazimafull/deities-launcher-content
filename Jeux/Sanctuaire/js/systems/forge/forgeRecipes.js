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
     - Les stats définies ici doivent correspondre à stats.js.
*/

export const ForgeRecipes = {

    /* ======================================================
       ARMES (3 pièces : blade, frame, string)
       Stats autorisées :
         - damage
         - attackSpeed
         - attackRange
         - projectileSpeed
         - projectileRange
         - projectileCount
         - critChance
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
            element: "physical",
            affixes: { critChance: 1 }, // +1% crit
            stats: {
                damage: 6,
                attackSpeed: 0.05 // +5% vitesse d’attaque
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
            element: "ice",
            affixes: { critChance: 2 }, // +2% crit
            stats: {
                damage: 10,
                attackSpeed: 0.05, // +5%
                attackRange: 20    // +20 portée
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
            affixes: {},
            stats: {
                attackRange: 120,     // portée d’attaque
                projectileRange: 300  // portée du projectile
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
            affixes: {},
            stats: {
                attackSpeed: 0.10,    // +10% vitesse d’attaque
                projectileSpeed: 350  // vitesse du projectile
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
            element: "fire",
            affixes: {},
            stats: {
                damage: 4,
                projectileCount: 1
            }
        }
    },


    /* ======================================================
       ARMURES (6 pièces : helmet, chest, gloves, boots, pants, shoulders)
       Stats autorisées :
         - maxHp
         - maxShield
         - regenHp
         - regenShield
         - moveSpeed
         - resistances (physical/fire/ice/lightning/poison/shadow)
         - dodgeChance / parryChance / blockChance / blockPower
    ====================================================== */

    armor_helmet: {
        id: "armor_helmet",
        name: "Casque brut",
        cost: [
            { id: "iron_fragment", qty: 2 },
            { id: "wood_piece", qty: 1 }
        ],
        result: {
            type: "armorPiece",
            slot: "helmet",
            affixes: {},
            stats: {
                maxHp: 20,
                physicalResistance: 0.02 // +2%
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
            type: "armorPiece",
            slot: "chest",
            affixes: {},
            stats: {
                maxHp: 40,
                moveSpeed: 20, 
                physicalResistance: 0.04
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
            type: "armorPiece",
            slot: "pants",
            affixes: {},
            stats: {
                maxHp: 30,
                moveSpeed: 20,
                physicalResistance: 0.03
            }
        }
    },

    armor_boots: {
        id: "armor_boots",
        name: "Bottes brutes",
        cost: [
            { id: "iron_fragment", qty: 1 },
            { id: "wood_piece", qty: 1 }
        ],
        result: {
            type: "armorPiece",
            slot: "boots",
            affixes: {},
            stats: {
                maxHp: 10,
                moveSpeed: 40
            }
        }
    },

    // Tu pourras ajouter :
    // armor_gloves
    // armor_shoulders
};
