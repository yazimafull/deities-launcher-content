// UI/menu/optionsMenu.js

const PANEL_SELECTOR = '[data-overlay="options"]';

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
// INIT
// ================================
export function initOptionsMenu() {

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
            btn.addEventListener("click", openOptions);
        });

    // ================================
    // CLOSE BUTTONS (ONLY options scope)
    // ================================
    panel.querySelectorAll('[data-action="close"]')
        .forEach(btn => {
            btn.addEventListener("click", closeOptions);
        });

    // ================================
    // CLICK OUTSIDE PANEL
    // ================================
    panel.addEventListener("click", (e) => {
        if (e.target === panel) {
            closeOptions();
        }
    });

    // ================================
    // ESC KEY (bonus clean UX)
    // ================================
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeOptions();
        }
    });

    console.log("⚙️ OptionsMenu ready");
}