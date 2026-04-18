import { GameState, setState } from "./state.js";

export function initUI() {
    document.getElementById("play-btn").addEventListener("click", () => {
        setState(GameState.PLAYING);
        document.getElementById("main-menu").classList.add("hidden");
    });

    document.getElementById("resume-btn").addEventListener("click", () => {
        setState(GameState.PLAYING);
        document.getElementById("pause-menu").classList.add("hidden");
    });

    document.getElementById("back-menu-btn").addEventListener("click", () => {
        setState(GameState.MENU);
        document.getElementById("pause-menu").classList.add("hidden");
        document.getElementById("main-menu").classList.remove("hidden");
    });
}

export function updateUI() {
    // futur menu level-up
}
