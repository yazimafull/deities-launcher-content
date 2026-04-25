import { setState, GameState } from "../../core/state.js";
import { setScreen, Screens } from "../../core/screenManager.js";

// Variable fermée, initialisée dans initPauseMenu()
let pauseOverlay = null;

// Fonction demandée par le document de review
export function openPause() {
    if (!pauseOverlay) return;
    pauseOverlay.classList.remove("hidden");
    setState(GameState.PAUSED);
}

export function initPauseMenu() {

    pauseOverlay = document.getElementById("pause-overlay");

    document.addEventListener("keydown", (e) => {

        if (e.key !== "Escape") return;

        pauseOverlay.classList.toggle("hidden");

        if (pauseOverlay.classList.contains("hidden")) {
            setState(GameState.PLAYING);
        } else {
            setState(GameState.PAUSED);
        }
    });

    document.getElementById("pause-sanctuary")?.addEventListener("click", () => {

        pauseOverlay.classList.add("hidden");

        setState(GameState.SANCTUARY);
        setScreen(Screens.SANCTUARY);
    });
}
