/*
   ROUTE : Jeux/Sanctuaire/js/systems/player/playerRenderSystem.js
   ARBORESCENCE :
     Jeux → Sanctuaire → js → systems → player → playerRenderSystem.js

   RÔLE :
     RENDU VISUEL DU PLAYER

   PRINCIPLE :
     - Aucune logique gameplay
     - Lit uniquement l’état du player (position + size)
     - Responsable uniquement du dessin canvas
     - Ne modifie jamais le player

   DÉPENDANCES :
     - systems/player/player.js
*/

import { player } from "./player.js";

// ================================
// DRAW PLAYER
// ================================
export function drawPlayerSprite(ctx) {

    if (!ctx || !player) return;

    const size = player.size || 32;

    // =========================
    // SHADOW
    // =========================
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(
        player.x,
        player.y + size / 2 - 4,
        size / 2,
        6,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // =========================
    // BODY
    // =========================
    ctx.fillStyle = "#4aa3ff";
    ctx.fillRect(
        player.x - size / 2,
        player.y - size / 2,
        size,
        size
    );
}