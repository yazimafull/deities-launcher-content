export const GameState = {
    MENU: 0,
    PLAYING: 1,
    PAUSED: 2,
    DEAD: 3
};

let currentState = GameState.MENU;

export function setState(state) {
    currentState = state;
}

export function getState() {
    return currentState;
}
