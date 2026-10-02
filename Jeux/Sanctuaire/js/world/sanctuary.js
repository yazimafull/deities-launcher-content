// Jeux/Sanctuaire/js/world/sanctuary.js
// ROLE : Gestion complète du Sanctuaire (UI, header, zones, panels, scaling)

import { goToMenu } from "../core/main.js";
import { startRun } from "../core/gameLoop.js";
import { startRunManager } from "../core/runManager.js";

import { openCoffrePanel } from "../ui/menu/coffrePanel.js";
import { openMarchandPanel } from "../ui/menu/marchandPanel.js";
import { openForgePanel } from "../ui/menu/forgePanel.js";

import { openPylonePanel, resetPyloneTimer } from "../ui/menu/pylonePanel.js";

import { getActiveCharacterId, loadActiveCharacter } from "../core/characterManager.js";
import { loadCurrencies } from "../systems/currencySystem.js";

console.log("🔥 sanctuary.js LOADED");

// ================================
// HELPERS
// ================================
const $ = (id) => document.getElementById(id);
const setText = (id, value) => {
    const el = $(id);
    if (el) el.textContent = value;
};

// ================================
// INIT SANCTUARY
// ================================
export function initSanctuary() {
    console.log("🔥 initSanctuary EXECUTED");

    // Charger le personnage actif dans player global
    const activeId = getActiveCharacterId();
    if (!activeId) {
        console.warn("Sanctuary: aucun personnage actif");
        return;
    }

    const profile = loadActiveCharacter();
    if (!profile) {
        console.warn("Sanctuary: impossible de charger le profil");
        return;
    }

    loadCurrencies();
    initZones();
    initHeader();
    scaleSanctuary();
}

// ================================
// HEADER PERSONNAGE
// ================================
function initHeader() {
    const profile = loadActiveCharacter();
    if (!profile) {
        console.warn("Sanctuary: aucun profil actif");
        return;
    }

    setText("character-name", profile.name);
    setText("character-class", profile.classe);
    setText("character-level", String(profile.soulLevel ?? 1));
}


// ================================
// ZONES DU SANCTUAIRE
// ================================
function initZones() {

    const PANELS = {
        pylone: openPylonePanel,
        forge: openForgePanel,
        marchand: openMarchandPanel,
        coffre: openCoffrePanel,
        grimoire: () => console.log("[Sanctuary] Grimoire : WIP")
    };

    document.querySelectorAll("[data-zone]").forEach(zone => {
        zone.addEventListener("click", () => {
            const key = zone.dataset.zone;
            const handler = PANELS[key];
            if (handler) handler();
            else console.warn("Zone inconnue :", key);
        });
    });

    $("sanctuary-back-btn")?.addEventListener("click", goToMenu);
}

// ================================
// RESET PYLÔNE
// ================================
export { resetPyloneTimer };

// ================================
// SCALE
// ================================
function scaleSanctuary() {

    const wrapper = $("sanctuary-wrapper");
    if (!wrapper) return;

    const baseW = 1920;
    const baseH = 1080;

    const scale = Math.min(
        window.innerWidth / baseW,
        window.innerHeight / baseH
    );

    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.left = `${(window.innerWidth - baseW * scale) / 2}px`;
    wrapper.style.top = `${(window.innerHeight - baseH * scale) / 2}px`;
}

window.addEventListener("resize", scaleSanctuary);
window.addEventListener("load", scaleSanctuary);
