// sanctuary.js
import { goToMenu } from "../core/main.js";
import { setState, GameState } from "../core/state.js";
import { initBiomeWIP } from "./biome_wip.js";
import { startRun } from "../core/gameLoop.js";

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

        // Si un timer est actif → on l'annule mais on NE ferme PAS la fenêtre
        if (countdownInterval) {
            clearLaunchTimer();
            return;
        }

        // Sinon → pas de timer → on ferme la popup
        document.getElementById("pylone-overlay")?.classList.add("hidden");
    });


    // Sélection biome
    document.querySelectorAll("#biome-choices .pylone-choice").forEach(btn => {
        btn.addEventListener("click", () => {
            if (choicesLocked) return; // 🔒 Empêche de changer pendant le timer
            document.querySelectorAll("#biome-choices .pylone-choice")
                .forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
        });
    });

    // Sélection difficulté
    document.querySelectorAll("#difficulty-choices .pylone-choice").forEach(btn => {
        btn.addEventListener("click", () => {
            if (choicesLocked) return; // 🔒 Empêche de changer pendant le timer
            document.querySelectorAll("#difficulty-choices .pylone-choice")
                .forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
        });
    });

    // ZONES "À VENIR"
    document.getElementById("zone-coffre")?.addEventListener("click",   () => openSanctuaryPanel("coffre"));
    document.getElementById("zone-forge")?.addEventListener("click",    () => openSanctuaryPanel("forge"));
    document.getElementById("zone-marchand")?.addEventListener("click", () => openSanctuaryPanel("marchand"));
    document.getElementById("zone-grimoire")?.addEventListener("click", () => openSanctuaryPanel("grimoire"));

    document.getElementById("sanctuary-panel-close")?.addEventListener("click", () => {
        document.getElementById("sanctuary-panel-overlay")?.classList.add("hidden");
    });

    // LANCER LA RUN
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
    const title = document.getElementById("sanctuary-panel-title");
    if (title) title.textContent = panelTitles[zone] || zone;
    document.getElementById("sanctuary-panel-overlay")?.classList.remove("hidden");
}

// ================================
// COUNTDOWN LANCEMENT RUN
// ================================
let countdownInterval = null;
let choicesLocked = false;

function lockChoices() {
    choicesLocked = true;

    document.querySelectorAll("#biome-choices .pylone-choice").forEach(b => b.classList.add("disabled"));
    document.querySelectorAll("#difficulty-choices .pylone-choice").forEach(b => b.classList.add("disabled"));

    document.getElementById("mod-loot").disabled = true;
    document.getElementById("mod-xp").disabled = true;
    document.getElementById("mod-elite").disabled = true;
}

function unlockChoices() {
    choicesLocked = false;

    document.querySelectorAll("#biome-choices .pylone-choice").forEach(b => b.classList.remove("disabled"));
    document.querySelectorAll("#difficulty-choices .pylone-choice").forEach(b => b.classList.remove("disabled"));

    document.getElementById("mod-loot").disabled = false;
    document.getElementById("mod-xp").disabled = false;
    document.getElementById("mod-elite").disabled = false;
}

function startLaunchCountdown() {
    const countdownEl = document.getElementById("pylone-countdown");
    const launchBtn   = document.getElementById("pylone-launch");
    if (!countdownEl || !launchBtn) return;

    let seconds = 5;
    countdownEl.classList.remove("hidden");
    launchBtn.disabled = true;
    countdownEl.textContent = `Lancement dans ${seconds}s... (Annuler pour stopper)`;

    lockChoices(); // 🔒 Verrouillage total

    countdownInterval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            launchRun();
        } else {
            countdownEl.textContent = `Lancement dans ${seconds}s... (Annuler pour stopper)`;
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
    if (launchBtn)   launchBtn.disabled = false;

    unlockChoices(); // 🔓 Réactivation
}

// ================================
// LANCEMENT DE LA RUN
// ================================
function launchRun() {
    const biome      = document.querySelector("#biome-choices .pylone-choice.selected")?.dataset.value || "foret";
    const difficulte = document.querySelector("#difficulty-choices .pylone-choice.selected")?.dataset.value || "1";
    const modLoot    = document.getElementById("mod-loot")?.checked  || false;
    const modXP      = document.getElementById("mod-xp")?.checked    || false;
    const modElite   = document.getElementById("mod-elite")?.checked || false;

    const config = { biome, difficulte, modLoot, modXP, modElite };

    document.getElementById("pylone-overlay")?.classList.add("hidden");
    document.getElementById("sanctuary-screen")?.classList.add("hidden");

    if (biome === "foret") {
        startRun(config);
    } else {
        initBiomeWIP(biome);
    }
}

// =====================================================
// 🔥 Permet à pauseMenu.js d'appeler un reset minimal
// =====================================================
window.clearLaunchTimer = clearLaunchTimer;
window.unlockPyloneChoices = unlockChoices;
