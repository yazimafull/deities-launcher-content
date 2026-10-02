// ROUTE : js/ui/menu/characterMenu.js
// ROLE  : Gestion du menu personnage (sélection, création, suppression)

import {
    getCharacters,
    createCharacter,
    deleteCharacter,
    setActiveCharacter,
    getActiveCharacterId,
} from "../../core/characterManager.js";


// ============================================================================
// SELECTEURS
// ============================================================================
const screen = document.querySelector('[data-screen="character-select"]');
const listContainer = screen.querySelector('[data-role="character-list"]');

// Boutons
const createBtn = screen.querySelector('[data-action="create-character"]');
const deleteBtn = screen.querySelector('[data-action="delete-character"]');
const playBtn = screen.querySelector('[data-action="play"]');

// Overlays
const createOverlay = screen.querySelector('[data-overlay="create-character"]');
const deleteOverlay = screen.querySelector('[data-overlay="delete-character"]');

// Inputs création
const nameInput = createOverlay.querySelector('[data-input="name"]');
let selectedClass = null;

// Nom du perso à supprimer
const deleteNameLabel = deleteOverlay.querySelector('[data-role="delete-name"]');

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================
/**
 * Crée un élément DOM avec une classe et un contenu texte.
 * @param {string} tag - Balise HTML (ex: "div").
 * @param {string} className - Classe CSS.
 * @param {string} text - Contenu texte.
 * @returns {HTMLElement} - Élément DOM créé.
 */
function createElement(tag, className, text = "") {
    const el = document.createElement(tag);
    el.className = className;
    if (text) el.textContent = text;
    return el;
}

/**
 * Parse les données d'un personnage depuis localStorage.
 * @param {string} id - ID du personnage.
 * @returns {object|null} - Objet profil ou null si erreur.
 */
function getCharacterProfile(id) {
    const raw = localStorage.getItem(`character_${id}`);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error(`Erreur de parsing pour l'ID ${id}:`, e);
        return null;
    }
}

// ============================================================================
// RENDU DE LA LISTE
// ============================================================================
function renderCharacterList() {
    const ids = getCharacters();
    listContainer.innerHTML = "";

    const fragment = document.createDocumentFragment(); // Optimisation DOM

    for (const id of ids) {
        const profile = getCharacterProfile(id);
        if (!profile) continue;

        // Création des éléments
        const item = createElement("div", "character-item");
        item.dataset.id = id;

        item.appendChild(createElement("div", "char-name", profile.name));
        item.appendChild(createElement("div", "char-class", profile.classe));
        item.appendChild(createElement("div", "char-level", "Niv. " + (profile.soulLevel ?? 1)));

        // Gestion de la sélection
        item.addEventListener("click", () => selectCharacter(id));
        if (getActiveCharacterId() === id) {
            item.classList.add("selected");
        }
        console.log("PROFILE:", profile);

        fragment.appendChild(item);
    }

    listContainer.appendChild(fragment);
    updatePlayButton();
    updateDeleteButton();
}

// ============================================================================
// GESTION DE LA SÉLECTION
// ============================================================================
function selectCharacter(id) {
    setActiveCharacter(id);

    // Désélectionne tous les éléments
    listContainer.querySelectorAll(".character-item")
        .forEach(el => el.classList.remove("selected"));

    // Sélectionne l'élément cliqué
    const selectedItem = listContainer.querySelector(`[data-id="${id}"]`);
    if (selectedItem) selectedItem.classList.add("selected");

    updatePlayButton();
    updateDeleteButton();
}

// ============================================================================
// GESTION DES BOUTONS
// ============================================================================
function updatePlayButton() {
    playBtn.disabled = !getActiveCharacterId();
}

function updateDeleteButton() {
    deleteBtn.classList.toggle("hidden", !getActiveCharacterId());
}

// ============================================================================
// CRÉATION DE PERSONNAGE
// ============================================================================
function openCreateOverlay() {
    nameInput.value = "";
    selectedClass = null;

    // Réinitialise la sélection des classes
    createOverlay.querySelectorAll("[data-class]")
        .forEach(btn => btn.classList.remove("selected"));

    createOverlay.classList.remove("hidden");
}

function closeCreateOverlay() {
    createOverlay.classList.add("hidden");
}

function confirmCreate() {
    const name = nameInput.value.trim();
    if (!name || !selectedClass) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const id = createCharacter(name, selectedClass);

    setActiveCharacter(id);
    closeCreateOverlay();
    renderCharacterList();
}

// ============================================================================
// SUPPRESSION DE PERSONNAGE
// ============================================================================
function openDeleteOverlay() {
    const id = getActiveCharacterId();
    if (!id) return;

    const profile = getCharacterProfile(id);
    deleteNameLabel.textContent = profile?.name ?? "ce personnage";
    deleteOverlay.classList.remove("hidden");
}

function closeDeleteOverlay() {
    deleteOverlay.classList.add("hidden");
}

function confirmDelete() {
    const id = getActiveCharacterId();
    if (!id) return;

    deleteCharacter(id);
    closeDeleteOverlay();
    renderCharacterList();
}

// ============================================================================
// INITIALISATION
// ============================================================================
function initClassSelection() {
    createOverlay.querySelectorAll("[data-class]").forEach(btn => {
        btn.addEventListener("click", () => {
            selectedClass = btn.dataset.class;
            createOverlay.querySelectorAll("[data-class]")
                .forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
        });
    });
}

export function initCharacterMenu() {
    // Initialisation des boutons
    createBtn.addEventListener("click", openCreateOverlay);
    deleteBtn.addEventListener("click", openDeleteOverlay);

    // Overlay création
    createOverlay.querySelector('[data-action="confirm-create"]')
        .addEventListener("click", confirmCreate);
    createOverlay.querySelector('[data-action="close"]')
        .addEventListener("click", closeCreateOverlay);

    // Overlay suppression
    deleteOverlay.querySelector('[data-action="confirm-delete"]')
        .addEventListener("click", confirmDelete);
    deleteOverlay.querySelector('[data-action="close"]')
        .addEventListener("click", closeDeleteOverlay);

    // Initialisation de la sélection de classe
    initClassSelection();

    // Rendu initial
    renderCharacterList();
}