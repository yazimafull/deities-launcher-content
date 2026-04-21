// characterMenu.js

export let selectedClass = null;
export let selectedCharacterName = null;

export function loadCharacters() {
    return JSON.parse(localStorage.getItem('deitiesPersonnages') || '[]');
}

export function saveCharacters(characters) {
    localStorage.setItem('deitiesPersonnages', JSON.stringify(characters));
}

document.addEventListener("DOMContentLoaded", () => {

    const createBtn        = document.getElementById("create-character-btn");
    const createOverlay    = document.getElementById("create-overlay");
    const confirmBtn       = document.getElementById("confirm-create-btn");
    const cancelBtn        = document.getElementById("cancel-create-btn");
    const playBtn          = document.getElementById("play-character-btn");
    const deleteBtn        = document.getElementById("delete-character-btn");
    const deleteOverlay    = document.getElementById("delete-overlay");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
    const cancelDeleteBtn  = document.getElementById("cancel-delete-btn");
    const deleteNameLabel  = document.getElementById("delete-character-name");
    const optionsBtn       = document.getElementById("options-btn");
    const optionsPanel     = document.getElementById("options-panel");
    const closeOptionsBtn  = document.getElementById("close-options-btn");

    // Charger les personnages existants
    loadCharacters().forEach(c => addCharacterToList(c));

    // ================================
    // POPUP CRÉATION
    // ================================
    createBtn.addEventListener("click", () => {
        resetCreatePanel();
        createOverlay.classList.remove("hidden");
    });

    cancelBtn.addEventListener("click", () => {
        createOverlay.classList.add("hidden");
    });

    createOverlay.addEventListener("click", (e) => {
        if (e.target === createOverlay) createOverlay.classList.add("hidden");
    });

    // Sélection classe
    document.querySelectorAll(".class-card").forEach(card => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".class-card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedClass = card.dataset.class;
        });
    });

    // Confirmer création
    confirmBtn.addEventListener("click", () => {
        const nameInput = document.getElementById("character-name-input");
        const name = nameInput.value.trim();

        if (!name) { alert("Veuillez entrer un pseudo !"); return; }
        if (!selectedClass) { alert("Veuillez choisir une classe !"); return; }

        const characters = loadCharacters();
        if (characters.find(c => c.name.toLowerCase() === name.toLowerCase())) {
            alert("Un personnage avec ce nom existe déjà !");
            return;
        }

        const newCharacter = { name, avatarClass: selectedClass };
        characters.push(newCharacter);
        saveCharacters(characters);

        addCharacterToList(newCharacter);
        selectCharacter(newCharacter.name);

        playBtn.disabled = false;
        createOverlay.classList.add("hidden");
    });

    // ================================
    // POPUP SUPPRESSION
    // ================================
    deleteBtn.addEventListener("click", () => {
        if (!selectedCharacterName) return;
        deleteNameLabel.textContent = selectedCharacterName;
        deleteOverlay.classList.remove("hidden");
    });

    cancelDeleteBtn.addEventListener("click", () => {
        deleteOverlay.classList.add("hidden");
    });

    deleteOverlay.addEventListener("click", (e) => {
        if (e.target === deleteOverlay) deleteOverlay.classList.add("hidden");
    });

    confirmDeleteBtn.addEventListener("click", () => {
        let characters = loadCharacters();
        characters = characters.filter(c => c.name !== selectedCharacterName);
        saveCharacters(characters);

        const item = document.querySelector(`.character-item[data-name="${selectedCharacterName}"]`);
        if (item) item.remove();

        selectedCharacterName = null;
        playBtn.disabled = true;
        deleteBtn.classList.add("hidden");
        deleteOverlay.classList.add("hidden");
    });

    // ================================
    // OPTIONS
    // ================================
    optionsBtn.addEventListener("click", () => optionsPanel.classList.remove("hidden"));
    closeOptionsBtn.addEventListener("click", () => optionsPanel.classList.add("hidden"));
});

export function addCharacterToList(character) {
    const list = document.getElementById("character-list");
    const item = document.createElement("div");
    item.classList.add("character-item");
    item.dataset.name = character.name;
    item.innerHTML = `
        <span>${character.name}</span>
        <small>${character.avatarClass}</small>
    `;
    item.addEventListener("click", () => selectCharacter(character.name));
    list.appendChild(item);
}

export function selectCharacter(name) {
    selectedCharacterName = name;
    document.querySelectorAll(".character-item").forEach(i => i.classList.remove("selected"));
    const item = document.querySelector(`.character-item[data-name="${name}"]`);
    if (item) item.classList.add("selected");
    document.getElementById("play-character-btn").disabled = false;
    document.getElementById("delete-character-btn").classList.remove("hidden");
}

export function resetCreatePanel() {
    document.getElementById("character-name-input").value = "";
    selectedClass = null;
    document.querySelectorAll(".class-card").forEach(c => c.classList.remove("selected"));
}
