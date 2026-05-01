// data/weaponData.js
/*
   ROUTE : Jeux/Sanctuaire/js/data/weaponData.js
   RÔLE : Déclare les types d’armes de base et les stats qu’elles PEUVENT recevoir (true/false par stat).
   EXPORTS : WeaponData
   DÉPENDANCES : Stats (Jeux/Sanctuaire/js/data/stats.js)
   NOTES :
   - La liste des stats reflète EXACTEMENT Stats (source de vérité).
   - Les armes libres peuvent avoir TOUTES les stats (offense, defense, utility, meta).
   - Le bouclier est le seul à pouvoir avoir blockChance et blockPower.
   - Le tome est le seul, avec le bouclier, à pouvoir avoir shieldMax et shieldRegen.
   - La baguette ne peut PAS avoir blockChance, blockPower, shieldMax, shieldRegen.
*/

export const WeaponData = {

    // ============================
    // ARMES LIBRES (1 MAIN)
    // → peuvent avoir TOUTES les stats
    // ============================

    sword: {
        id: "sword",
        label: "Épée",
        type: "free",
        allowedStats: {
            // OFFENSE
            attackDamage: true,
            attackSpeed: true,
            attackRange: true,
            attackAngle: true,
            projectileSpeed: true,
            projectileRange: true,
            critChance: true,
            critMultiplier: true,
            dotDamage: true,
            dotDuration: true,
            elementalDamage: true,

            // DEFENSE
            maxHp: true,
            regenHp: true,
            armor: true,
            resistance: true,
            dodgeChance: true,
            blockChance: true,
            blockPower: true,
            shieldMax: true,
            shieldRegen: true,
            biomeResistance: true,

            // UTILITY
            moveSpeed: true,
            lootQuantity: true,
            lootQuality: true,
            currencyGain: true,
            cooldownReduction: true,
            xpGain: true,
            pickupRange: true,

            // META
            spiritCost: true,
            energyMax: true,
            energyCost: true,
        },
    },

    mace: {
        id: "mace",
        label: "Masse",
        type: "free",
        allowedStats: {
            attackDamage: true,
            attackSpeed: true,
            attackRange: true,
            attackAngle: true,
            projectileSpeed: true,
            projectileRange: true,
            critChance: true,
            critMultiplier: true,
            dotDamage: true,
            dotDuration: true,
            elementalDamage: true,

            maxHp: true,
            regenHp: true,
            armor: true,
            resistance: true,
            dodgeChance: true,
            blockChance: true,
            blockPower: true,
            shieldMax: true,
            shieldRegen: true,
            biomeResistance: true,

            moveSpeed: true,
            lootQuantity: true,
            lootQuality: true,
            currencyGain: true,
            cooldownReduction: true,
            xpGain: true,
            pickupRange: true,

            spiritCost: true,
            energyMax: true,
            energyCost: true,
        },
    },

    axe: {
        id: "axe",
        label: "Hache",
        type: "free",
        allowedStats: {
            attackDamage: true,
            attackSpeed: true,
            attackRange: true,
            attackAngle: true,
            projectileSpeed: true,
            projectileRange: true,
            critChance: true,
            critMultiplier: true,
            dotDamage: true,
            dotDuration: true,
            elementalDamage: true,

            maxHp: true,
            regenHp: true,
            armor: true,
            resistance: true,
            dodgeChance: true,
            blockChance: true,
            blockPower: true,
            shieldMax: true,
            shieldRegen: true,
            biomeResistance: true,

            moveSpeed: true,
            lootQuantity: true,
            lootQuality: true,
            currencyGain: true,
            cooldownReduction: true,
            xpGain: true,
            pickupRange: true,

            spiritCost: true,
            energyMax: true,
            energyCost: true,
        },
    },

    dagger: {
        id: "dagger",
        label: "Dague",
        type: "free",
        allowedStats: {
            attackDamage: true,
            attackSpeed: true,
            attackRange: true,
            attackAngle: true,
            projectileSpeed: true,
            projectileRange: true,
            critChance: true,
            critMultiplier: true,
            dotDamage: true,
            dotDuration: true,
            elementalDamage: true,

            maxHp: true,
            regenHp: true,
            armor: true,
            resistance: true,
            dodgeChance: true,
            blockChance: true,
            blockPower: true,
            shieldMax: true,
            shieldRegen: true,
            biomeResistance: true,

            moveSpeed: true,
            lootQuantity: true,
            lootQuality: true,
            currencyGain: true,
            cooldownReduction: true,
            xpGain: true,
            pickupRange: true,

            spiritCost: true,
            energyMax: true,
            energyCost: true,
        },
    },

    // ============================
    // BAGUETTE (MAIN DROITE)
    // → hybride, mais PAS de block / shield
    // ============================

    wand: {
        id: "wand",
        label: "Baguette",
        type: "rightOnly",
        allowedStats: {
            // OFFENSE
            attackDamage: true,
            attackSpeed: true,
            attackRange: true,
            attackAngle: true,
            projectileSpeed: true,
            projectileRange: true,
            critChance: true,
            critMultiplier: true,
            dotDamage: true,
            dotDuration: true,
            elementalDamage: true,

            // DEFENSE
            maxHp: true,
            regenHp: true,
            armor: true,
            resistance: true,
            dodgeChance: true,
            blockChance: false,
            blockPower: false,
            shieldMax: false,
            shieldRegen: false,
            biomeResistance: true,

            // UTILITY
            moveSpeed: true,
            lootQuantity: true,
            lootQuality: true,
            currencyGain: true,
            cooldownReduction: true,
            xpGain: true,
            pickupRange: true,

            // META
            spiritCost: true,
            energyMax: true,
            energyCost: true,
        },
    },

    // ============================
    // BOUCLIER (MAIN GAUCHE)
    // → seul endroit pour blockChance / blockPower
    // ============================

    shield: {
        id: "shield",
        label: "Bouclier",
        type: "leftOnly",
        allowedStats: {
            // OFFENSE
            attackDamage: false,
            attackSpeed: false,
            attackRange: false,
            attackAngle: false,
            projectileSpeed: false,
            projectileRange: false,
            critChance: false,
            critMultiplier: false,
            dotDamage: false,
            dotDuration: false,
            elementalDamage: false,

            // DEFENSE
            maxHp: true,
            regenHp: true,
            armor: true,
            resistance: true,
            dodgeChance: true,
            blockChance: true,
            blockPower: true,
            shieldMax: true,
            shieldRegen: true,
            biomeResistance: true,

            // UTILITY
            moveSpeed: false,
            lootQuantity: false,
            lootQuality: false,
            currencyGain: false,
            cooldownReduction: false,
            xpGain: false,
            pickupRange: false,

            // META
            spiritCost: true,
            energyMax: true,
            energyCost: true,
        },
    },

    // ============================
    // TOME (MAIN GAUCHE)
    // → shield d’absorption uniquement (shieldMax / shieldRegen)
    // ============================

    tome: {
        id: "tome",
        label: "Grimoire",
        type: "leftOnly",
        allowedStats: {
            // OFFENSE
            attackDamage: false,
            attackSpeed: false,
            attackRange: false,
            attackAngle: false,
            projectileSpeed: false,
            projectileRange: false,
            critChance: false,
            critMultiplier: false,
            dotDamage: false,
            dotDuration: false,
            elementalDamage: false,

            // DEFENSE
            maxHp: false,
            regenHp: false,
            armor: false,
            resistance: false,
            dodgeChance: false,
            blockChance: false,
            blockPower: false,
            shieldMax: true,
            shieldRegen: true,
            biomeResistance: false,

            // UTILITY
            moveSpeed: false,
            lootQuantity: false,
            lootQuality: false,
            currencyGain: false,
            cooldownReduction: false,
            xpGain: false,
            pickupRange: false,

            // META
            spiritCost: true,
            energyMax: true,
            energyCost: true,
        },
    },

    // ============================
    // ARMES À DEUX MAINS (EXEMPLES)
    // ============================

    greatsword: {
        id: "greatsword",
        label: "Épée à deux mains",
        type: "twoHanded",
        allowedStats: {
            attackDamage: true,
            attackSpeed: true,
            attackRange: true,
            attackAngle: true,
            projectileSpeed: false,
            projectileRange: false,
            critChance: true,
            critMultiplier: true,
            dotDamage: true,
            dotDuration: true,
            elementalDamage: true,

            maxHp: true,
            regenHp: true,
            armor: true,
            resistance: true,
            dodgeChance: true,
            blockChance: false,
            blockPower: false,
            shieldMax: false,
            shieldRegen: false,
            biomeResistance: true,

            moveSpeed: true,
            lootQuantity: true,
            lootQuality: true,
            currencyGain: true,
            cooldownReduction: true,
            xpGain: true,
            pickupRange: true,

            spiritCost: true,
            energyMax: true,
            energyCost: true,
        },
    },

    bow: {
        id: "bow",
        label: "Arc",
        type: "twoHanded",
        allowedStats: {
            attackDamage: true,
            attackSpeed: true,
            attackRange: true,
            attackAngle: false,
            projectileSpeed: true,
            projectileRange: true,
            critChance: true,
            critMultiplier: true,
            dotDamage: true,
            dotDuration: true,
            elementalDamage: true,

            maxHp: true,
            regenHp: true,
            armor: true,
            resistance: true,
            dodgeChance: true,
            blockChance: false,
            blockPower: false,
            shieldMax: false,
            shieldRegen: false,
            biomeResistance: true,

            moveSpeed: true,
            lootQuantity: true,
            lootQuality: true,
            currencyGain: true,
            cooldownReduction: true,
            xpGain: true,
            pickupRange: true,

            spiritCost: true,
            energyMax: true,
            energyCost: true,
        },
    },

    staff: {
        id: "staff",
        label: "Bâton",
        type: "twoHanded",
        allowedStats: {
            attackDamage: true,
            attackSpeed: true,
            attackRange: true,
            attackAngle: true,
            projectileSpeed: true,
            projectileRange: true,
            critChance: true,
            critMultiplier: true,
            dotDamage: true,
            dotDuration: true,
            elementalDamage: true,

            maxHp: true,
            regenHp: true,
            armor: true,
            resistance: true,
            dodgeChance: true,
            blockChance: false,
            blockPower: false,
            shieldMax: false,
            shieldRegen: false,
            biomeResistance: true,

            moveSpeed: true,
            lootQuantity: true,
            lootQuality: true,
            currencyGain: true,
            cooldownReduction: true,
            xpGain: true,
            pickupRange: true,

            spiritCost: true,
            energyMax: true,
            energyCost: true,
        },
    },
};
