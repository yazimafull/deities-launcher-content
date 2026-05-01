// UI/menu/optionsMenu.js
/*
   ROUTE : Jeux/Sanctuaire/js/UI/menu/optionsMenu.js
   RÔLE : Gestion du panneau Options unifié (ouverture, fermeture, listeners idempotents)
   EXPORTS : openOptions, closeOptions, initOptionsMenu
   DÉPENDANCES : aucune (module autonome, manipule uniquement le DOM)
   NOTES :
   - Cible désormais l’overlay unifié #options-overlay
   - Listeners idempotents : attachés une seule fois même après reload
   - Empêche les doublons et comportements fantômes
   - ESC ferme le panneau (listener unique grâce à { once: true })
*/

const PANEL_SELECTOR = '#options-overlay'; // 🔥 Nouveau sélecteur correct

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
