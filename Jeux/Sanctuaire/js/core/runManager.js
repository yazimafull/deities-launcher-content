﻿// Jeux/Sanctuaire/core/runManager.js
// ============================================================================
// ROLE
// Gestion de la fin de run : nettoyage complet du gameplay, reset des systèmes,
// retour au menu, masquage du canvas et du HUD.
// Ce fichier ne lance PAS la run : il la termine proprement.
//
// ============================================================================
// EXPORTS
// - cleanRun()
//
// ============================================================================
// DEPENDANCES
// - state.js → setState, GameState
// - enemySystem.js → enemies
// - projectile.js → projectiles
// - xp.js → xpOrbs
// - boss.js → resetBoss
// - hudSystem.js → HUD
//
// ============================================================================
// SCREEN
// Utilisé lors du retour au MENU après une RUN.
//
// ============================================================================
// NOTES
// - cleanRun() doit être appelé avant de quitter la run (mort, retour sanctuaire).
// - Ne gère pas la logique de lancement de run (biomes, affixes, difficulté).
// - Ne modifie pas le moteur : uniquement du reset visuel + gameplay.
// ============================================================================

import { setState, GameState } from "./state.js";
import { enemies } from "../systems/enemySystem.js";
import { projectiles } from "../systems/projectile.js";
import { xpOrbs } from "../systems/xp.js";
import { resetBoss } from "../systems/boss.js";
import { HUD } from "../ui/hud/hudSystem.js";

export function cleanRun() {

    console.log("🧹 Clean run...");

    setState(GameState.MENU);

    enemies.length = 0;
    projectiles.length = 0;
    xpOrbs.length = 0;

    resetBoss();

    const canvas = document.getElementById("game-canvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add("hidden");
    }

    HUD.hide();
}
