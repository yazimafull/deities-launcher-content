// ui/menu/pauseMenu.js

import { GameState, setState, getState } from "../../core/state.js";
import { cleanRun } from "../../core/runManager.js";

// ================================
// OPEN PAUSE (global safe)
// ================================
export function openPause() {

    if (getState() !== GameState.PLAYING) return;

    const overlay = document.getElementById("pause-overlay");
    if (!overlay) return;

    overlay.classList.remove("hidden");

    setState(GameState.PAUSED);
}

// global access (biomes / legacy hooks)
window.openPause = openPause;

// ================================
// INIT MENU
// ================================
export function initPauseMenu() {

    const pauseOverlay        = document.getElementById("pause-overlay");
    const optionsOverlay     = document.getElementById("pause-options-overlay");
    const confirmOverlay     = document.getElementById("pause-confirm-overlay");

    const btnResume          = document.getElementById("pause-resume");
    const btnOptions         = document.getElementById("pause-options");
    const btnSanctuary       = document.getElementById("pause-sanctuary");

    const btnOptionsClose    = document.getElementById("pause-options-close");

    const btnConfirmYes      = document.getElementById("pause-confirm-yes");
    const btnConfirmNo       = document.getElementById("pause-confirm-no");

    // safety check (évite crash si HTML pas chargé)
    if (!pauseOverlay) return;

    // ================================
    // ESC TOGGLE
    // ================================
    document.addEventListener("keydown", (e) => {

        if (e.key !== "Escape") return;

        const state = getState();

        if (
            state !== GameState.PLAYING &&
            state !== GameState.PAUSED
        ) return;

        if (pauseOverlay.classList.contains("hidden")) {
            openPause();
        } else {
            closeAllMenus(pauseOverlay, optionsOverlay, confirmOverlay);
            setState(GameState.PLAYING);
        }
    });

    // ================================
    // RESUME
    // ================================
    btnResume?.addEventListener("click", () => {
        closeAllMenus(pauseOverlay, optionsOverlay, confirmOverlay);
        if (getState() === GameState.PAUSED) {
            setState(GameState.PLAYING);
        }
    });

    // ================================
    // OPTIONS
    // ================================
    btnOptions?.addEventListener("click", () => {
        pauseOverlay.classList.add("hidden");
        optionsOverlay?.classList.remove("hidden");
    });

    btnOptionsClose?.addEventListener("click", () => {
        optionsOverlay?.classList.add("hidden");
        pauseOverlay?.classList.remove("hidden");
    });

    // ================================
    // SANCTUARY CONFIRM
    // ================================
    btnSanctuary?.addEventListener("click", () => {
        pauseOverlay.classList.add("hidden");
        optionsOverlay?.classList.add("hidden");
        confirmOverlay?.classList.remove("hidden");
    });

    btnConfirmNo?.addEventListener("click", () => {
        confirmOverlay?.classList.add("hidden");
        pauseOverlay?.classList.remove("hidden");
    });

    // ================================
    // CONFIRM YES → RETURN SANCTUARY
    // ================================
    btnConfirmYes?.addEventListener("click", () => {

        closeAllMenus(pauseOverlay, optionsOverlay, confirmOverlay);

        cleanRun();
        setState(GameState.SANCTUARY);

        // UI SANCTUARY
        document.getElementById("sanctuary-screen")?.classList.remove("hidden");
        document.getElementById("game-canvas")?.classList.add("hidden");

        // IMPORTANT : HUD IS NOW DATA-DRIVEN → on ne touche PLUS aux containers
        // ❌ supprimé :
        // healthbar-container
        // xpbar-container

        // reset pylone (safe hooks legacy)
        window.clearLaunchTimer?.();
        window.unlockPyloneChoices?.();

        const launchBtn = document.getElementById("pylone-launch");
        if (launchBtn) launchBtn.disabled = false;

        document.getElementById("pylone-countdown")?.classList.add("hidden");
    });
}

// ================================
// UTIL
// ================================
function closeAllMenus(...els) {
    els.forEach(el => el?.classList.add("hidden"));
}