// Jeux/Sanctuaire/js/core/main.js
// ROLE : Point d’entrée du menu principal + gestion du bouton "Play"
// GÈRE : Sélection du personnage, transition vers l’écran Sanctuaire
// EXPORTS : goToMenu()
// DÉPENDANCES : state.js (setState, GameState), screenManager.js (Screens, setScreen)
// NOTES : Ce fichier ne lance jamais une run ; il ne fait que changer d’écran

import { setState, GameState } from "./state.js";
import { Screens, setScreen } from "./screenManager.js";

const ACTIVE_CHARACTER_KEY = "activeCharacter";

// ================================
// EXPORT : utilisé par d’autres modules (ex : retour depuis Sanctuaire)
// ================================
export function goToMenu() {
    setScreen(Screens.MENU);
    setState(GameState.MENU);
}

// ================================
// INIT MENU
// ================================
document.addEventListener("DOMContentLoaded", () => {

    const playBtn = document.querySelector('[data-action="play"]');

    playBtn?.addEventListener("click", () => {

        const selected = document.querySelector(".character-item.selected");
        if (!selected) return;

        const active = sessionStorage.getItem(ACTIVE_CHARACTER_KEY);
        if (!active) return;

        // IMPORTANT :
        // On NE lance PAS la run ici.
        // On bascule simplement vers l’écran Sanctuaire.
        setScreen(Screens.SANCTUARY);
        setState(GameState.SANCTUARY);
    });
});
