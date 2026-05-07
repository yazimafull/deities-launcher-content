/*
   ROUTE : Jeux/Sanctuaire/js/systems/player/player.js

   RÔLE :
     Conteneur RUNTIME du joueur (en jeu uniquement).
     Ne contient PAS les données permanentes.
     Le permanent vient de characterManager.loadActiveCharacter().
*/

import { buildPlayerStats } from "./playerStatsSystem.js";
import { applyPlayerRuntimeStats } from "./playerRuntimeSystem.js";

// ============================================================================
// INSTANCE RUNTIME DU JOUEUR
// ============================================================================
export const player = {

    // --- Données permanentes (injectées par loadActiveCharacter) ---
    name: "",
    classe: "",
    soulXP: 0,
    jobXP: 0,
    unlockedLevels: 1,
    inventory: [],
    equipment: {
        weapon: null,
        armor: null,
        trinket: null,
        affix: null
    },
    divines: [],
    talents: {},
    unspentTalentPoints: 0,

    // --- Position & mouvement ---
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,

    // --- Runtime HP / Shield ---
    hp: 0,
    shield: 0,

    // --- Runtime sources ---
    trinkets: [],
    buffs: [],
    gems: [],

    // --- Bonus runtime de run ---
    runXpBonus: 0,
    runAffixes: [],
    runStats: {},

    // --- Stats finales ---
    stats: {},

    // --- Flags runtime ---
    isMob: false,
    activeElement: null,
};

// ============================================================================
// INIT PLAYER (entrée dans une run)
// ============================================================================
export function initPlayer(x, y) {

    // Position initiale
    player.x = x;
    player.y = y;

    // Élément actif par défaut
    player.activeElement = null;

    // 1) Calcul des stats finales
    updatePlayerStats();

    // 2) Application des stats runtime (maxHp, maxShield…)
    applyPlayerRuntimeStats(player);

    // 3) Initialisation correcte HP / Shield
    player.hp = player.stats.maxHp;
    player.shield = player.stats.maxShield;
}

// ============================================================================
// RESET PLAYER (retour Sanctuaire)
// ============================================================================
export function resetPlayer() {

    // Reset mouvement
    player.dx = 0;
    player.dy = 0;

    // Reset runtime
    player.trinkets = [];
    player.buffs = [];
    player.gems = [];
    player.runXpBonus = 0;
    player.runAffixes = [];
    player.runStats = {};

    // Recalcul des stats finales
    updatePlayerStats();

    // Application des stats runtime
    applyPlayerRuntimeStats(player);

    // HP / Shield corrects
    player.hp = player.stats.maxHp;
    player.shield = player.stats.maxShield;
}

// ============================================================================
// CALCUL DES STATS FINALES
// ============================================================================
export function updatePlayerStats() {
    player.stats = buildPlayerStats(player);
}
