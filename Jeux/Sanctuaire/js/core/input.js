 // input.js

export const keys = Object.create(null);

// ================================
// INPUT STATE
// ================================
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

// ================================
// HANDLERS
// ================================
function onKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
}

function onKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
}

// ================================
// API
// ================================
export function isDown(key) {
    return keys[key.toLowerCase()] === true;
}

// option utile pour debug / reset run
export function resetInput() {
    for (const k in keys) {
        keys[k] = false;
    }
}