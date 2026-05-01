// ROUTE : js/systems/deathSystem.js
// RÔLE : Gestion de la mort du joueur (affichage écran de mort, pause, retour sanctuaire)
// EXPORTS : onPlayerDeath, hideDeathScreen
// DÉPENDANCES : state.js (GameState), DOM (#death-screen), events "game:paused"/"game:resume"
// NOTES :
// - Affiche l’écran de mort et bloque les inputs via un event global.
// - hideDeathScreen() est déclenché par le bouton #death-back (Tâche 9).
// - Le retour se fait vers l’état SANCTUARY, logique runManager non impactée.

import { GameState, setState } from "../core/state.js";

export function onPlayerDeath() {
    const deathScreen = document.getElementById("death-screen");

    if (!deathScreen) {
        console.warn("⚠️ deathSystem : #death-screen introuvable dans le DOM");
        setState(GameState.DEAD);
        return;
    }

    // État global du jeu
    setState(GameState.DEAD);

    // UI
    deathScreen.classList.remove("hidden");
    deathScreen.classList.add("show");

    // Stop inputs / mouvements éventuels
    window.dispatchEvent(new CustomEvent("game:paused"));
}

export function hideDeathScreen() {
    const deathScreen = document.getElementById("death-screen");

    if (!deathScreen) {
        console.warn("⚠️ deathSystem : #death-screen introuvable dans le DOM");
        setState(GameState.SANCTUARY);
        return;
    }

    deathScreen.classList.remove("show");
    deathScreen.classList.add("hidden");

    // retour menu ou sanctuaire selon ton flow
    setState(GameState.SANCTUARY);

    window.dispatchEvent(new CustomEvent("game:resume"));
}

// 🔥 Listener bouton "Retour Sanctuaire" (Tâche 9)
document.getElementById("death-back")?.addEventListener("click", hideDeathScreen);
