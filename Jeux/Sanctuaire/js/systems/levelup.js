// systems/levelup.js

import { GameState, setState } from "../core/state.js";
import { allUpgrades } from "./upgrades.js";
import { addUpgradeToPanel } from "./upgradePanel.js";

// ================================
// UI STATE
// ================================
let panel = null;
let container = null;
let initialized = false;

// ================================
// INIT UI
// ================================
function initLevelUpUI() {
    panel = document.getElementById("levelup-menu");
    container = document.getElementById("upgrade-choices");

    if (!panel || !container) {
        console.warn("[levelup] UI manquante (#levelup-menu / #upgrade-choices)");
        return;
    }

    initialized = true;
}

document.addEventListener("DOMContentLoaded", initLevelUpUI);

// ================================
// OUVERTURE DU MENU LEVEL UP
// ================================
export function openLevelUpMenu() {
    if (!initialized) initLevelUpUI();
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
            try {
                up.apply();              // applique l'upgrade
                addUpgradeToPanel(up);   // affiche dans HUD
            } catch (e) {
                console.error("[levelup] erreur upgrade:", e);
            }

            panel.classList.add("hidden");
            setState(GameState.PLAYING);
        };

        container.appendChild(btn);
    });
}

// ================================
// UTILITAIRE RANDOM UPGRADES
// ================================
function pickRandomUpgrades(n) {
    const pool = [...allUpgrades];
    const result = [];

    while (result.length < n && pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        result.push(pool.splice(idx, 1)[0]);
    }

    return result;
}