import { GameState, setState, getState } from "../core/state.js";
import { cleanRun } from "../core/runManager.js";

// =====================================================
// 🔥 Fonction demandée par les biomes : openPause()
// =====================================================
export function openPause() {
    if (getState() !== GameState.PLAYING) return;

    const pauseOverlay = document.getElementById("pause-overlay");
    pauseOverlay.classList.remove("hidden");

    setState(GameState.PAUSED);
}

// 🔥 Rendre openPause accessible globalement (évite les imports circulaires)
window.openPause = openPause;

export function initPauseMenu() {

    const pauseOverlay        = document.getElementById("pause-overlay");
    const pauseOptionsOverlay = document.getElementById("pause-options-overlay");
    const pauseConfirmOverlay = document.getElementById("pause-confirm-overlay");

    const btnResume     = document.getElementById("pause-resume");
    const btnOptions    = document.getElementById("pause-options");
    const btnSanctuary  = document.getElementById("pause-sanctuary");

    const btnOptionsClose = document.getElementById("pause-options-close");

    const btnConfirmYes = document.getElementById("pause-confirm-yes");
    const btnConfirmNo  = document.getElementById("pause-confirm-no");

    // =====================================================
    // ESC → ouvrir / fermer pause (UNIQUEMENT EN PLAYING/PAUSED)
    // =====================================================
    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;

        const state = getState();

        // 🔥 ESC ne fonctionne QUE pendant une run
        if (state !== GameState.PLAYING && state !== GameState.PAUSED) return;

        if (pauseOverlay.classList.contains("hidden")) {
            openPause();
        } else {
            // fermer pause
            pauseOverlay.classList.add("hidden");
            pauseOptionsOverlay.classList.add("hidden");
            pauseConfirmOverlay.classList.add("hidden");

            setState(GameState.PLAYING);
        }
    });

    // =====================================================
    // ▶ Reprendre
    // =====================================================
    btnResume.addEventListener("click", () => {
        pauseOverlay.classList.add("hidden");
        pauseOptionsOverlay.classList.add("hidden");
        pauseConfirmOverlay.classList.add("hidden");

        if (getState() === GameState.PAUSED) {
            setState(GameState.PLAYING);
        }
    });

    // =====================================================
    // ⚙ Options
    // =====================================================
    btnOptions.addEventListener("click", () => {
        pauseOverlay.classList.add("hidden");
        pauseOptionsOverlay.classList.remove("hidden");
    });

    btnOptionsClose.addEventListener("click", () => {
        pauseOptionsOverlay.classList.add("hidden");
        pauseOverlay.classList.remove("hidden");
    });

    // =====================================================
    // ↩ Retour Sanctuaire → demande confirmation
    // =====================================================
    btnSanctuary.addEventListener("click", () => {
        pauseOverlay.classList.add("hidden");
        pauseOptionsOverlay.classList.add("hidden");
        pauseConfirmOverlay.classList.remove("hidden");
    });

    btnConfirmNo.addEventListener("click", () => {
        pauseConfirmOverlay.classList.add("hidden");
        pauseOverlay.classList.remove("hidden");
    });

    btnConfirmYes.addEventListener("click", () => {

        // 🔥 Fermer TOUS les panneaux avant de changer de state
        pauseOverlay.classList.add("hidden");
        pauseOptionsOverlay.classList.add("hidden");
        pauseConfirmOverlay.classList.add("hidden");

        // Nettoyage de la run
        cleanRun();
        setState(GameState.SANCTUARY);

        // Ré‑afficher le sanctuaire
        document.getElementById("sanctuary-screen")?.classList.remove("hidden");

        // Ré‑afficher le canvas (si ton sanctuaire l’utilise)
        document.getElementById("game-canvas")?.classList.remove("hidden");

        // Cacher le HUD
        document.getElementById("healthbar-container")?.classList.add("hidden");
        document.getElementById("xpbar-container")?.classList.add("hidden");

        // =====================================================
        // 🔥 RESET MINIMAL DU PYLÔNE (aligné avec sanctuary.js)
        // =====================================================

        if (window.clearLaunchTimer) window.clearLaunchTimer();
        if (window.unlockPyloneChoices) window.unlockPyloneChoices();

        // Réactiver le bouton Lancer
        document.getElementById("pylone-launch").disabled = false;

        // Cacher le texte du countdown
        document.getElementById("pylone-countdown")?.classList.add("hidden");

        // NE PAS reset les sélections du joueur (biome/diff/mods)
    });
}
