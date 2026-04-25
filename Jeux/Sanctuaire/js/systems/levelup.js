// systems/levelup.js

import { GameState, setState } from "../core/state.js";
import { allUpgrades } from "./upgrades.js";
import { addUpgradeToPanel } from "./upgradePanel.js";

// ================================
// STATE
// ================================
let panel = null;
let container = null;
let initialized = false;

// ================================
// INIT UI (SAFE)
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

// lazy init safe
function ensureInit() {
    if (!initialized) initLevelUpUI();
    return panel && container;
}

// ================================
// OPEN LEVEL UP MENU
// ================================
export function openLevelUpMenu() {

    if (!ensureInit()) return;

    setState(GameState.LEVELUP);

    panel.classList.remove("hidden");
    container.innerHTML = "";

    const options = pickRandomUpgrades(3);

    for (const up of options) {

        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = up.name;

        btn.onclick = () => {

            try {
                up.apply?.();
                addUpgradeToPanel?.(up);
            } catch (err) {
                console.error("[levelup] upgrade error:", err);
            }

            closeLevelUpMenu();
        };

        container.appendChild(btn);
    }
}

// ================================
// CLOSE MENU
// ================================
export function closeLevelUpMenu() {

    if (!ensureInit()) return;

    panel.classList.add("hidden");
    setState(GameState.PLAYING);
}

// ================================
// RANDOM PICK SYSTEM
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