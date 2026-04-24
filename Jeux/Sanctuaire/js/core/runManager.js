// core/runManager.js

import { stopBiomeForet } from "../world/biome_foret.js";
import { stopBiomeWIP } from "../world/biome_wip.js";
import { resetHUD, hideHUD } from "../ui/hud/hudSystem.js";

export function cleanRun() {

    console.log("🧹 Clean run start...");

    // ======================
    // BIOMES
    // ======================
    stopBiomeForet();
    stopBiomeWIP();

    // ======================
    // CANVAS CLEAN
    // ======================
    const canvas = document.getElementById("game-canvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add("hidden");
    }

    // ======================
    // HUD RESET (PRO WAY)
    // ======================
    resetHUD();
    hideHUD();

    // ======================
    // UI RESET SCREENS
    // ======================
    document.querySelectorAll(".screen").forEach(s => {
        s.classList.add("hidden");
    });
}