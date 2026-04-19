import { GameState, setState } from "./state.js";

/* ============================================================
   UI EN JEU — PAUSE / REPRENDRE / RELANCER / RETOUR MENU
   ============================================================ */

export function initUI() {

    const pauseMenu = document.getElementById("pause-menu");
    const resumeBtn = document.getElementById("resume-btn");
    const restartBtn = document.getElementById("restart-btn");
    const backMenuBtn = document.getElementById("back-menu-btn");

    /* ------------------------------------------------------------
       REPRENDRE
    ------------------------------------------------------------ */
    if (resumeBtn) {
        resumeBtn.addEventListener("click", () => {
            pauseMenu?.classList.add("hidden");
            setState(GameState.PLAYING);
        });
    }

    /* ------------------------------------------------------------
       RELANCER LA PARTIE
       (main.js doit écouter l'événement "restartGame")
    ------------------------------------------------------------ */
    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            document.dispatchEvent(new Event("restartGame"));
        });
    }

    /* ------------------------------------------------------------
       RETOUR AU MENU PRINCIPAL
       (main.js doit écouter l'événement "returnToMenu")
    ------------------------------------------------------------ */
    if (backMenuBtn) {
        backMenuBtn.addEventListener("click", () => {
            document.dispatchEvent(new Event("returnToMenu"));
        });
    }

    /* ------------------------------------------------------------
       ÉCHAPPE — OUVRIR / FERMER LE MENU PAUSE
    ------------------------------------------------------------ */
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (pauseMenu?.classList.contains("hidden")) {
                pauseMenu.classList.remove("hidden");
                setState(GameState.PAUSED);
            } else {
                pauseMenu.classList.add("hidden");
                setState(GameState.PLAYING);
            }
        }
    });
}

/* ============================================================
   FUTUR : UI LEVEL-UP, PANNEAUX, ETC.
============================================================ */
export function updateUI() {
    // sera utilisé plus tard
}
