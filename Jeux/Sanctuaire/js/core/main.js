// main.js

import { setState, GameState } from "./core/state.js";
import { initPauseMenu } from "./ui/pauseMenu.js";

document.addEventListener("DOMContentLoaded", () => {

    const playBtn = document.getElementById("play-character-btn");

    // BOUTON JOUER → SANCTUAIRE
    playBtn?.addEventListener("click", () => {
        if (playBtn.disabled) return;

        const selectedItem = document.querySelector(".character-item.selected");
        if (!selectedItem) return;

        const characterName = selectedItem.dataset.name;
        const characterClass = selectedItem.querySelector("small")?.textContent || "";

        // Stocker le personnage actif
        sessionStorage.setItem("activeCharacter", JSON.stringify({
            name: characterName,
            avatarClass: characterClass
        }));

        goToSanctuary();
    });

    // Initialisation du menu pause
    initPauseMenu();
});

// TRANSITION → SANCTUAIRE
export function goToSanctuary() {
    document.getElementById("character-select-menu")?.classList.add("hidden");
    document.getElementById("sanctuary-screen")?.classList.remove("hidden");
    setState(GameState.SANCTUARY);

    const active = JSON.parse(sessionStorage.getItem("activeCharacter") || "{}");
    const nameEl = document.getElementById("sanctuary-character-name");
    if (nameEl && active.name) {
        nameEl.textContent = `${active.name} — ${active.avatarClass}`;
    }
}

// TRANSITION → MENU
export function goToMenu() {
    document.getElementById("sanctuary-screen")?.classList.add("hidden");
    document.getElementById("character-select-menu")?.classList.remove("hidden");
    setState(GameState.MENU);
}
