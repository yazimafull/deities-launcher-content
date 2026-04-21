// sanctuary.js
import { goToMenu } from "../core/main.js";
import { setState, GameState } from "../core/state.js";
import { initForet } from "./biome_foret.js";
import { initBiomeWIP } from "./biome_wip.js";

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

    // Sélection biome
    document.querySelectorAll("#biome-choices .pylone-choice").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("#biome-choices .pylone-choice")
                .forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
        });
    });

    // Sélection difficulté
    document.querySelectorAll("#difficulty-choices .pylone-choice").forEach(btn => {
        btn.addEventListener("click", () => {
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

function startLaunchCountdown() {
    const countdownEl = document.getElementById("pylone-countdown");
    const launchBtn   = document.getElementById("pylone-launch");
    if (!countdownEl || !launchBtn) return;

    let seconds = 5;
    countdownEl.classList.remove("hidden");
    launchBtn.disabled = true;
    countdownEl.textContent = `Lancement dans ${seconds}s... (Annuler pour stopper)`;

    countdownInterval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(countdownInterval);
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
        initForet(config);
    } else {
        initBiomeWIP(biome);
    }
}