// characterMenu.js
// Gestion du menu personnage : création, sélection, suppression, localStorage

let selectedClass = null;
let selectedCharacterName = null;

// ================================
// CHARGEMENT DEPUIS LOCALSTORAGE
// ================================
function loadCharacters() {
    return JSON.parse(localStorage.getItem('deitiesPersonnages') || '[]');
}

function saveCharacters(characters) {
    localStorage.setItem('deitiesPersonnages', JSON.stringify(characters));
}

// ================================
// INITIALISATION
// ================================
document.addEventListener("DOMContentLoaded", () => {

    const createBtn      = document.getElementById("create-character-btn");
    const overlay        = document.getElementById("create-overlay");
    const confirmBtn     = document.getElementById("confirm-create-btn");
    const cancelBtn      = document.getElementById("cancel-create-btn");
    const playBtn        = document.getElementById("play-character-btn");
    const deleteBtn      = document.getElementById("delete-character-btn");
    const optionsBtn     = document.getElementById("options-btn");
    const optionsPanel   = document.getElementById("options-panel");
    const closeOptionsBtn = document.getElementById("close-options-btn");

    // Charger et afficher les personnages existants
    const characters = loadCharacters();
    characters.forEach(c => addCharacterToList(c));

    // ================================
    // OUVRIR / FERMER POPUP CRÉATION
    // ================================
    createBtn.addEventListener("click", () => {
        resetCreatePanel();
        overlay.classList.remove("hidden");
    });

    cancelBtn.addEventListener("click", () => {
        overlay.classList.add("hidden");
    });

    // Clic sur le fond sombre = fermer
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.classList.add("hidden");
        }
    });

    // ================================
    // SÉLECTION DE CLASSE
    // ================================
    document.querySelectorAll(".class-card").forEach(card => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".class-card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedClass = card.dataset.class;
        });
    });

    // ================================
    // CRÉER UN PERSONNAGE
    // ================================
    confirmBtn.addEventListener("click", () => {
        const nameInput = document.getElementById("character-name-input");
        const name = nameInput.value.trim();

        if (!name) {
            alert("Veuillez entrer un pseudo !");
            return;
        }
        if (!selectedClass) {
            alert("Veuillez choisir une classe !");
            return;
        }

        const characters = loadCharacters();

        // Vérifier doublon
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
        overlay.classList.add("hidden");
    });

    // ================================
    // SUPPRIMER UN PERSONNAGE
    // ================================
    deleteBtn.addEventListener("click", () => {
        if (!selectedCharacterName) return;

        const confirmDelete = confirm(`Supprimer "${selectedCharacterName}" ?`);
        if (!confirmDelete) return;

        let characters = loadCharacters();
        characters = characters.filter(c => c.name !== selectedCharacterName);
        saveCharacters(characters);

        // Retirer de la liste visuelle
        const item = document.querySelector(`.character-item[data-name="${selectedCharacterName}"]`);
        if (item) item.remove();

        selectedCharacterName = null;
        playBtn.disabled = true;
        deleteBtn.classList.add("hidden");
    });

    // ================================
    // OPTIONS
    // ================================
    optionsBtn.addEventListener("click", () => {
        optionsPanel.classList.remove("hidden");
    });

    closeOptionsBtn.addEventListener("click", () => {
        optionsPanel.classList.add("hidden");
    });
});

// ================================
// AJOUTER UN ITEM DANS LA LISTE
// ================================
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

// ================================
// SÉLECTIONNER UN PERSONNAGE
// ================================
function selectCharacter(name) {
    selectedCharacterName = name;

    document.querySelectorAll(".character-item").forEach(i => i.classList.remove("selected"));
    const item = document.querySelector(`.character-item[data-name="${name}"]`);
    if (item) item.classList.add("selected");

    // Activer Jouer + afficher Supprimer
    document.getElementById("play-character-btn").disabled = false;
    document.getElementById("delete-character-btn").classList.remove("hidden");
}

// ================================
// RESET DU FORMULAIRE
// ================================
function resetCreatePanel() {
    document.getElementById("character-name-input").value = "";
    selectedClass = null;
    document.querySelectorAll(".class-card").forEach(c => c.classList.remove("selected"));
}