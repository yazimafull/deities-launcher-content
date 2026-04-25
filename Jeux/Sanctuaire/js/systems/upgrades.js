// systems/upgrades.js

import { getPlayer } from "../core/engine.js";

export const allUpgrades = [
    {
        id: "fire",
        name: "Feu - brûlure",
        type: "element",
        apply() {
            const p = getPlayer();
            if (p) p.element = "fire";
        }
    },
    {
        id: "ice",
        name: "Glace - ralentissement",
        type: "element",
        apply() {
            const p = getPlayer();
            if (p) p.element = "ice";
        }
    },
    {
        id: "lightning",
        name: "Foudre - surcharge",
        type: "element",
        apply() {
            const p = getPlayer();
            if (p) p.element = "lightning";
        }
    },
    {
        id: "speed_up",
        name: "+20% vitesse",
        type: "stat",
        apply() {
            const p = getPlayer();
            if (p) p.speed *= 1.2;
        }
    },
    {
        id: "damage_up",
        name: "+20% dégâts",
        type: "stat",
        apply() {
            const p = getPlayer();
            if (p) p.damage *= 1.2;
        }
    },
    {
        id: "fire_rate_up",
        name: "+20% cadence de tir",
        type: "stat",
        apply() {
            const p = getPlayer();
            if (p) p.fireRate *= 0.8;
        }
    },
    {
        id: "crit_up",
        name: "+10% crit",
        type: "stat",
        apply() {
            const p = getPlayer();
            if (p) p.critChance += 0.1;
        }
    },
    {
        id: "hp_up",
        name: "+20 HP max",
        type: "survival",
        apply() {
            const p = getPlayer();
            if (!p) return;
            p.maxHp += 20;
            p.hp = Math.min(p.hp + 20, p.maxHp);
        }
    }
];
