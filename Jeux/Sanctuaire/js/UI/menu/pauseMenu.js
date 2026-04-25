// Jeux/Sanctuaire/js/UI/menu/pauseMenu.js
// ROLE : Gestion du menu Pause pendant une run (ouvrir/fermer, retour Sanctuaire)
// GÈRE : Touche Échap, overlay pause, navigation vers Sanctuaire
// EXPORTS : openPause(), initPauseMenu()
// CONDITIONS : Ne doit fonctionner QUE en GameState.RUN
// NOTES : Le Sanctuaire n’a pas de pause menu → protections obligatoires

import { setState, GameState, getState } from "../../core/state.js";
import { setScreen, Screens } from "../../core/screenManager.js";

// Variable fermée, initialisée dans initPauseMenu()
let pauseOverlay = null;

// ================================
// OUVERTURE EXTERNE (appelée par d'autres modules)
// ================================
export function openPause() {
    if (!pauseOverlay) return;
    if (getState() !== GameState.RUN) return; // 🔥 sécurité
    pauseOverlay.classList.remove("hidden");
    setState(GameState.PAUSED);
}

// ================================
// INIT PAUSE MENU
// ================================
export function initPauseMenu() {

    pauseOverlay = document.getElementById("pause-overlay");

    // Si l'overlay n'existe pas (ex : Sanctuaire), on stoppe tout
    if (!pauseOverlay) {
        console.warn("⚠️ pauseMenu : aucun overlay trouvé → mode RUN uniquement");
        return;
    }

    // ================================
    // ESCAPE KEY
    // ================================
    document.addEventListener("keydown", (e) => {

        if (e.key !== "Escape") return;

        // 🔥 Ne jamais ouvrir le menu pause hors RUN
        if (getState() !== GameState.RUN && getState() !== GameState.PAUSED) {
            return;
        }

        // Toggle pause
        const isHidden = pauseOverlay.classList.toggle("hidden");

        if (isHidden) {
            setState(GameState.RUN);
        } else {
            setState(GameState.PAUSED);
        }
    });

    // ================================
    // RETOUR SANCTUAIRE
    // ================================
    document.getElementById("pause-sanctuary")?.addEventListener("click", () => {

        pauseOverlay.classList.add("hidden");

        // On repasse en état Sanctuaire
        setState(GameState.SANCTUARY);
        setScreen(Screens.SANCTUARY);
    });
}
