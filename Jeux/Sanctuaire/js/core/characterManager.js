/* ============================================================================
   ROUTE : js/core/characterManager.js
   RÔLE  : Gestion simple et propre des personnages (Option A)
   EXPORTS :
     - createCharacter(name, classe)
     - deleteCharacter(id)
     - getCharacters()
     - getActiveCharacterId()
     - setActiveCharacter(id)
     - loadActiveCharacter()
     - saveActiveCharacter()
   NOTES :
     - Chaque personnage est stocké dans localStorage sous une clé unique.
     - Le "player" global est rempli à partir du profil du personnage actif.
     - Aucune migration, aucune complexité : parfait pour tester.
============================================================================ */

import { player } from "../systems/player/player.js";

/* ============================================================================
   CONSTANTES
============================================================================ */
const STORAGE_KEY_LIST = "sanctuaireCharacters";        // Liste des IDs
const STORAGE_KEY_ACTIVE = "sanctuaireActiveCharacter"; // ID du perso actif

/* ============================================================================
   OUTILS LOCALSTORAGE
============================================================================ */
function loadJSON(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
}

function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/* ============================================================================
   LISTE DES PERSONNAGES
============================================================================ */
export function getCharacters() {
    return loadJSON(STORAGE_KEY_LIST, []); // tableau d'IDs
}

function saveCharacters(list) {
    saveJSON(STORAGE_KEY_LIST, list);
}

/* ============================================================================
   CRÉATION D’UN PERSONNAGE
============================================================================ */
export function createCharacter(name, classe) {

    const id = crypto.randomUUID(); // ID unique

    const profile = {
        id,
        name,
        classe,

        // 🔥 Données PERSISTANTES du personnage
        soulXP: 0,
        jobXP: 0,
        unlockedLevels: 1,

        inventory: [],   // coffre perso
        equipment: {     // stuff équipé
            weapon: null,
            armor: null,
            trinket: null,
            affix: null
        },

        divines: [],     // objets spéciaux
        talents: {},     // arbre de talents (simple)
        unspentTalentPoints: 0,
    };

    // Sauvegarde du profil
    saveJSON(`character_${id}`, profile);

    // Ajout à la liste
    const list = getCharacters();
    list.push(id);
    saveCharacters(list);

    return id;
}

/* ============================================================================
   SUPPRESSION D’UN PERSONNAGE
============================================================================ */
export function deleteCharacter(id) {
    localStorage.removeItem(`character_${id}`);

    const list = getCharacters().filter(x => x !== id);
    saveCharacters(list);

    // Si on supprime le perso actif → reset
    if (getActiveCharacterId() === id) {
        localStorage.removeItem(STORAGE_KEY_ACTIVE);
    }
}

/* ============================================================================
   PERSONNAGE ACTIF
============================================================================ */
export function getActiveCharacterId() {
    return localStorage.getItem(STORAGE_KEY_ACTIVE) ?? null;
}

export function setActiveCharacter(id) {
    localStorage.setItem(STORAGE_KEY_ACTIVE, id);
}

/* ============================================================================
   CHARGER LE PROFIL DU PERSONNAGE ACTIF
   → Remplit le "player" global avec les données du profil
============================================================================ */
export function loadActiveCharacter() {

    const id = getActiveCharacterId();
    if (!id) return null;

    const profile = loadJSON(`character_${id}`, null);
    if (!profile) return null;

    // 🔥 Injection dans le player global
    player.name = profile.name;
    player.classe = profile.classe;

    player.soulXP = profile.soulXP;
    player.jobXP = profile.jobXP;
    player.unlockedLevels = profile.unlockedLevels;

    player.inventory = structuredClone(profile.inventory);
    player.equipment = structuredClone(profile.equipment);
    player.divines = structuredClone(profile.divines);

    player.talents = structuredClone(profile.talents);
    player.unspentTalentPoints = profile.unspentTalentPoints;

    // 🔥 IMPORTANT : runtime reset (HP, buffs, etc.)
    resetPlayerRuntime();

    return profile;
}

/* ============================================================================
   SAUVEGARDER LE PERSONNAGE ACTIF
   → Prend les données du player global et les écrit dans le profil
============================================================================ */
export function saveActiveCharacter() {

    const id = getActiveCharacterId();
    if (!id) return;

    const profile = {
        id,
        name: player.name,
        classe: player.classe,

        soulXP: player.soulXP,
        jobXP: player.jobXP,
        unlockedLevels: player.unlockedLevels,

        inventory: structuredClone(player.inventory),
        equipment: structuredClone(player.equipment),
        divines: structuredClone(player.divines),

        talents: structuredClone(player.talents),
        unspentTalentPoints: player.unspentTalentPoints,
    };

    saveJSON(`character_${id}`, profile);
}

/* ============================================================================
   RESET RUNTIME (HP, buffs, runXP…)
   → Ne touche PAS aux données persistantes
============================================================================ */
export function resetPlayerRuntime() {
    player.hp = player.maxHp ?? 100;
    player.shield = 0;

    player.buffs = [];
    player.runXpBonus = 0;
    player.runAffixes = [];
    player.runStats = {};

    // 🔥 Tout ce qui est temporaire doit être reset ici
}
