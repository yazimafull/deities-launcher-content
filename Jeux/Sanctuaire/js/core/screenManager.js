// core/screenManager.js

import { setState, GameState } from "./state.js";

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

    console.log("📺 Screen →", screen);
}

export function getScreen() {
    return currentScreen;
}