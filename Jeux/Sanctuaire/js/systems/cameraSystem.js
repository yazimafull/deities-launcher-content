// systems/cameraSystem.js
/*
   ROUTE : systems/cameraSystem.js
   RÔLE : Gestion de la caméra globale (centrée sur le joueur)
   EXPORTS : camera, updateCamera
   DÉPENDANCES : MAP_WIDTH, MAP_HEIGHT depuis biome_foret.js
   NOTES :
   - La caméra n'est plus gérée par les biomes
   - Utilisée par engine.js dans updateEngine()
*/

import { MAP_WIDTH, MAP_HEIGHT } from "../world/biome_foret.js";

// ================================
// CAMERA STATE
// ================================
export const camera = {
    x: 0,
    y: 0
};

// ================================
// UPDATE CAMERA
// ================================
export function updateCamera(player, canvas) {

    if (!player || !canvas) return;

    // Centrage sur le joueur
    let cx = player.x - canvas.width / 2;
    let cy = player.y - canvas.height / 2;

    // Clamp horizontal
    cx = Math.max(0, Math.min(MAP_WIDTH - canvas.width, cx));

    // Clamp vertical
    cy = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, cy));

    camera.x = cx;
    camera.y = cy;
}
