// systems/upgrades.js

import { playerStats } from "./player.js";

export const allUpgrades = [
    {
        name: "Feu - brûlure",
        apply() { playerStats.element = "fire"; }
    },
    {
        name: "Glace - ralentissement",
        apply() { playerStats.element = "ice"; }
    },
    {
        name: "Foudre - surcharge",
        apply() { playerStats.element = "lightning"; }
    },
    {
        name: "+20% vitesse",
        apply() { playerStats.speed *= 1.2; }
    },
    {
        name: "+20% dégâts",
        apply() { playerStats.damage *= 1.2; }
    },
    {
        name: "+20% cadence de tir",
        apply() { playerStats.fireRate *= 0.8; }
    },
    {
        name: "+10% crit",
        apply() { playerStats.critChance += 0.1; }
    },
    {
        name: "+20 HP max",
        apply() {
            playerStats.maxHp += 20;
            playerStats.hp = Math.min(playerStats.hp + 20, playerStats.maxHp);
        }
    }
];
