/*
   ROUTE : Jeux/Sanctuaire/js/systems/upgrades.js
   RÔLE :
     Système d’upgrades (style Hades) : applique des buffs persistants à la run.
     Ne modifie JAMAIS directement hp/shield/stats runtime.
     Ajoute uniquement des buffs (Stats Registry) puis déclenche updatePlayerStats().

   IMPORTANT :
     - Le moteur lit l’élément depuis player.equipment.weapon.element
       → donc les upgrades élémentaires doivent modifier l’arme, PAS player.element.
*/

import {
    player,
    updatePlayerStats
} from "./player/player.js";

import { applyPlayerRuntimeStats } from "./player/playerRuntimeSystem.js";


// ======================================================
// CENTRALISATION : une seule fonction pour tout recalculer
// ======================================================
function recalcPlayer() {
    updatePlayerStats();
    applyPlayerRuntimeStats(player);
}


// ================================
// HELPERS
// ================================
function addBuff(id, value, source = "upgrade") {
    player.buffs.push({
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

            if (player.equipment?.weapon) {
                player.equipment.weapon.element = "fire";
            }

            recalcPlayer();
        }
    },

    {
        id: "ice",
        name: "Glace - ralentissement",
        type: "element",
        apply() {

            if (player.equipment?.weapon) {
                player.equipment.weapon.element = "ice";
            }

            recalcPlayer();
        }
    },

    {
        id: "lightning",
        name: "Foudre - surcharge",
        type: "element",
        apply() {

            if (player.equipment?.weapon) {
                player.equipment.weapon.element = "lightning";
            }

            recalcPlayer();
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
            addBuff("moveSpeed", 20);
            recalcPlayer();
        }
    },

    {
        id: "damage_up",
        name: "+3 dégâts",
        type: "stat",
        apply() {
            addBuff("damage", 3);
            recalcPlayer();
        }
    },

    {
        id: "fire_rate_up",
        name: "+50% attaque speed",
        type: "stat",
        apply() {
            addBuff("attackSpeed", 0.5);
            recalcPlayer();
        }
    },

    {
        id: "crit_up",
        name: "+10% crit",
        type: "stat",
        apply() {
            addBuff("critChance", 0.10);
            recalcPlayer();
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
            updatePlayerStats(); // runtime pas nécessaire
        }
    },

    {
        id: "shield_up",
        name: "+5 Shield",
        type: "survival",
        apply() {
            addBuff("maxShield", 5);
            updatePlayerStats(); // runtime pas nécessaire
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
            updatePlayerStats(); // runtime pas nécessaire
        }
    },

    {
        id: "shield_regen_up",
        name: "+1 Shield regen / sec",
        type: "survival",
        apply() {
            addBuff("regenShield", 1);
            updatePlayerStats(); // runtime pas nécessaire
        }
    }
];
