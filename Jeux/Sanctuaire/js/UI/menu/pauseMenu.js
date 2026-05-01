// UI/menu/pauseMenu.js
/*
   ROUTE : Jeux/Sanctuaire/js/UI/menu/pauseMenu.js
   RÔLE : Gestion du menu Pause en run (ouverture, fermeture, confirmation Sanctuaire)
   EXPORTS : openPause, initPauseMenu
   DÉPENDANCES : state.js, screenManager.js, gameLoop.js, runManager.js
   NOTES :
   - Fonctionne en GameState.PLAYING et GameState.PAUSED
   - ESC ouvre/ferme le menu pause
   - Retour Sanctuaire passe par un overlay de confirmation
   - stopRun() + cleanRun() appliqués avant retour au Sanctuaire
*/

import { setState, GameState, getState } from "../../core/state.js";
import { setScreen, Screens } from "../../core/screenManager.js";

// === AJOUT CLAUDE ===
import { stopRun } from "../../core/gameLoop.js";
import { cleanRun } from "../../core/runManager.js";

let pauseOverlay = null;
let sanctuaryConfirmOverlay = null;
let sanctuaryConfirmCancelBtn = null;
let sanctuaryConfirmOkBtn = null;

// ================================
// OUVERTURE EXTERNE
// ================================
export function openPause() {
    if (!pauseOverlay) return;
    if (getState() !== GameState.PLAYING) return;
    pauseOverlay.classList.remove("hidden");
    setState(GameState.PAUSED);
}

// ================================
// CONFIRM SANCTUAIRE
// ================================
function showSanctuaryConfirm() {
    if (!sanctuaryConfirmOverlay) return;
    sanctuaryConfirmOverlay.classList.remove("hidden");
}

function hideSanctuaryConfirm() {
    if (!sanctuaryConfirmOverlay) return;
    sanctuaryConfirmOverlay.classList.add("hidden");
}

// ================================
// INIT PAUSE MENU
// ================================
export function initPauseMenu() {

    pauseOverlay = document.getElementById("pause-overlay");

    if (!pauseOverlay) {
        console.warn("⚠️ pauseMenu : aucun overlay trouvé → mode PLAYING uniquement");
        return;
    }

    sanctuaryConfirmOverlay = document.getElementById("sanctuary-confirm-overlay");
    sanctuaryConfirmCancelBtn = document.getElementById("sanctuary-confirm-cancel");
    sanctuaryConfirmOkBtn = document.getElementById("sanctuary-confirm-ok");

    // ================================
    // ESCAPE KEY
    // ================================
    document.addEventListener("keydown", (e) => {

        if (e.key !== "Escape") return;

        const state = getState();
        if (state !== GameState.PLAYING && state !== GameState.PAUSED) {
            return;
        }

        const isHidden = pauseOverlay.classList.toggle("hidden");

        if (isHidden) {
            setState(GameState.PLAYING);
        } else {
            setState(GameState.PAUSED);
        }
    });

    // ================================
    // BOUTON REPRENDRE
    // ================================
    document.getElementById("pause-resume")?.addEventListener("click", () => {
        pauseOverlay.classList.add("hidden");
        setState(GameState.PLAYING);
    });

    // ================================
    // RETOUR SANCTUAIRE → ouvre la confirmation
    // ================================
    document.getElementById("pause-sanctuary")?.addEventListener("click", () => {
        showSanctuaryConfirm();
    });

    // ================================
    // CONFIRMATION : Annuler
    // ================================
    sanctuaryConfirmCancelBtn?.addEventListener("click", () => {
        hideSanctuaryConfirm();
        // On revient au menu pause
        pauseOverlay.classList.remove("hidden");
    });

    // ================================
    // CONFIRMATION : Retour Sanctuaire
    // === VERSION MODIFIÉE CLAUDE ===
    // ================================
    sanctuaryConfirmOkBtn?.addEventListener("click", () => {
        hideSanctuaryConfirm();
        pauseOverlay.classList.add("hidden");
        stopRun();
        cleanRun();
        setScreen(Screens.SANCTUARY);
    });
}
