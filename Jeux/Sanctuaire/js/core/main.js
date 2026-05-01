// Jeux/Sanctuaire/js/core/main.js
// ROUTE : js/core/main.js
// ROLE  : Gestion du bouton Play + transition vers Sanctuaire
// EXPORTS : goToMenu()
// NOTES : Listener Play idempotent (une seule fois)

import { setState, GameState } from "./state.js";
import { Screens, setScreen } from "./screenManager.js";
import { stopRun } from "./gameLoop.js";
import { resetInput } from "./input.js";


const ACTIVE_CHARACTER_KEY = "activeCharacter";

let MAIN_INITIALIZED = false; // 🔥 Empêche les doublons

export function goToMenu() {
    setScreen(Screens.MENU);
    setState(GameState.MENU);
}

document.addEventListener("DOMContentLoaded", () => {

    if (MAIN_INITIALIZED) {
        console.warn("⚠️ main.js déjà initialisé — listener ignoré");
        return;
    }
    MAIN_INITIALIZED = true;

    const playBtn = document.querySelector('[data-action="play"]');

    if (playBtn) {
        playBtn.onclick = () => {

            const selected = document.querySelector(".character-item.selected");
            if (!selected) return;

            const active = sessionStorage.getItem(ACTIVE_CHARACTER_KEY);
            if (!active) return;

            // IMPORTANT :
            stopRun();
            resetInput();
            setScreen(Screens.SANCTUARY);
            setState(GameState.SANCTUARY);
        };
    }

    console.log("🎯 main.js listeners initialisés (une seule fois)");
});
