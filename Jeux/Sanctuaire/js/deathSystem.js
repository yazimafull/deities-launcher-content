// deathSystem.js

export function onPlayerDeath() {
    const deathScreen = document.getElementById("death-screen");
    if (!deathScreen) return;

    // Afficher l'écran
    deathScreen.classList.remove("hidden");
    deathScreen.classList.add("show");
}

export function hideDeathScreen() {
    const deathScreen = document.getElementById("death-screen");
    if (!deathScreen) return;

    deathScreen.classList.remove("show");
    deathScreen.classList.add("hidden");
}
