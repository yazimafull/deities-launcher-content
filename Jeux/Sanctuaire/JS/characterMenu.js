// characterMenu.js
// Gestion du menu d'accueil : personnages, création, suppression, lancement du jeu

// Sélecteurs
const menu = document.getElementById("character-select-menu");
const listContainer = document.getElementById("character-list");
const playBtn = document.getElementById("play-character-btn");
const createBtn = document.getElementById("create-character-btn");
const deleteBtn = document.getElementById("delete-character-btn");
const gameCanvas = document.getElementById("game-canvas");

// Variable interne : personnage sélectionné
let selectedCharacterId = null;

// Charger les personnages depuis localStorage
function loadCharacters() {
    const raw = localStorage.getItem("MS_characters");
    return raw ? JSON.parse(raw) : [];
}

// Sauvegarder les personnages
function saveCharacters(chars) {
    localStorage.setItem("MS_characters", JSON.stringify(chars));
}

// Rafraîchir l'affichage de la liste
function refreshCharacterList() {
    const characters = loadCharacters();
    listContainer.innerHTML = "";

    characters.forEach(char => {
        const div = document.createElement("div");
        div.className = "character-entry";
        div.textContent = `${char.name} — ${char.class} (Niv. ${char.level})`;
        div.dataset.id = char.id;

        // Sélection visuelle
        if (char.id === selectedCharacterId) {
            div.classList.add("selected");
        }

        div.addEventListener("click", () => {
            selectedCharacterId = char.id;
            playBtn.disabled = false;
            deleteBtn.disabled = false;
            refreshCharacterList();
        });

        listContainer.appendChild(div);
    });

    // Si aucun personnage
    if (characters.length === 0) {
        playBtn.disabled = true;
        deleteBtn.disabled = true;
    }
}

// Créer un personnage
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
        hubState: {} // sanctuaire plus tard
    };

    characters.push(newChar);
    saveCharacters(characters);
    refreshCharacterList();
}

// Supprimer un personnage
function deleteCharacter() {
    if (!selectedCharacterId) return;

    if (!confirm("Supprimer ce personnage ?")) return;

    let characters = loadCharacters();
    characters = characters.filter(c => c.id !== selectedCharacterId);

    saveCharacters(characters);

    selectedCharacterId = null;
    playBtn.disabled = true;
    deleteBtn.disabled = true;

    refreshCharacterList();
}

// Lancer le jeu avec le personnage sélectionné
function playGame() {
    if (!selectedCharacterId) return;

    // Masquer le menu
    menu.style.display = "none";

    // Afficher le canvas du jeu
    gameCanvas.classList.remove("hidden");

    // Charger le personnage sélectionné
    const characters = loadCharacters();
    const character = characters.find(c => c.id === selectedCharacterId);

    // Envoyer le personnage au main.js
    window.currentCharacter = character;

    // Déclencher un événement pour signaler à main.js que le jeu peut démarrer
    document.dispatchEvent(new CustomEvent("startGameWithCharacter", {
        detail: character
    }));
}

// Événements
createBtn.addEventListener("click", createCharacter);
deleteBtn.addEventListener("click", deleteCharacter);
playBtn.addEventListener("click", playGame);

// Initialisation
refreshCharacterList();
