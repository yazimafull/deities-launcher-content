/* ============================================================
   CHARACTER MENU — VERSION DIABLO II
   Fusion complète : ancien système + nouveau UI + options + souris
   ============================================================ */

/* ------------------------------------------------------------
   SÉLECTEURS
------------------------------------------------------------ */

const menu = document.getElementById("character-select-menu");
const listContainer = document.getElementById("character-list");
const playBtn = document.getElementById("play-character-btn");
const createBtn = document.getElementById("create-character-btn");
const deleteBtn = document.getElementById("delete-character-btn");
const gameCanvas = document.getElementById("game-canvas");
const characterDisplay = document.getElementById("selected-character-display");

/* Options */
const optionsPanel = document.getElementById("options-panel");
const optionsBtn = document.getElementById("options-btn");
const closeOptionsBtn = document.getElementById("close-options-btn");

/* Quitter */
const quitBtn = document.getElementById("quit-btn");

/* ------------------------------------------------------------
   VARIABLES
------------------------------------------------------------ */

let selectedCharacterId = null;

/* ------------------------------------------------------------
   CHARGEMENT / SAUVEGARDE
------------------------------------------------------------ */

function loadCharacters() {
    const raw = localStorage.getItem("MS_characters");
    return raw ? JSON.parse(raw) : [];
}

function saveCharacters(chars) {
    localStorage.setItem("MS_characters", JSON.stringify(chars));
}

/* ------------------------------------------------------------
   AFFICHAGE DE LA LISTE
------------------------------------------------------------ */

function refreshCharacterList() {
    const characters = loadCharacters();
    listContainer.innerHTML = "";

    characters.forEach(char => {
        const div = document.createElement("div");
        div.className = "character-entry";
        div.textContent = `${char.name} — ${char.class} (Niv. ${char.level})`;
        div.dataset.id = char.id;

        if (char.id === selectedCharacterId) {
            div.classList.add("selected");
        }

        div.addEventListener("click", () => {
            selectedCharacterId = char.id;
            playBtn.disabled = false;
            deleteBtn.classList.remove("hidden");
            refreshCharacterList();
            refreshCharacterDisplay();
        });

        listContainer.appendChild(div);
    });

    if (characters.length === 0) {
        playBtn.disabled = true;
        deleteBtn.classList.add("hidden");
        refreshCharacterDisplay();
    }
}

/* ------------------------------------------------------------
   AFFICHAGE DU PERSONNAGE AU CENTRE
------------------------------------------------------------ */

function refreshCharacterDisplay() {
    if (!selectedCharacterId) {
        characterDisplay.innerHTML = `
            <div class="character-placeholder">
                Sélectionnez un personnage
            </div>
        `;
        return;
    }

    const characters = loadCharacters();
    const char = characters.find(c => c.id === selectedCharacterId);

    characterDisplay.innerHTML = `
        <div class="character-placeholder">
            ${char.name}<br>
            <span style="font-size:18px; opacity:0.8">${char.class}</span><br>
            <span style="font-size:16px; opacity:0.6">Niveau ${char.level}</span>
        </div>
    `;
}

/* ------------------------------------------------------------
   CRÉATION DE PERSONNAGE
------------------------------------------------------------ */

function createCharacter() {
    const name = prompt("Nom du personnage :");
    if (!name) return;

    const charClass = prompt("Classe (Mage, Guerrier, etc.) :");
    if (!charClass) return;

    const characters = loadCharacters();

    const newChar = {
        id: Date.now(),
        name: name,
        class: charClass,
        level: 1,
        xp: 0,
        stats: {},
        inventory: [],
        resources: {},
        talents: [],
        hubState: {}
    };

    characters.push(newChar);
    saveCharacters(characters);

    selectedCharacterId = newChar.id;
    refreshCharacterList();
    refreshCharacterDisplay();
}

/* ------------------------------------------------------------
   SUPPRESSION DE PERSONNAGE
------------------------------------------------------------ */

function deleteCharacter() {
    if (!selectedCharacterId) return;

    if (!confirm("Supprimer ce personnage ?")) return;

    let characters = loadCharacters();
    characters = characters.filter(c => c.id !== selectedCharacterId);

    saveCharacters(characters);

    selectedCharacterId = null;
    playBtn.disabled = true;
    deleteBtn.classList.add("hidden");

    refreshCharacterList();
    refreshCharacterDisplay();
}

/* ------------------------------------------------------------
   LANCER LE JEU
------------------------------------------------------------ */

function playGame() {
    if (!selectedCharacterId) return;

    menu.classList.add("hidden");

    gameCanvas.classList.remove("hidden");
    document.getElementById("healthbar-container").classList.remove("hidden");
    document.getElementById("xpbar-container").classList.remove("hidden");

    hideCursor();

    const characters = loadCharacters();
    const character = characters.find(c => c.id === selectedCharacterId);

    window.currentCharacter = character;

    document.dispatchEvent(new CustomEvent("startGameWithCharacter", {
        detail: character
    }));
}

/* ------------------------------------------------------------
   OPTIONS PANEL
------------------------------------------------------------ */

optionsBtn.addEventListener("click", () => {
    optionsPanel.classList.remove("hidden");
    showCursor();
});

closeOptionsBtn.addEventListener("click", () => {
    optionsPanel.classList.add("hidden");
});

/* ------------------------------------------------------------
   QUITTER LE JEU
------------------------------------------------------------ */

quitBtn.addEventListener("click", () => {
    window.electronAPI.quitGame();
});

/* ------------------------------------------------------------
   GESTION DE LA SOURIS
------------------------------------------------------------ */

function showCursor() {
    document.body.style.cursor = "default";
}

function hideCursor() {
    document.body.style.cursor = "none";
}

window.showCursor = showCursor;
window.hideCursor = hideCursor;

showCursor();

/* ------------------------------------------------------------
   ÉVÉNEMENTS
------------------------------------------------------------ */

createBtn.addEventListener("click", createCharacter);
deleteBtn.addEventListener("click", deleteCharacter);
playBtn.addEventListener("click", playGame);

/* ------------------------------------------------------------
   INITIALISATION
------------------------------------------------------------ */

refreshCharacterList();
refreshCharacterDisplay();
