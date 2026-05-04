/*
   ROUTE : Jeux/Sanctuaire/js/systems/player/player.js

   RÔLE :
     Conteneur RUNTIME du joueur (en jeu uniquement).
     Ne contient :
       - position & mouvement
       - hp / shield runtime
       - équipement runtime (copié depuis basePlayer)
       - stats finales (calculées)
       - flags runtime

   PRINCIPES :
     - Le permanent vient de basePlayer.js (inventaire, talents, affixes…)
     - Les stats finales viennent de playerStatsSystem.js
     - Le runtime (hp, shield…) vient de playerRuntimeSystem.js
     - Aucune stat de combat n’est stockée ici.
*/

import { basePlayer } from "../../data/playerBase.js";
import { buildPlayerStats } from "./playerStatsSystem.js";
import { applyPlayerRuntimeStats } from "./playerRuntimeSystem.js";

// ================================
// INSTANCE RUNTIME DU JOUEUR
// ================================
export const player = {

    // --- Données permanentes clonées depuis basePlayer ---
    ...structuredClone(basePlayer),

    // --- Position & mouvement ---
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,

    // --- Runtime HP / Shield ---
    hp: 0,
    shield: 0,

    // --- Équipement runtime (structure attendue par buildPlayerStats) ---
    equipment: {
        weapon: null,
        armor: null,
        trinkets: []
    },

    // --- Sources runtime supplémentaires (toujours présentes même vides) ---
    trinkets: [],
    buffs: [],
    talents: [],
    gems: [],

    // --- Stats finales (remplies par buildPlayerStats) ---
    stats: structuredClone(basePlayer.stats),

    // --- Flags runtime ---
    isMob: false,
};

// ================================
// INIT PLAYER (entrée dans une run)
// ================================
export function initPlayer(x, y, character = null) {

    // Position initiale
    player.x = x;
    player.y = y;

    // Merge du personnage sélectionné (permanent)
    if (character) {
        Object.assign(player, character);
    }

    // 1) Calcul des stats finales
    updatePlayerStats();

    // 2) Application des stats runtime (maxHp, maxShield…)
    applyPlayerRuntimeStats(player);

    // 3) Initialisation correcte HP / Shield
    player.hp = player.stats.maxHp;
    player.shield = player.stats.maxShield;
}

// ================================
// RESET PLAYER (retour Sanctuaire)
// ================================
export function resetPlayer() {

    const x = player.x;
    const y = player.y;

    // Reset complet du permanent
    Object.assign(player, structuredClone(basePlayer));

    // Restaurer la position
    player.x = x;
    player.y = y;

    // Reset mouvement
    player.dx = 0;
    player.dy = 0;

    // Reset équipement runtime
    player.equipment.weapon = null;
    player.equipment.armor = null;
    player.equipment.trinkets = [];

    // Reset sources runtime
    player.trinkets = [];
    player.buffs = [];
    player.talents = [];
    player.gems = [];

    // 1) Recalcul des stats finales
    updatePlayerStats();

    // 2) Application des stats runtime
    applyPlayerRuntimeStats(player);

    // 3) HP / Shield corrects
    player.hp = player.stats.maxHp;
    player.shield = player.stats.maxShield;
}

// ================================
// CALCUL DES STATS FINALES
// ================================
export function updatePlayerStats() {
    player.stats = buildPlayerStats(player);
}
