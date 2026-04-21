// core/runManager.js

import { stopBiomeForet } from "../world/biome_foret.js";
import { stopBiomeWIP } from "../world/biome_wip.js";

export function cleanRun() {

    console.log("🧹 Nettoyage complet de la run...");

    // Stopper les biomes actifs
    stopBiomeForet();
    stopBiomeWIP();

    // Nettoyer le canvas
    const canvas = document.getElementById("game-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add("hidden");
    }

    // Cacher le HUD
    document.getElementById("healthbar-container")?.classList.add("hidden");
    document.getElementById("xpbar-container")?.classList.add("hidden");
}
