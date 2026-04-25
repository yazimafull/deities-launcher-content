// UI/menu/optionsMenu.js
// ROUTE : UI/menu/optionsMenu.js
// ROLE  : Gère l’ouverture/fermeture du panneau Options.
// EXPORTS : openOptions(), closeOptions(), initOptionsMenu()
// DEPENDANCES : aucune externe
// NOTES :
// - Tous les listeners sont idempotents (attachés une seule fois).
// - Empêche les doublons lors des rechargements du jeu.
// - Empêche les popups de réagir dans le Sanctuaire.

const PANEL_SELECTOR = '[data-overlay="options"]';

let OPTIONS_INITIALIZED = false; // 🔥 Empêche les listeners multiples

// ================================
// UTILS
// ================================
function getPanel() {
    return document.querySelector(PANEL_SELECTOR);
}

// ================================
// OPEN / CLOSE API
// ================================
export function openOptions() {
    getPanel()?.classList.remove("hidden");
}

export function closeOptions() {
    getPanel()?.classList.add("hidden");
}

// ================================
// INIT (idempotent)
// ================================
export function initOptionsMenu() {

    if (OPTIONS_INITIALIZED) {
        console.warn("⚠️ OptionsMenu déjà initialisé — listeners ignorés");
        return;
    }
    OPTIONS_INITIALIZED = true;

    const panel = getPanel();
    if (!panel) {
        console.warn("⚠️ Options panel introuvable");
        return;
    }

    // ================================
    // OPEN BUTTONS (global safe)
    // ================================
    document.querySelectorAll('[data-action="open-options"]')
        .forEach(btn => {
            btn.onclick = openOptions; // 🔥 remplace addEventListener
        });

    // ================================
    // CLOSE BUTTONS (ONLY options scope)
    // ================================
    panel.querySelectorAll('[data-action="close"]')
        .forEach(btn => {
            btn.onclick = closeOptions; // 🔥 remplace addEventListener
        });

    // ================================
    // CLICK OUTSIDE PANEL
    // ================================
    panel.onclick = (e) => {
        if (e.target === panel) closeOptions();
    };

    // ================================
    // ESC KEY (idempotent)
    // ================================
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeOptions();
    }, { once: true }); // 🔥 ne s’attache qu’une seule fois

    console.log("⚙️ OptionsMenu ready (idempotent)");
}
