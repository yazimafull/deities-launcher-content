// Jeux/Sanctuaire/js/core/screenManager.js
/*
   ROUTE : core/screenManager.js
   RÔLE : Gestion centralisée des écrans (menu, sanctuaire, run, loot, death)
   EXPORTS : Screens, setScreen, getScreen
   DÉPENDANCES : state.js, world/sanctuary.js
   NOTES :
   - initSanctuary() doit être appelé UNIQUEMENT quand l'écran Sanctuaire devient actif
   - Le retour au sanctuaire depuis une run force le rechargement même si currentScreen === sanctuary
*/

import { setState, GameState } from "./state.js";
import { initSanctuary } from "../world/sanctuary.js";

export const Screens = {
    MENU: "character-select",
    SANCTUARY: "sanctuary",
    LOOT: "loot",
    DEATH: "death"
};

let currentScreen = Screens.MENU;

// ================================
// CORE SWITCH
// ================================
export function setScreen(screen) {

    // On autorise le retour au sanctuaire même si currentScreen === sanctuary
    // car pendant la run, currentScreen reste sur sanctuary (pas d'écran RUN)
    if (screen === currentScreen && screen !== Screens.SANCTUARY) return;

    // Masquer tous les écrans
    document.querySelectorAll(".screen")
        .forEach(s => s.classList.add("hidden"));

    // Toujours cacher le canvas quand on change d'écran
    const canvas = document.getElementById("game-canvas");
    if (canvas) canvas.classList.add("hidden");

    // Afficher l'écran demandé
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