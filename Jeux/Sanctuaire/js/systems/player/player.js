/*
   ROUTE : Jeux/Sanctuaire/js/systems/player/player.js

   RÔLE :
     Conteneur d’état runtime du joueur (STATE ONLY).
     Ne contient aucune logique gameplay : pas de mouvement, pas de combat,
     pas d’équipement, pas de calcul de stats. Il stocke uniquement les valeurs
     nécessaires pour que les systèmes spécialisés puissent fonctionner.

   PRINCIPES :
     - Player = état vivant (position, HP, ressources, équipement…)
     - Stats = calculées via playerStatsSystem.js
     - Runtime combat = calculé via playerRuntimeSystem.js
     - L’équipement (arme, trinkets…) est géré par debugSystem ou equipmentSystem
       → jamais ici.
     - Ce fichier ne fait que déclarer et réinitialiser l’état.

   DÉPENDANCES :
     - data/playerBase.js : template de base (HP, speed, size…)
     - playerStatsSystem.js : construction des stats finales
*/

import { basePlayer } from "../../data/playerBase.js";
import { buildPlayerStats } from "./playerStatsSystem.js";
import { applyPlayerRuntimeStats } from "./playerRuntimeSystem.js";


// ================================
// PLAYER INSTANCE (STATE ONLY)
// ================================
export const player = {

    // --- Base template (HP, speed, size, etc.) ---
    ...structuredClone(basePlayer),

    // --- Position & mouvement ---
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,

    isMob: false,

    // --- Équipement ---
    weapon: null,        // arme actuellement équipée (gérée ailleurs)
    testWeapon: null,    // arme de debug (assignée par debugSystem)

    // --- Runtime combat (écrasé par playerRuntimeSystem) ---
    attackRange: 0,
    attackSpeed: 1,
    projectileSpeed: 0,
    projectileCount: 1,

    // --- Stats finales (HP max, regen, speed, crit…) ---
    stats: {}
};

// ================================
// INIT PLAYER
// ================================
export function initPlayer(x, y, character = null) {

    player.x = x;
    player.y = y;

    // Merge du personnage sélectionné (skin, base stats…)
    if (character) {
        Object.assign(player, character);
    }

    updatePlayerStats();
}

// ================================
// RESET PLAYER
// ================================
export function resetPlayer() {

    const x = player.x;
    const y = player.y;

    // Reset complet depuis le template
    Object.assign(player, structuredClone(basePlayer));

    // Conserver la position (le spawn est géré ailleurs)
    player.x = x;
    player.y = y;

    // Reset runtime
    player.dx = 0;
    player.dy = 0;

    if (!player.debugLockWeapon) {
        player.weapon = null;
        player.testWeapon = null;
    }

    updatePlayerStats();
    applyPlayerRuntimeStats(player);

}

// ================================
// STATS UPDATE (SOURCE UNIQUE)
// ================================
export function updatePlayerStats() {
    player.stats = buildPlayerStats(player);
}
