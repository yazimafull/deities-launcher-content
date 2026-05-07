// ROUTE : Jeux/Sanctuaire/js/core/autoSave.js
// RÔLE : Auto-save uniquement EN JEU, jamais dans les menus

import { saveActiveCharacter } from "./characterManager.js";

let autosaveEnabled = false;

export function enableAutosave() {
    autosaveEnabled = true;
}

export function disableAutosave() {
    autosaveEnabled = false;
}

window.addEventListener("beforeunload", () => {
    if (!autosaveEnabled) return; // ❗ NE SAUVEGARDE PAS DANS LE MENU
    saveActiveCharacter();
});
