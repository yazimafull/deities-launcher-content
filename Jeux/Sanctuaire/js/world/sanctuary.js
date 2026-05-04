// ROUTE : js/world/sanctuary.js
// ============================================================================
// ROLE : Gestion complète du Sanctuaire (UI, interactions, ouverture des panels,
//        lancement de run, récapitulatif, chargement persistant).
//
// EXPORTS : initSanctuary(), resetPyloneTimer()
//
// DEPENDANCES :
//    - core/main.js → goToMenu()
//    - core/gameLoop.js → startRun()
//    - core/runManager.js → startRunManager()
//    - systems/inventorySystem.js → loadInventory()
//    - systems/currencySystem.js → loadCurrencies()
//    - UI/menu/coffrePanel.js → openCoffrePanel()
//    - UI/menu/marchandPanel.js → openMarchandPanel()
//    - UI/menu/forgePanel.js → openForgePanel()
//    - UI/menu/pylonePanel.js → openPylonePanel(), resetPyloneTimer()
//
// SCREEN : data-screen="sanctuary"
//
// NOTES :
//    - Le Sanctuaire ne contient plus AUCUNE logique du pylône.
//    - Chaque zone ouvre un panel dédié (coffre, forge, marchand, pylône).
//    - Le pylône est désormais un panel autonome dans js/UI/menu/pylonePanel.js.
//    - Le Sanctuaire gère uniquement : header, zones, navigation, scaling.
// ============================================================================


// ================================
// IMPORTS
// ================================
import { goToMenu } from "../core/main.js";
import { startRun } from "../core/gameLoop.js";
import { startRunManager } from "../core/runManager.js";

import { openCoffrePanel } from "../UI/menu/coffrePanel.js";
import { openMarchandPanel } from "../UI/menu/marchandPanel.js";
import { openForgePanel } from "../UI/menu/forgePanel.js";

// 🔥 NOUVEAU : pylône extrait dans son propre panel
import { openPylonePanel, resetPyloneTimer } from "../UI/menu/pylonePanel.js";

// 🔥 Chargement persistant
import { loadInventory } from "../systems/inventorySystem.js";
import { loadCurrencies } from "../systems/currencySystem.js";

console.log("🔥 sanctuary.js LOADED");


// ================================
// HELPERS SAFE DOM
// ================================
const $ = (id) => document.getElementById(id);

function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
}


// ================================
// INIT SANCTUARY
// ================================
export function initSanctuary() {
    console.log("🔥 initSanctuary EXECUTED");

    // Chargement inventaire + monnaies persistantes
    loadInventory();
    loadCurrencies();

    initHeader();
    initZones();
    scaleSanctuary();
}


// ================================
// HEADER PERSONNAGE
// ================================
function initHeader() {
    try {
        const raw = sessionStorage.getItem("activeCharacter");
        if (!raw) return;

        const char = JSON.parse(raw);

        setText("character-name", char.name || "");
        setText("character-class", char.avatarClass || "");
        setText("character-level", char.level != null ? String(char.level) : "1");

    } catch (e) {
        console.warn("Sanctuary header: impossible de lire activeCharacter", e);
    }
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

    $("sanctuary-back-btn")?.addEventListener("click", () => {
        goToMenu();
    });
}


// ================================
// RESET PYLÔNE (appelé par le panel)
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
