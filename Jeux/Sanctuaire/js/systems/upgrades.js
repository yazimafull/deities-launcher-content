 // systems/upgrades.js

import { playerStats } from "./player.js";

// ================================
// UPGRADES LIST
// ================================
export const allUpgrades = [

    // ========================
    // ELEMENTS
    // ========================
    {
        id: "fire",
        name: "Feu - brûlure",
        type: "element",
        apply() {
            playerStats.element = "fire";
        }
    },
    {
        id: "ice",
        name: "Glace - ralentissement",
        type: "element",
        apply() {
            playerStats.element = "ice";
        }
    },
    {
        id: "lightning",
        name: "Foudre - surcharge",
        type: "element",
        apply() {
            playerStats.element = "lightning";
        }
    },

    // ========================
    // STATS OFFENSIVES
    // ========================
    {
        id: "speed_up",
        name: "+20% vitesse",
        type: "stat",
        apply() {
            playerStats.speed *= 1.2;
        }
    },
    {
        id: "damage_up",
        name: "+20% dégâts",
        type: "stat",
        apply() {
            playerStats.damage *= 1.2;
        }
    },
    {
        id: "fire_rate_up",
        name: "+20% cadence de tir",
        type: "stat",
        apply() {
            playerStats.fireRate *= 0.8;
        }
    },
    {
        id: "crit_up",
        name: "+10% crit",
        type: "stat",
        apply() {
            playerStats.critChance += 0.1;
        }
    },

    // ========================
    // SURVIVABILITÉ
    // ========================
    {
        id: "hp_up",
        name: "+20 HP max",
        type: "survival",
        apply() {
            playerStats.maxHp += 20;
            playerStats.hp = Math.min(
                playerStats.hp + 20,
                playerStats.maxHp
            );
        }
    }
];