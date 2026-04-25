// core/screenManager.js

import { setState, GameState } from "./state.js";
import { initSanctuary } from "../world/sanctuary.js"; // 🔥 AJOUT

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

    document.querySelectorAll(".screen")
        .forEach(s => s.classList.add("hidden"));

    document
        .querySelector(`[data-screen="${screen}"]`)
        ?.classList.remove("hidden");

    currentScreen = screen;

    // 🔥 FIX : initialiser le sanctuaire quand on arrive dessus
    if (screen === Screens.SANCTUARY) {
        initSanctuary();
    }

    console.log("📺 Screen →", screen);
}

export function getScreen() {
    return currentScreen;
}
