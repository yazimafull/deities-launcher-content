// input.js
/*
   ROUTE : core/input.js
   RÔLE : Gestion des entrées physiques (clavier + souris)
   EXPORTS : isDown, isActionDown, resetInput
   DÉPENDANCES : keybinds.js (pour les actions configurables)
*/

import { getKey } from "./keybinds.js";
import { DebugStats } from "../systems/debug/debugStats.js"; // adapte le chemin si besoin


// ================================
// INTERNAL STATE
// ================================
export const keys = Object.create(null);
export const mouseButtons = Object.create(null);

// ================================
// KEYBOARD LISTENERS
// ================================
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

function onKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
}

function onKeyDown(e) {
    const key = e.key.toLowerCase();
    keys[key] = true;

    // Toggle panneau debug (C)
    if (key === "c") {
        DebugStats.enabled = !DebugStats.enabled;
    }
}

// ================================
// MOUSE LISTENERS
// ================================
window.addEventListener("mousedown", (e) => {
    mouseButtons[e.button] = true;
});

window.addEventListener("mouseup", (e) => {
    mouseButtons[e.button] = false;
});

// ================================
// RAW INPUT API (physique)
// ================================
export function isDown(key) {
    return keys[key.toLowerCase()] === true;
}

export function isMouseDown(btn) {
    return mouseButtons[btn] === true;
}

// ================================
// ACTION API (configurable)
// ================================
export function isActionDown(action) {
    const key = getKey(action);
    if (!key) return false; // action sans touche assignée

    // Souris
    if (key.startsWith("mouse")) {
        const btn =
            key === "mouse0" ? 0 :
            key === "mouse1" ? 1 :
            key === "mouse2" ? 2 : null;

        if (btn === null) return false;
        return isMouseDown(btn);
    }

    // Clavier
    return isDown(key);
}

// ================================
// RESET (utile pour changement d'écran / debug)
// ================================
export function resetInput() {
    for (const k in keys) keys[k] = false;
    for (const b in mouseButtons) mouseButtons[b] = false;
}
