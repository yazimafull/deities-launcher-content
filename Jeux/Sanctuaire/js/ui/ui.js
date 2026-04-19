import { GameState, setState } from "../core/state.js";

export function initUI() {

    const pauseMenu = document.getElementById("pause-menu");
    const resumeBtn = document.getElementById("resume-btn");
    const restartBtn = document.getElementById("restart-btn");
    const backMenuBtn = document.getElementById("back-menu-btn");

    if (resumeBtn) {
        resumeBtn.addEventListener("click", () => {
            pauseMenu?.classList.add("hidden");
            setState(GameState.SANCTUARY);
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            document.dispatchEvent(new Event("restartGame"));
        });
    }

    if (backMenuBtn) {
        backMenuBtn.addEventListener("click", () => {
            document.dispatchEvent(new Event("returnToMenu"));
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (pauseMenu?.classList.contains("hidden")) {
                pauseMenu.classList.remove("hidden");
                setState(GameState.PAUSED);
            } else {
                pauseMenu.classList.add("hidden");
                setState(GameState.SANCTUARY);
            }
        }
    });
}
