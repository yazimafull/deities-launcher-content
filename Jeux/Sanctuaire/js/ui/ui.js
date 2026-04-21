// ui.js

function initUI() {

    const pauseMenu   = document.getElementById("pause-menu");
    const resumeBtn   = document.getElementById("resume-btn");
    const restartBtn  = document.getElementById("restart-btn");
    const backMenuBtn = document.getElementById("back-menu-btn");

    // ▶ Reprendre
    if (resumeBtn) {
        resumeBtn.addEventListener("click", () => {
            pauseMenu?.classList.add("hidden");
            setState(GameState.SANCTUARY);
        });
    }

    // ↻ Redémarrer la run
    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            document.dispatchEvent(new Event("restartGame"));
        });
    }

    // ↩ Retour menu principal
    if (backMenuBtn) {
        backMenuBtn.addEventListener("click", () => {
            document.dispatchEvent(new Event("returnToMenu"));
        });
    }

    // ESC → ouvrir / fermer pause
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
