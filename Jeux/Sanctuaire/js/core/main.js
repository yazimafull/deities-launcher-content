// main.js
import { setState, GameState } from "./state.js";
import { initPauseMenu } from "../UI/menu/pauseMenu.js";

// Constantes
const MENU_ID = "character-select-menu";
const SANCTUARY_ID = "sanctuary-screen";
const ACTIVE_CHARACTER_KEY = "activeCharacter";

document.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.getElementById("play-character-btn");

    playBtn?.addEventListener("click", () => {
        if (playBtn.disabled) return;

        const selectedItem = document.querySelector(".character-item.selected");
        if (!selectedItem) return;

        const characterName = selectedItem.dataset.name;
        const characterClass = selectedItem.querySelector("small")?.textContent || "";

        // Validation des données du personnage
        if (!characterName || !characterClass) {
            console.error("Les données du personnage sont incomplètes");
            return;
        }

        // Stocker le personnage actif
        sessionStorage.setItem(
            ACTIVE_CHARACTER_KEY,
            JSON.stringify({ name: characterName, avatarClass: characterClass })
        );

        goToSanctuary();
    });

    initPauseMenu();
});

// Transition vers le Sanctuaire
export function goToSanctuary() {
    document.getElementById(MENU_ID)?.classList.add("hidden");
    document.getElementById(SANCTUARY_ID)?.classList.remove("hidden");
    setState(GameState.SANCTUARY);

    const active = JSON.parse(sessionStorage.getItem(ACTIVE_CHARACTER_KEY) || "{}");
    const nameEl = document.getElementById("sanctuary-character-name");
    if (nameEl && active.name) {
        nameEl.textContent = `${active.name} - ${active.avatarClass}`; // Correction : remplacement de `—` par `-`
    }
}

// Expose la fonction globalement pour qu'elle soit accessible depuis d'autres scripts
window.goToSanctuary = goToSanctuary;

// Transition vers le Menu
export function goToMenu() {
    document.getElementById(SANCTUARY_ID)?.classList.add("hidden");
    document.getElementById(MENU_ID)?.classList.remove("hidden");
    setState(GameState.MENU);
}

// Expose la fonction globalement pour qu'elle soit accessible depuis d'autres scripts
window.goToMenu = goToMenu;