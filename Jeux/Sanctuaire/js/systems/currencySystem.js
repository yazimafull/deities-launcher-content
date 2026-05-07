/*
   ROUTE : js/systems/currencySystem.js
   RÔLE :
     - Gestion globale des monnaies du jeu
     - Stockage interne en Copper (1 Gold = 10 000 Copper)
     - Conversion Gold/Silver/Copper pour l'affichage
     - Dépenses uniquement en Gold (jamais Silver/Copper)
   EXPORTS :
     - loadCurrencies, saveCurrencies
     - addCurrency(type, copperAmount)
     - spendCurrency(type, goldCost)
     - getCurrency(type) → { gold, silver, copper }
     - convertCopperToGSC(copper)
*/

import { basePlayer as player } from "../data/playerBase.js";

// ============================================================================
// CONSTANTES DE CONVERSION
// ============================================================================
const COPPER_PER_SILVER = 100;
const COPPER_PER_GOLD   = 10000;

// ============================================================================
// INITIALISATION DES MONNAIES
// ============================================================================
if (!player.currencies) {
    player.currencies = {
        gold: 0,          // stocké en copper !
        crystals: 0,
        monsterSouls: 0
    };
}

// ============================================================================
// CHARGEMENT
// ============================================================================
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

// ============================================================================
// SAUVEGARDE
// ============================================================================
export function saveCurrencies() {
    localStorage.setItem("playerCurrencies", JSON.stringify(player.currencies));
}

// ============================================================================
// CONVERSION : Copper → Gold / Silver / Copper
// ============================================================================
export function convertCopperToGSC(copper) {

    const gold   = Math.floor(copper / COPPER_PER_GOLD);
    const remain = copper % COPPER_PER_GOLD;

    const silver = Math.floor(remain / COPPER_PER_SILVER);
    const copperFinal = remain % COPPER_PER_SILVER;

    return { gold, silver, copper: copperFinal };
}

// ============================================================================
// OBTENIR UNE MONNAIE (retourne G/S/C)
// ============================================================================
export function getCurrency(type) {

    const copper = player.currencies[type] ?? 0;

    // Si ce n'est pas une monnaie en copper → renvoyer brut
    if (type !== "gold") return copper;

    return convertCopperToGSC(copper);
}

// ============================================================================
// AJOUTER UNE MONNAIE (toujours en copper)
// ============================================================================
export function addCurrency(type, copperAmount) {

    if (!player.currencies[type]) player.currencies[type] = 0;

    player.currencies[type] += copperAmount;

    saveCurrencies();
}

// ============================================================================
// DÉPENSER UNE MONNAIE (uniquement en GOLD)
// ============================================================================
export function spendCurrency(type, goldCost) {

    if (type !== "gold") {
        console.warn("❌ spendCurrency() : seules les dépenses en Gold sont autorisées.");
        return false;
    }

    const costInCopper = goldCost * COPPER_PER_GOLD;

    if ((player.currencies.gold ?? 0) < costInCopper) return false;

    player.currencies.gold -= costInCopper;

    saveCurrencies();
    return true;
}
