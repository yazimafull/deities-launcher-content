// main.js

import { setState, GameState } from "./state.js";
import { initPauseMenu } from "../UI/menu/pauseMenu.js";

const ACTIVE_CHARACTER_KEY = "activeCharacter";

document.addEventListener("DOMContentLoaded", () => {

    const playBtn = document.querySelector('[data-action="play"]');

    playBtn?.addEventListener("click", () => {

        if (playBtn.disabled) return;

        const selectedItem = document.querySelector(".character-item.selected");
        if (!selectedItem) return;

        const characterName = selectedItem.dataset.name;
        const characterClass = selectedItem.querySelector("small")?.textContent || "";

        if (!characterName || !characterClass) {
            console.error("Personnage invalide");
            return;
        }

        sessionStorage.setItem(
            ACTIVE_CHARACTER_KEY,
            JSON.stringify({
                name: characterName,
                avatarClass: characterClass
            })
        );

        goToSanctuary();
    });

    initPauseMenu();
});

// =========================
// SANCTUARY
// =========================
export function goToSanctuary() {

    const menu = document.querySelector('[data-screen="character-select"]');
    const sanctuary = document.querySelector('[data-screen="sanctuary"]');

    menu?.classList.add("hidden");
    sanctuary?.classList.remove("hidden");

    setState(GameState.SANCTUARY);

    const active = JSON.parse(sessionStorage.getItem(ACTIVE_CHARACTER_KEY) || "{}");

    const nameEl = document.querySelector('[data-role="character-name"]');

    if (nameEl && active.name) {
        nameEl.textContent = `${active.name} - ${active.avatarClass}`;
    }
}

window.goToSanctuary = goToSanctuary;


// =========================
// MENU
// =========================
export function goToMenu() {

    const menu = document.querySelector('[data-screen="character-select"]');
    const sanctuary = document.querySelector('[data-screen="sanctuary"]');

    sanctuary?.classList.add("hidden");
    menu?.classList.remove("hidden");

    setState(GameState.MENU);
}

window.goToMenu = goToMenu;