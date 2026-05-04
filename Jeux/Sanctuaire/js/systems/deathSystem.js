// ROUTE : js/systems/deathSystem.js
// RÔLE : Gestion de la mort du joueur (affichage écran de mort, pause, retour sanctuaire)
// EXPORTS : onPlayerDeath
// DÉPENDANCES : state.js (GameState), DOM (#death-screen), events "game:paused"/"game:resume"
// NOTES :
// - Affiche l’écran de mort et bloque les inputs via un event global.
// - Le retour Sanctuaire utilise désormais la fonction maître du runManager.

import { GameState, setState } from "../core/state.js";
import { returnToSanctuary } from "../core/runManager.js";   // 🔥 IMPORT MAÎTRE

export function onPlayerDeath() {
    const deathScreen = document.getElementById("death-screen");
    if (!deathScreen) return;

    // État global
    setState(GameState.DEAD);

    // Affiche l’écran de mort
    deathScreen.classList.remove("hidden");

    // Bloque les inputs
    window.dispatchEvent(new CustomEvent("game:paused"));
}

// Bouton "Retour Sanctuaire"
document.getElementById("death-back")
    ?.addEventListener("click", returnToSanctuary);   // 🔥 UTILISE LA FONCTION MAÎTRE
