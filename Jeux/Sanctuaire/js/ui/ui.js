// UI/ui.js

import { GameState, setState } from "../core/state.js";

function initUI() {
    const pauseOverlay  = document.getElementById("pause-overlay");
    const resumeBtn     = document.getElementById("pause-resume");
    const pauseOptionsBtn = document.getElementById("pause-options");
    const pauseSanctuaryBtn = document.getElementById("pause-sanctuary");

    // ▶ Reprendre
    if (resumeBtn) {
        resumeBtn.addEventListener("click", () => {
            pauseOverlay?.classList.add("hidden");
            setState(GameState.PLAYING);
        });
    }

    // ⚙ Options (en j
