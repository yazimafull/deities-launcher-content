/*
   ROUTE : js/systems/currencySystem.js
   RÔLE : Gestion globale des monnaies du jeu (or, cristaux, âmes, etc.)
   EXPORTS : loadCurrencies, saveCurrencies, addCurrency, spendCurrency, getCurrency
   DÉPENDANCES : ../data/playerBase.js
   NOTES :
     - Système extensible : ajoute autant de monnaies que tu veux.
     - Persistance automatique via localStorage.
     - Utilisé par : marchand, loot, forge, run rewards, talents, etc.
*/

import { basePlayer as player } from "../data/playerBase.js";

// ===============================
// INITIALISATION DES MONNAIES
// ===============================
// Si player.currencies n'existe pas encore → on le crée
if (!player.currencies) {
    player.currencies = {
        gold: 0,
        crystals: 0,
        monsterSouls: 0
        // Ajoute ici d'autres monnaies si besoin
    };
}

// ===============================
// CHARGEMENT
// ===============================
export function loadCurrencies() {
    const raw = localStorage.getItem("playerCurrencies");
    if (raw) {
        try {
            player.currencies = JSON.parse(raw);
        } catch (e) {
            console.warn("[Currency] Erreur de chargement, reset…");
        }
    }
}

// ===============================
// SAUVEGARDE
// ===============================
export function saveCurrencies() {
    localStorage.setItem("playerCurrencies", JSON.stringify(player.currencies));
}

// ===============================
// OBTENIR UNE MONNAIE
// ===============================
export function getCurrency(type) {
    return player.currencies[type] ?? 0;
}

// ===============================
// AJOUTER UNE MONNAIE
// ===============================
export function addCurrency(type, amount) {
    if (!player.currencies[type]) player.currencies[type] = 0;
    player.currencies[type] += amount;
    saveCurrencies();
}

// ===============================
// DÉPENSER UNE MONNAIE
// ===============================
export function spendCurrency(type, amount) {
    if (getCurrency(type) < amount) return false;
    player.currencies[type] -= amount;
    saveCurrencies();
    return true;
}
