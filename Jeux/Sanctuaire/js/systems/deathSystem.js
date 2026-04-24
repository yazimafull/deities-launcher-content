import { GameState, setState } from "../core/state.js";

export function onPlayerDeath() {
    const deathScreen = document.getElementById("death-screen");
    if (!deathScreen) return;

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
    if (!deathScreen) return;

    deathScreen.classList.remove("show");
    deathScreen.classList.add("hidden");

    // retour menu ou sanctuaire selon ton flow
    setState(GameState.SANCTUARY);

    window.dispatchEvent(new CustomEvent("game:resume"));
}