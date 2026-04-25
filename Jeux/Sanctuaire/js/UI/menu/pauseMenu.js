import { setState, GameState } from "../../core/state.js";
import { setScreen, Screens } from "../../core/screenManager.js";

export function initPauseMenu() {

    const overlay = document.getElementById("pause-overlay");

    document.addEventListener("keydown", (e) => {

        if (e.key !== "Escape") return;

        overlay.classList.toggle("hidden");

        if (overlay.classList.contains("hidden")) {
            setState(GameState.PLAYING);
        } else {
            setState(GameState.PAUSED);
        }
    });

    document.getElementById("pause-sanctuary")?.addEventListener("click", () => {

        overlay.classList.add("hidden");

        setState(GameState.SANCTUARY);
        setScreen(Screens.SANCTUARY);
    });
}