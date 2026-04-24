// js/core/state.js

export const GameState = Object.freeze({
    MENU: 0,        // sélection personnage
    SANCTUARY: 1,   // hub
    PREPARING: 2,   // config run (pylône)
    PLAYING: 3,     // gameplay
    PAUSED: 4,      // pause
    LEVELUP: 5,     // choix upgrades
    DEAD: 6,        // mort joueur
    REWARDS: 7      // fin de run / loot
});

// ================================
// STATE ENGINE
// ================================
let currentState = GameState.MENU;

export function getState() {
    return currentState;
}

export function setState(state) {
    if (state === undefined || state === null) return;
    currentState = state;
}

// (optionnel mais utile plus tard)
export function isState(state) {
    return currentState === state;
}