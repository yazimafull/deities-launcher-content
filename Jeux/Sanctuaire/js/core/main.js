﻿// core/main.js

import { setState, GameState } from "./state.js";
import { startRun } from "./gameLoop.js";
import { Screens, setScreen } from "./screenManager.js";

const ACTIVE_CHARACTER_KEY = "activeCharacter";

// ================================
// EXPORT FIX (pour sanctuary.js)
// ================================
export function goToMenu() {
    setScreen(Screens.MENU);
    setState(GameState.MENU);
}

document.addEventListener("DOMContentLoaded", () => {

    const playBtn = document.querySelector('[data-action="play"]');

    playBtn?.addEventListener("click", () => {

        const selected = document.querySelector(".character-item.selected");
        if (!selected) return;

        const active = sessionStorage.getItem(ACTIVE_CHARACTER_KEY);
        if (!active) return;

        setScreen(Screens.RUN);
        setState(GameState.PLAYING);

        startRun({
            character: JSON.parse(active)
        });
    });
});
