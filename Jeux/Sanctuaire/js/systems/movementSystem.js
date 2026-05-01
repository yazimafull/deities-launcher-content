/*
   ROUTE : Jeux/Sanctuaire/js/systems/movementSystem.js

   RÔLE :
     - Système de déplacement générique (player / ennemis / boss)
     - Fournit :
         1) updatePlayerDirection() → lit les inputs configurables
         2) moveEntity() → applique le déplacement normalisé + dt
     - Ne contient aucune logique gameplay ou IA

   DÉPENDANCES :
     - core/input.js (pour isActionDown)
*/

import { isActionDown } from "../core/input.js";

// ================================
// PLAYER INPUT → DIRECTION
// ================================
/*
   Lit les touches configurées dans keybinds.js :
     - move-up
     - move-down
     - move-left
     - move-right

   Met à jour player.dx / player.dy
   (le moteur utilisera ensuite moveEntity() pour appliquer la vitesse)
*/
export function updatePlayerDirection(player) {

    let dx = 0;
    let dy = 0;

    // Déplacements configurables (ZQSD par défaut)
    if (isActionDown("move-up"))    dy -= 1;
    if (isActionDown("move-down"))  dy += 1;
    if (isActionDown("move-left"))  dx -= 1;
    if (isActionDown("move-right")) dx += 1;

    player.dx = dx;
    player.dy = dy;
}

// ================================
// MOVE ENTITY (GENERIC)
// ================================
/*
   Applique un déplacement générique :
     - Normalisation de la direction (dx, dy)
     - Lecture de la vitesse (runtime.speed > speed)
     - Application dt (frame-safe)
*/
export function moveEntity(entity, dx, dy, dt) {

    if (!entity) return;

    // Normalisation
    const len = Math.hypot(dx, dy);
    if (len > 0) {
        dx /= len;
        dy /= len;
    }

    // Source unique de vitesse
    const speed =
        entity.runtime?.speed ??
        entity.speed ??
        0;

    // Application du mouvement
    entity.x += dx * speed * (dt / 1000);
    entity.y += dy * speed * (dt / 1000);
}
