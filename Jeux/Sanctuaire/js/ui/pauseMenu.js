import { GameState, setState, getState } from "../core/state.js";

export function initPauseMenu() {

    const pauseOverlay = document.getElementById("pause-overlay");
    const pauseOptionsOverlay = document.getElementById("pause-options-overlay");
    const pauseConfirmOverlay = document.getElementById("pause-confirm-overlay");

    const btnResume = document.getElementById("pause-resume");
    const btnOptions = document.getElementById("pause-options");
    const btnSanctuary = document.getElementById("pause-sanctuary");

    const btnOptionsClose = document.getElementById("pause-options-close");

    const btnConfirmYes = document.getElementById("pause-confirm-yes");
    const btnConfirmNo = document.getElementById("pause-confirm-no");

    // ESC → ouvrir / fermer pause (UNIQUEMENT en PLAYING)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && getState() === GameState.PLAYING) {

            if (pauseOverlay.classList.contains("hidden")) {
                pauseOverlay.classList.remove("hidden");
                setState(GameState.PAUSED);
            } else {
                pauseOverlay.classList.add("hidden");
                setState(GameState.PLAYING);
            }
        }
    });

    // ▶ Reprendre
    btnResume.addEventListener("click", () => {
        pauseOverlay.classList.add("hidden");

        if (getState() === GameState.PAUSED) {
            setState(GameState.PLAYING);
        }
    });

    // ⚙ Options
    btnOptions.addEventListener("click", () => {
        pauseOverlay.classList.add("hidden");
        pauseOptionsOverlay.classList.remove("hidden");
    });

    btnOptionsClose.addEventListener("click", () => {
        pauseOptionsOverlay.classList.add("hidden");
        pauseOverlay.classList.remove("hidden");
    });

    // ↩ Retour Sanctuaire → demande confirmation
    btnSanctuary.addEventListener("click", () => {
        pauseOverlay.classList.add("hidden");
        pauseConfirmOverlay.classList.remove("hidden");
    });

    btnConfirmNo.addEventListener("click", () => {
        pauseConfirmOverlay.classList.add("hidden");
        pauseOverlay.classList.remove("hidden");
    });

    btnConfirmYes.addEventListener("click", () => {
        pauseConfirmOverlay.classList.add("hidden");
        setState(GameState.SANCTUARY);
    });
}
