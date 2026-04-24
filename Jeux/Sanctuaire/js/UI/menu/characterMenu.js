// ui/menu/characterMenu.js

export let selectedClass = null;
export let selectedCharacterName = null;

// ================================
// STORAGE
// ================================
export function loadCharacters() {
    return JSON.parse(localStorage.getItem("deitiesPersonnages") || "[]");
}

export function saveCharacters(characters) {
    localStorage.setItem("deitiesPersonnages", JSON.stringify(characters));
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {

    const $ = (id) => document.getElementById(id);

    const createBtn        = $("create-character-btn");
    const createOverlay    = $("create-overlay");

    const confirmBtn       = $("confirm-create-btn");
    const cancelBtn        = $("cancel-create-btn");

    const playBtn          = $("play-character-btn");
    const deleteBtn        = $("delete-character-btn");

    const deleteOverlay    = $("delete-overlay");
    const confirmDeleteBtn = $("confirm-delete-btn");
    const cancelDeleteBtn  = $("cancel-delete-btn");
    const deleteNameLabel  = $("delete-character-name");

    const optionsBtn       = $("options-btn");
    const optionsPanel     = $("options-panel");
    const closeOptionsBtn  = $("close-options-btn");

    const list             = $("character-list");

    if (!list) return;

    // ================================
    // LOAD CHARACTERS
    // ================================
    loadCharacters().forEach(addCharacterToList);

    // ================================
    // CREATE POPUP
    // ================================
    createBtn?.addEventListener("click", () => {
        resetCreatePanel();
        createOverlay?.classList.remove("hidden");
    });

    cancelBtn?.addEventListener("click", () => {
        createOverlay?.classList.add("hidden");
    });

    createOverlay?.addEventListener("click", (e) => {
        if (e.target === createOverlay) {
            createOverlay.classList.add("hidden");
        }
    });

    // ================================
    // CLASS SELECT
    // ================================
    document.querySelectorAll(".class-card").forEach(card => {

        card.addEventListener("click", () => {

            document.querySelectorAll(".class-card")
                .forEach(c => c.classList.remove("selected"));

            card.classList.add("selected");
            selectedClass = card.dataset.class;
        });
    });

    // ================================
    // CREATE CONFIRM
    // ================================
    confirmBtn?.addEventListener("click", () => {

        const input = $("character-name-input");
        const name = input?.value.trim();

        if (!name) return alert("Veuillez entrer un pseudo !");
        if (!selectedClass) return alert("Veuillez choisir une classe !");

        const characters = loadCharacters();

        if (characters.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            return alert("Ce nom existe déjà !");
        }

        const newChar = {
            name,
            avatarClass: selectedClass
        };

        characters.push(newChar);
        saveCharacters(characters);

        addCharacterToList(newChar);
        selectCharacter(newChar.name);

        if (playBtn) playBtn.disabled = false;
        createOverlay?.classList.add("hidden");
    });

    // ================================
    // DELETE POPUP
    // ================================
    deleteBtn?.addEventListener("click", () => {

        if (!selectedCharacterName) return;

        if (deleteNameLabel) {
            deleteNameLabel.textContent = selectedCharacterName;
        }

        deleteOverlay?.classList.remove("hidden");
    });

    cancelDeleteBtn?.addEventListener("click", () => {
        deleteOverlay?.classList.add("hidden");
    });

    deleteOverlay?.addEventListener("click", (e) => {
        if (e.target === deleteOverlay) {
            deleteOverlay.classList.add("hidden");
        }
    });

    confirmDeleteBtn?.addEventListener("click", () => {

        let characters = loadCharacters();

        characters = characters.filter(
            c => c.name !== selectedCharacterName
        );

        saveCharacters(characters);

        document
            .querySelector(`.character-item[data-name="${selectedCharacterName}"]`)
            ?.remove();

        selectedCharacterName = null;

        if (playBtn) playBtn.disabled = true;
        deleteBtn?.classList.add("hidden");

        deleteOverlay?.classList.add("hidden");
    });

    // ================================
    // OPTIONS
    // ================================
    optionsBtn?.addEventListener("click", () => {
        optionsPanel?.classList.remove("hidden");
    });

    closeOptionsBtn?.addEventListener("click", () => {
        optionsPanel?.classList.add("hidden");
    });
});

// ================================
// UI HELPERS
// ================================
export function addCharacterToList(character) {

    const list = document.getElementById("character-list");
    if (!list) return;

    const item = document.createElement("div");

    item.className = "character-item";
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

// ================================
// SELECT
// ================================
export function selectCharacter(name) {

    selectedCharacterName = name;

    document.querySelectorAll(".character-item")
        .forEach(i => i.classList.remove("selected"));

    document
        .querySelector(`.character-item[data-name="${name}"]`)
        ?.classList.add("selected");

    const playBtn = document.getElementById("play-character-btn");
    const deleteBtn = document.getElementById("delete-character-btn");

    if (playBtn) playBtn.disabled = false;
    if (deleteBtn) deleteBtn.classList.remove("hidden");
}

// ================================
// RESET
// ================================
export function resetCreatePanel() {

    const input = document.getElementById("character-name-input");

    if (input) input.value = "";

    selectedClass = null;

    document.querySelectorAll(".class-card")
        .forEach(c => c.classList.remove("selected"));
}