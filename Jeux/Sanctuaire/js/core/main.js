// Jeux/Sanctuaire/js/core/main.js
// ROUTE : js/core/main.js
// ROLE  : Gestion du bouton Play + transition vers Sanctuaire
// EXPORTS : goToMenu(), attachPlayButton()

import { setState, GameState } from "./state.js";
import { Screens, setScreen } from "./screenManager.js";
import { stopRun } from "./gameLoop.js";
import { resetInput } from "./input.js";

import { getActiveCharacterId } from "./characterManager.js";

/* ============================================================================
   Aller au MENU (utilisé par pauseMenu ou autres)
============================================================================ */
export function goToMenu() {
    setScreen(Screens.MENU);
    setState(GameState.MENU);
}

/* ============================================================================
   ATTACHER LE LISTENER PLAY
   ⚠️ IMPORTANT :
   - Cette fonction doit être appelée APRÈS initCharacterMenu()
   - Donc depuis loader.js, pas depuis DOMContentLoaded
============================================================================ */
export function attachPlayButton() {

    const playBtn = document.querySelector('[data-action="play"]');

    if (!playBtn) {
        console.warn("⚠️ Play introuvable au moment de l’attachement");
        return;
    }

    playBtn.onclick = () => {

        // Vérifier qu’un perso est sélectionné
        const selected = document.querySelector(".character-item.selected");
        if (!selected) return;

        // Vérifier qu’un perso actif existe (depuis characterManager)
        const activeId = getActiveCharacterId();
        if (!activeId) return;

        // Transition vers le Sanctuaire
        stopRun();
        resetInput();
        setScreen(Screens.SANCTUARY);
        setState(GameState.SANCTUARY);
    };

    console.log("🎯 Listener Play attaché depuis main.js");
}
