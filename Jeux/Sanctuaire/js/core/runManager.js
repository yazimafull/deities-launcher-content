// core/runManager.js

import { setState, GameState } from "./state.js";
import { enemies } from "../systems/enemySystem.js";
import { projectiles } from "../systems/projectile.js";
import { xpOrbs } from "../systems/xp.js";
import { resetBoss } from "../systems/boss.js";
import { HUD } from "../ui/hud/hudSystem.js";

// ================================
// CLEAN RUN
// ================================
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

    HUD.hide(); // ✅ remplacé hideHUD
}