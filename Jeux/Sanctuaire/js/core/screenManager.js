// Jeux/Sanctuaire/js/core/screenManager.js
// ROLE : Gestion centralisée des écrans du jeu (menu, sanctuaire, run, loot, death)
// GÈRE : Masquage/affichage des écrans via data-screen, suivi de l’écran actif
// EXPORTS : Screens, setScreen(), getScreen()
// DÉPENDANCES : state.js (setState, GameState), world/sanctuary.js (initSanctuary)
// NOTES : initSanctuary() doit être exécuté UNIQUEMENT quand l’écran Sanctuaire devient actif

import { setState, GameState } from "./state.js";
import { initSanctuary } from "../world/sanctuary.js";

export const Screens = {
    MENU: "character-select",
    SANCTUARY: "sanctuary",
    RUN: "run",
    LOOT: "loot",
    DEATH: "death"
};

let currentScreen = Screens.MENU;

// ================================
// CORE SWITCH
// ================================
export function setScreen(screen) {

    if (screen === currentScreen) return;

    // Masquer tous les écrans
    document.querySelectorAll(".screen")
        .forEach(s => s.classList.add("hidden"));

    // Afficher l’écran demandé
    document
        .querySelector(`[data-screen="${screen}"]`)
        ?.classList.remove("hidden");

    currentScreen = screen;

    // Initialisation spécifique au Sanctuaire
    if (screen === Screens.SANCTUARY) {
        initSanctuary();
    }

    console.log("📺 Screen →", screen);
}

export function getScreen() {
    return currentScreen;
}
