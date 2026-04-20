// sanctuary.js
import { goToMenu } from "../core/main.js";
import { setState, GameState } from "../core/state.js";

document.addEventListener("DOMContentLoaded", () => {

    // RETOUR AU MENU
    document.getElementById("sanctuary-back-btn")?.addEventListener("click", () => {
        goToMenu();
    });

    // PYLÔNE → popup config run
    document.getElementById("zone-pylone")?.addEventListener("click", () => {
        document.getElementById("pylone-overlay")?.classList.remove("hidden");
    });

    document.getElementById("pylone-cancel")?.addEventListener("click", () => {
        document.getElementById("pylone-overlay")?.classList.add("hidden");
        clearLaunchTimer();
    });

    // COFFRE
    document.getElementById("zone-coffre")?.addEventListener("click", () => {
        openSanctuaryPanel("coffre");
    });

    // FORGE
    document.getElementById("zone-forge")?.addEventListener("click", () => {
        openSanctuaryPanel("forge");
    });

    // MARCHAND
    document.getElementById("zone-marchand")?.addEventListener("click", () => {
        openSanctuaryPanel("marchand");
    });

    // GRIMOIRE
    document.getElementById("zone-grimoire")?.addEventListener("click", () => {
        openSanctuaryPanel("grimoire");
    });

    // Fermer les panels "à venir"
    document.getElementById("sanctuary-panel-close")?.addEventListener("click", () => {
        document.getElementById("sanctuary-panel-overlay")?.classList.add("hidden");
    });

    // LANCER LA RUN avec countdown
    document.getElementById("pylone-launch")?.addEventListener("click", () => {
        startLaunchCountdown();
    });
});

// ================================
// PANELS "À VENIR"
// ================================
const panelTitles = {
    coffre:   "Coffre du Sanctuaire",
    forge:    "Forge Sacrée",
    marchand: "Marchand des Ombres",
    grimoire: "Grimoire Ancien"
};

function openSanctuaryPanel(zone) {
    const overlay = document.getElementById("sanctuary-panel-overlay");
    const title   = document.getElementById("sanctuary-panel-title");
    if (title) title.textContent = panelTitles[zone] || zone;
    overlay?.classList.remove("hidden");
}

// ================================
// COUNTDOWN LANCEMENT RUN
// ================================
let countdownInterval = null;

function startLaunchCountdown() {
    const countdownEl = document.getElementById("pylone-countdown");
    const launchBtn   = document.getElementById("pylone-launch");
    if (!countdownEl || !launchBtn) return;

    let seconds = 5;
    countdownEl.classList.remove("hidden");
    launchBtn.disabled = true;
    countdownEl.textContent = `Lancement dans ${seconds}s...`;

    countdownInterval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            launchRun();
        } else {
            countdownEl.textContent = `Lancement dans ${seconds}s...`;
        }
    }, 1000);
}

function clearLaunchTimer() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    const countdownEl = document.getElementById("pylone-countdown");
    const launchBtn   = document.getElementById("pylone-launch");
    if (countdownEl) countdownEl.classList.add("hidden");
    if (launchBtn) launchBtn.disabled = false;
}

function launchRun() {
    document.getElementById("pylone-overlay")?.classList.add("hidden");
    document.getElementById("sanctuary-screen")?.classList.add("hidden");

    // Afficher les éléments de jeu
    document.getElementById("game-canvas")?.classList.remove("hidden");
    document.getElementById("healthbar-container")?.classList.remove("hidden");
    document.getElementById("xpbar-container")?.classList.remove("hidden");

    setState(GameState.PLAYING);

    // TODO: brancher le vrai moteur de jeu ici
    console.log("Run lancée !");
}