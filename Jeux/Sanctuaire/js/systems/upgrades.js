/*
   ROUTE : Jeux/Sanctuaire/js/systems/upgrades.js
   ARBORESCENCE :
     Jeux → Sanctuaire → js → systems → upgrades.js

   RÔLE :
     SYSTEME D’UPGRADES (STYLE HADES)

   PRINCIPLE :
     - Modifie uniquement le PLAYER STATE
     - Ajoute des modifiers (buffs)
     - Peut modifier des flags (element, etc.)
     - Déclenche rebuild stats via updatePlayerStats()
     - Ne calcule AUCUNE stat directement

   DÉPENDANCES :
     - player runtime system
     - playerStatsSystem (via updatePlayerStats)
*/

import {
    player,
    updatePlayerStats
} from "./player/player.js";

// ================================
// HELPERS
// ================================
function addBuff(id, value, source = "upgrade") {
    player.buffs.push({
        id,
        value,
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
    // OFFENSE MODIFIERS
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

            player.maxHp += 20;
            player.hp += 20;

            if (player.hp > player.maxHp) {
                player.hp = player.maxHp;
            }

            updatePlayerStats();
        }
    }
];