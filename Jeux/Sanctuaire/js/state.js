export const GameState = {
    MENU: 0,
    PLAYING: 1,
    PAUSED: 2,
    LEVELUP: 3,
    GAMEOVER: 4
};

export let currentState = GameState.MENU;

export function setState(newState) {
    currentState = newState;
}
