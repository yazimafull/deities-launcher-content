// systems/levelup.js

import { GameState, setState } from "../core/state.js";
import { player } from "./player.js";

export const chosenUpgrades = [];

// Pool d'upgrades
const ALL_UPGRADES = [
    {
        name: "Vitesse +10%",
        apply: () => {
            if (!player.moveSpeedMultiplier) player.moveSpeedMultiplier = 1;
            player.moveSpeedMultiplier += 0.1;
        }
    },
    {
        name: "Dégâts +20%",
        apply: () => {
            player.damage *= 1.2;
        }
    },
    {
        name: "HP max +20",
        apply: () => {
            player.maxHp += 20;
            player.hp += 20;
        }
    },
    {
        name: "Crit +5%",
        apply: () => {
            if (!player.critChance) player.critChance = 0;
            player.critChance += 0.05;
        }
    },
    {
        name: "Bouclier +10",
        apply: () => {
            if (!player.shieldPhysical) player.shieldPhysical = 0;
            player.shieldPhysical += 10;
        }
    }
];

let panel = null;
let container = null;

// --------------------------------------------------
// INIT UI
// --------------------------------------------------
function initLevelUpUI() {
    panel = document.getElementById("levelup-menu");
    container = document.getElementById("upgrade-choices");

    if (!panel || !container) {
        console.warn("[levelup] UI manquante (#levelup-menu / #upgrade-choices)");
    }
}

document.addEventListener("DOMContentLoaded", initLevelUpUI);

// --------------------------------------------------
// OUVERTURE DU MENU
// --------------------------------------------------
export function openLevelUpMenu() {
    if (!panel || !container) return;

    setState(GameState.LEVELUP);

    panel.classList.remove("hidden");
    container.innerHTML = "";

    const options = pickRandomUpgrades(3);

    options.forEach(up => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = up.name;

        btn.onclick = () => {
            up.apply();
            chosenUpgrades.push(up);

            panel.classList.add("hidden");
            setState(GameState.PLAYING);
        };

        container.appendChild(btn);
    });
}

// --------------------------------------------------
// UTILITAIRE
// --------------------------------------------------
function pickRandomUpgrades(n) {
    const pool = [...ALL_UPGRADES];
    const result = [];

    while (result.length < n && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        result.push(pool.splice(idx, 1)[0]);
    }

    return result;
}