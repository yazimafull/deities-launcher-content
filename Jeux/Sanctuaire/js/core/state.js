﻿// Jeux/Sanctuaire/js/core/state.js
/*
   ROUTE : core/state.js
   RÔLE : Gestion centralisée de l’état global du jeu
   EXPORTS : GameState, getState, setState, isState
   DÉPENDANCES : aucune
   NOTES :
   - PLAYING remplace l’ancien RUN (corrigé dans les autres modules)
   - setState() log l’état pour debug
*/

export const GameState = Object.freeze({
    MENU: 0,        // sélection personnage
    SANCTUARY: 1,   // hub sanctuaire
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

    // 🔥 DEBUG : essentiel pour comprendre pourquoi le Sanctuaire ne s'initialise pas
    console.log("🎮 setState →", state);
}

export function isState(state) {
    return currentState === state;
}
