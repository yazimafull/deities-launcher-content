/*
   ROUTE : Jeux/Sanctuaire/js/systems/upgrades.js
   RÔLE :
     Système d’upgrades (style Hades) : applique des buffs persistants à la run.
     Ne modifie JAMAIS directement hp/shield/stats runtime.
     Ajoute uniquement des buffs (Stats Registry) puis déclenche updatePlayerStats().

   EXPORTS :
     - allUpgrades (liste des upgrades disponibles)

   DÉPENDANCES :
     - player (state du joueur)
     - updatePlayerStats() (rebuild complet des stats finales)
     - Stats.js (registre central des stats autorisées)

   NOTES :
     - Toute stat modifiée doit exister dans Stats.js.
     - Tous les upgrades passent par addBuff() → cohérence totale.
*/

import {
    player,
    updatePlayerStats
} from "./player/player.js";

// ================================
// HELPERS
// ================================
function addBuff(id, value, source = "upgrade") {
    player.buffs.
    
    
    ({
        stats: { [id]: value },
        source
    });
}

// ================================
// UPGRADES LIST
// ================================
export const allUpgrades = [

    // =========================
    // ELEMENTS
    // =========================
    {
        id: "fire",
        name: "Feu - brûlure",
        type: "element",
        apply() {
            player.element = "fire";
            updatePlayerStats();
        }
    },

    {
        id: "ice",
        name: "Glace - ralentissement",
        type: "element",
        apply() {
            player.element = "ice";
            updatePlayerStats();
        }
    },

    {
        id: "lightning",
        name: "Foudre - surcharge",
        type: "element",
        apply() {
            player.element = "lightning";
            updatePlayerStats();
        }
    },

    // =========================
    // OFFENSE
    // =========================
    {
        id: "speed_up",
        name: "+20% vitesse",
        type: "stat",
        apply() {
            addBuff("moveSpeed", 0.20);
            updatePlayerStats();
        }
    },

    {
        id: "damage_up",
        name: "+20% dégâts",
        type: "stat",
        apply() {
            addBuff("attackDamage", 0.20);
            updatePlayerStats();
        }
    },

    {
        id: "fire_rate_up",
        name: "+20% attaque speed",
        type: "stat",
        apply() {
            addBuff("attackSpeed", 0.20);
            updatePlayerStats();
        }
    },

    {
        id: "crit_up",
        name: "+10% crit",
        type: "stat",
        apply() {
            addBuff("critChance", 0.10);
            updatePlayerStats();
        }
    },

    // =========================
    // SURVIVAL
    // =========================
    {
        id: "hp_up",
        name: "+20 HP max",
        type: "survival",
        apply() {
            addBuff("maxHp", 20);
            updatePlayerStats();
        }
    },

    {
        id: "shield_up",
        name: "+20 Shield",
        type: "survival",
        apply() {
            addBuff("maxShield", 20);
            updatePlayerStats();
        }
    },

    // =========================
    // NOUVEAUX BUFFS
    // =========================

    {
        id: "hp_regen_up",
        name: "+1 HP regen / sec",
        type: "survival",
        apply() {
            addBuff("regenHp", 1);
            updatePlayerStats();
        }
    },

    {
        id: "shield_regen_up",
        name: "+1 Shield regen / sec",
        type: "survival",
        apply() {
            addBuff("regenShield", 1);
            updatePlayerStats();
        }
    }
];
