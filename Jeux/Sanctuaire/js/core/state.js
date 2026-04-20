// state.js
export const GameState = {
    MENU: 0,        // Écran sélection personnage
    SANCTUARY: 1,   // Hub Sanctuaire
    PREPARING: 2,   // Config de la run (pylône)
    PLAYING: 3,     // Run en cours
    PAUSED: 4,      // Pause en jeu
    LEVELUP: 5,     // Choix upgrade en jeu
    DEAD: 6,        // Mort du joueur
    REWARDS: 7      // Panel récompenses fin de map
};

let currentState = GameState.MENU;

export function setState(state) {
    currentState = state;
}

export function getState() {
    return currentState;
}