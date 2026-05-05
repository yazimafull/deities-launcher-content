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

            // 🔥 CORRECTION :
            // Avant : player.element = "fire"; (inutile, jamais lu par le moteur)
            // Maintenant : on modifie l’ARME, car le runtime lit weapon.element.
            if (player.equipment?.weapon) {
                player.equipment.weapon.element = "fire";
            }

            updatePlayerStats();
            applyPlayerRuntimeStats(player);
        }
    },

    {
        id: "ice",
        name: "Glace - ralentissement",
        type: "element",
        apply() {

            // ❄️ Même correction que Fire
            if (player.equipment?.weapon) {
                player.equipment.weapon.element = "ice";
            }

            updatePlayerStats();
            applyPlayerRuntimeStats(player);
        }
    },

    {
        id: "lightning",
        name: "Foudre - surcharge",
        type: "element",
        apply() {

            // ⚡ Même correction que Fire
            if (player.equipment?.weapon) {
                player.equipment.weapon.element = "lightning";
            }

            updatePlayerStats();
            applyPlayerRuntimeStats(player);
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
            updatePlayerStats();
        }
    },

    {
        id: "damage_up",
        name: "+2 dégâts",
        type: "stat",
        apply() {
            addBuff("damage", 2);
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
