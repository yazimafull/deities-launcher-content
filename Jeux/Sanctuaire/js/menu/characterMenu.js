// characterMenu.js
// Logique du menu de personnages + panel de création

let selectedClass = null;
let selectedCharacterName = null;
const characters = []; // Tu pourras remplacer par ton système de sauvegarde

document.addEventListener("DOMContentLoaded", () => {
    const createBtn = document.getElementById("create-character-btn");
    const overlay = document.getElementById("create-character-overlay");
    const panel = document.getElementById("create-character-panel");
    const cancelBtn = document.getElementById("cancel-create");
    const confirmBtn = document.getElementById("confirm-create");
    const playBtn = document.getElementById("play-btn");

    // OUVERTURE PANEL
    createBtn.addEventListener("click", () => {
        overlay.classList.remove("hidden");
        panel.classList.remove("hidden");
        resetCreatePanel();
    });

    // FERMETURE PANEL
    cancelBtn.addEventListener("click", () => {
        closeCreatePanel();
    });

    overlay.addEventListener("click", () => {
        closeCreatePanel();
    });

    // SELECTION CLASSE
    document.querySelectorAll(".class-card").forEach(card => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".class-card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedClass = card.dataset.class;
        });
    });

    // CREATION PERSONNAGE
    confirmBtn.addEventListener("click", () => {
        const pseudoInput = document.getElementById("char-pseudo");
        const pseudo = pseudoInput.value.trim();

        if (!pseudo) {
            alert("Veuillez entrer un pseudo.");
            return;
        }
        if (!selectedClass) {
            alert("Veuillez choisir une classe.");
            return;
        }

        const newCharacter = {
            name: pseudo,
            avatarClass: selectedClass
        };

        characters.push(newCharacter);
        addCharacterToList(newCharacter);
        selectCharacter(newCharacter.name);

        playBtn.disabled = false;
        closeCreatePanel();
    });
});

function closeCreatePanel() {
    document.getElementById("create-character-overlay").classList.add("hidden");
    document.getElementById("create-character-panel").classList.add("hidden");
}

function resetCreatePanel() {
    const pseudoInput = document.getElementById("char-pseudo");
    pseudoInput.value = "";
    selectedClass = null;
    document.querySelectorAll(".class-card").forEach(c => c.classList.remove("selected"));
}

// AJOUT DANS LA LISTE
function addCharacterToList(character) {
    const list = document.getElementById("character-list");

    const item = document.createElement("div");
    item.classList.add("character-item");
    item.dataset.name = character.name;
    item.innerHTML = `
        <span>${character.name}</span>
        <small>${character.avatarClass}</small>
    `;

    item.addEventListener("click", () => {
        selectCharacter(character.name);
    });

    list.appendChild(item);
}

// SELECTION D’UN PERSONNAGE
function selectCharacter(name) {
    selectedCharacterName = name;
    document.querySelectorAll(".character-item").forEach(i => i.classList.remove("selected"));
    const item = document.querySelector(`.character-item[data-name="${name}"]`);
    if (item) item.classList.add("selected");
}
