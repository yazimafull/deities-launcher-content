// ui/menu/pauseMenu.js

import { GameState, setState, getState } from "../../core/state.js";
import { cleanRun } from "../../core/runManager.js";

import { openOptions, closeOptions } from "./optionsMenu.js";

// ================================
// STATE
// ================================
function getOverlay(id) {
    return document.getElementById(id);
}

// ================================
// OPEN PAUSE
// ================================
export function openPause() {

    if (getState() !== GameState.PLAYING) return;

    const overlay = getOverlay("pause-overlay");
    if (!overlay) return;

    overlay.classList.remove("hidden");
    setState(GameState.PAUSED);
}

window.openPause = openPause;

// ================================
// CLOSE PAUSE
// ================================
export function closePause() {

    const overlay = getOverlay("pause-overlay");
    if (!overlay) return;

    overlay.classList.add("hidden");

    if (getState() === GameState.PAUSED) {
        setState(GameState.PLAYING);
    }
}

// ================================
// CLOSE ALL OVERLAYS (safe helper)
// ================================
function closeAll() {
    getOverlay("pause-overlay")?.classList.add("hidden");
    getOverlay("pause-options-overlay")?.classList.add("hidden");
    getOverlay("pause-confirm-overlay")?.classList.add("hidden");
}

// ================================
// INIT
// ================================
export function initPauseMenu() {

    const pauseOverlay   = getOverlay("pause-overlay");
    const confirmOverlay = getOverlay("pause-confirm-overlay");

    if (!pauseOverlay) return;

    // ================================
    // ESC KEY
    // ================================
    document.addEventListener("keydown", (e) => {

        if (e.key !== "Escape") return;

        const state = getState();

        if (state !== GameState.PLAYING && state !== GameState.PAUSED) return;

        if (pauseOverlay.classList.contains("hidden")) {
            openPause();
        } else {
            closeAll();
            setState(GameState.PLAYING);
        }
    });

    // ================================
    // RESUME
    // ================================
    document.getElementById("pause-resume")
        ?.addEventListener("click", closePause);

    // ================================
    // OPTIONS → DELEGATED TO OPTIONS MODULE
    // ================================
    document.getElementById("pause-options")
        ?.addEventListener("click", () => {
            pauseOverlay.classList.add("hidden");
            openOptions();
        });

    // ================================
    // BACK FROM OPTIONS
    // ================================
    document.getElementById("pause-options-close")
        ?.addEventListener("click", () => {
            closeOptions();
            pauseOverlay?.classList.remove("hidden");
        });

    // ================================
    // SANCTUARY CONFIRM
    // ================================
    document.getElementById("pause-sanctuary")
        ?.addEventListener("click", () => {
            pauseOverlay.classList.add("hidden");
            getOverlay("pause-confirm-overlay")?.classList.remove("hidden");
        });

    document.getElementById("pause-confirm-no")
        ?.addEventListener("click", () => {
            confirmOverlay?.classList.add("hidden");
            pauseOverlay?.classList.remove("hidden");
        });

    document.getElementById("pause-confirm-yes")
        ?.addEventListener("click", () => {

            closeAll();

            cleanRun();
            setState(GameState.SANCTUARY);

            // UI switch
            document.getElementById("sanctuary-screen")?.classList.remove("hidden");
            document.getElementById("game-canvas")?.classList.add("hidden");

            window.clearLaunchTimer?.();
            window.unlockPyloneChoices?.();

            document.getElementById("pylone-launch").disabled = false;
            document.getElementById("pylone-countdown")?.classList.add("hidden");
        });

    console.log("⏸ PauseMenu ready");
}