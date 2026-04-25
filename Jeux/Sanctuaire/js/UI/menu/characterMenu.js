// ui/menu/characterMenu.js

// ================================
// STATE LOCAL
// ================================
export let selectedClass = null;
export let selectedCharacterName = null;

const STORAGE_KEY = "deitiesPersonnages";

// ================================
// STORAGE
// ================================
export function loadCharacters() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function saveCharacters(characters) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
}

// ================================
// INIT (appelé par loader)
// ================================
export function initCharacterMenu() {

    const list = document.querySelector('[data-role="character-list"]');
    const playBtn = document.querySelector('[data-action="play"]');
    const deleteBtn = document.querySelector('[data-action="delete-character"]');

    if (!list) return;

    // reset UI
    list.innerHTML = "";
    selectedCharacterName = null;

    // load characters
    loadCharacters().forEach(addCharacterToList);

    // reset buttons
    if (playBtn) playBtn.disabled = true;
    if (deleteBtn) deleteBtn.classList.add("hidden");

    bindEvents();

    console.log("✅ CharacterMenu ready");
}

// ================================
// EVENTS
// ================================
function bindEvents() {

    const createBtn = document.querySelector('[data-action="create-character"]');
    const playBtn   = document.querySelector('[data-action="play"]');
    const deleteBtn = document.querySelector('[data-action="delete-character"]');

    const createOverlay = document.querySelector('[data-overlay="create-character"]');
    const deleteOverlay = document.querySelector('[data-overlay="delete-character"]');

    const confirmCreate = document.querySelector('[data-action="confirm-create"]');
    const confirmDelete = document.querySelector('[data-action="confirm-delete"]');

    const cancelBtns = document.querySelectorAll('[data-action="close"]');

    // ================================
    // OPEN CREATE
    // ================================
    createBtn?.addEventListener("click", () => {
        resetCreatePanel();
        createOverlay?.classList.remove("hidden");
    });

    // ================================
    // CLOSE OVERLAYS
    // ================================
    cancelBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            createOverlay?.classList.add("hidden");
            deleteOverlay?.classList.add("hidden");
        });
    });

    // ================================
    // CLASS SELECT
    // ================================
    document.querySelectorAll(".class").forEach(btn => {
        btn.addEventListener("click", () => {

            document.querySelectorAll(".class")
                .forEach(b => b.classList.remove("selected"));

            btn.classList.add("selected");
            selectedClass = btn.dataset.class;
        });
    });

    // ================================
    // CREATE CHARACTER
    // ================================
    confirmCreate?.addEventListener("click", () => {

        const input = document.querySelector('[data-input="name"]');
        const name = input?.value.trim();

        if (!name) return alert("Nom requis");
        if (!selectedClass) return alert("Classe requise");

        const chars = loadCharacters();

        if (chars.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            return alert("Nom déjà utilisé");
        }

        const newChar = {
            name,
            avatarClass: selectedClass
        };

        chars.push(newChar);
        saveCharacters(chars);

        addCharacterToList(newChar);
        selectCharacter(newChar.name);

        createOverlay?.classList.add("hidden");

        if (playBtn) playBtn.disabled = false;
    });

    // ================================
    // DELETE CHARACTER
    // ================================
    deleteBtn?.addEventListener("click", () => {

        if (!selectedCharacterName) return;

        deleteOverlay?.classList.remove("hidden");

        const label = document.querySelector('[data-role="delete-name"]');
        if (label) label.textContent = selectedCharacterName;
    });

    confirmDelete?.addEventListener("click", () => {

        let chars = loadCharacters();

        chars = chars.filter(c => c.name !== selectedCharacterName);

        saveCharacters(chars);

        document
            .querySelector(`.character-item[data-name="${selectedCharacterName}"]`)
            ?.remove();

        selectedCharacterName = null;

        deleteOverlay?.classList.add("hidden");

        if (playBtn) playBtn.disabled = true;
        deleteBtn?.classList.add("hidden");
    });

    // ⚠️ IMPORTANT :
    // ❌ PAS de logique PLAY ici
    // 👉 c'est main.js qui gère le lancement
}

// ================================
// UI
// ================================
export function addCharacterToList(character) {

    const list = document.querySelector('[data-role="character-list"]');
    if (!list) return;

    const el = document.createElement("div");

    el.className = "character-item";
    el.dataset.name = character.name;

    el.innerHTML = `
        <span>${character.name}</span>
        <small>${character.avatarClass}</small>
    `;

    el.addEventListener("click", () => selectCharacter(character.name));

    list.appendChild(el);
}

// ================================
// SELECT CHARACTER
// ================================
export function selectCharacter(name) {

    selectedCharacterName = name;

    document.querySelectorAll(".character-item")
        .forEach(i => i.classList.remove("selected"));

    document
        .querySelector(`.character-item[data-name="${name}"]`)
        ?.classList.add("selected");

    const playBtn = document.querySelector('[data-action="play"]');
    const deleteBtn = document.querySelector('[data-action="delete-character"]');

    if (playBtn) playBtn.disabled = false;
    if (deleteBtn) deleteBtn.classList.remove("hidden");
}

// ================================
// RESET CREATE PANEL
// ================================
export function resetCreatePanel() {

    const input = document.querySelector('[data-input="name"]');
    if (input) input.value = "";

    selectedClass = null;

    document.querySelectorAll(".class")
        .forEach(b => b.classList.remove("selected"));
}