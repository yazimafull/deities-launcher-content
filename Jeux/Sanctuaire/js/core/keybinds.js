// core/keybinds.js
/*
   ROUTE : core/keybinds.js
   RÔLE : Gestion centralisée des raccourcis configurables
   EXPORTS : getKey, setKey, getAllKeybinds, loadKeybinds, saveKeybinds
   DÉPENDANCES : aucune
   NOTES :
     - Toutes les touches configurables sont définies ici
     - Sauvegarde automatique dans localStorage
     - Compatible avec input.js (isDown)
*/

// ================================
// DEFAULT KEYBINDS
// ================================
const DEFAULT_BINDS = {
    // Déplacements
    "move-up": "z",
    "move-down": "s",
    "move-left": "q",
    "move-right": "d",

    // Gameplay
    "click-to-move": "mouse0",   // clic gauche
    "auto-attack-toggle": null,  // optionnel

    // Debug
    "debug-agro": "j",
    "debug-autoattack": "k",
    "debug-grid": null,          // si tu veux une touche plus tard

    // HUD
    "hud-edit": "h",

    // Système
    "pause": "escape",
};

// ================================
// INTERNAL STATE
// ================================
let keybinds = { ...DEFAULT_BINDS };

// ================================
// LOAD / SAVE
// ================================
export function loadKeybinds() {
    const saved = localStorage.getItem("keybinds");
    if (saved) {
        try {
            keybinds = { ...DEFAULT_BINDS, ...JSON.parse(saved) };
        } catch (e) {
            console.warn("Keybinds corrompus, reset.");
            keybinds = { ...DEFAULT_BINDS };
        }
    }
}

export function saveKeybinds() {
    localStorage.setItem("keybinds", JSON.stringify(keybinds));
}

// Charger immédiatement
loadKeybinds();

// ================================
// API
// ================================
export function getKey(action) {
    return keybinds[action] || null;
}

export function setKey(action, key) {
    keybinds[action] = key;
    saveKeybinds();
}

export function getAllKeybinds() {
    return { ...keybinds };
}

// ================================
// RESET COMPLET
// ================================
export function resetKeybinds() {
    keybinds = { ...DEFAULT_BINDS };
    saveKeybinds();
}
