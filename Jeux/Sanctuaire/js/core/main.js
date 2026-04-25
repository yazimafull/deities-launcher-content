// main.js

import { setState, GameState } from "./state.js";
import { initPauseMenu } from "../UI/menu/pauseMenu.js";

document.addEventListener("DOMContentLoaded", () => {

    const playBtn = document.querySelector('[data-action="play"]');
    const menuScreen = document.querySelector('[data-screen="character-select"]');
    const sanctuaryScreen = document.querySelector('[data-screen="sanctuary"]');

    // 👉 PLAY = uniquement transition screen
    playBtn?.addEventListener("click", () => {

        const selected = document.querySelector(".character-item.selected");
        if (!selected) return;

        // sécurité simple
        const activeCharacter = sessionStorage.getItem("activeCharacter");

        if (!activeCharacter) {
            console.warn("Aucun personnage actif en session");
            return;
        }

        menuScreen?.classList.add("hidden");
        sanctuaryScreen?.classList.remove("hidden");

        setState(GameState.SANCTUARY);
    });

    initPauseMenu();
});

// =========================
// SANCTUARY NAVIGATION
// =========================
export function goToSanctuary() {

    document.querySelector('[data-screen="character-select"]')
        ?.classList.add("hidden");

    document.querySelector('[data-screen="sanctuary"]')
        ?.classList.remove("hidden");

    setState(GameState.SANCTUARY);
}

window.goToSanctuary = goToSanctuary;

// =========================
// BACK TO MENU
// =========================
export function goToMenu() {

    document.querySelector('[data-screen="sanctuary"]')
        ?.classList.add("hidden");

    document.querySelector('[data-screen="character-select"]')
        ?.classList.remove("hidden");

    setState(GameState.MENU);
}

window.goToMenu = goToMenu;