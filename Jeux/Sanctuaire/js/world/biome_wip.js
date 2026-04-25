// Jeux/Sanctuaire/js/world/biome_wip.js
/* 
   ROUTE : Jeux/Sanctuaire/js/world/biome_wip.js
   RÔLE : Biome générique WIP (Ruines / Abysses) avec affichage simple et boucle dédiée
   EXPORTS : initBiomeWIP, stopBiomeWIP
   DÉPENDANCES : state.js, pauseMenu.js, input.js
   NOTES : Utilisé pour les biomes placeholders. Le registre passe "ruines" ou "abysses".
*/

import { getState, GameState } from "../core/state.js";
import { openPause } from "../UI/menu/pauseMenu.js";
import { isDown } from "../core/input.js";

let canvas, ctx;
let animId = null;
let biomeName = "";

// ================================
// INIT BIOME
// ================================
export function initBiomeWIP(name) {

    biomeName = name;

    canvas = document.getElementById("game-canvas");
    if (!canvas) return;

    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.classList.remove("hidden");

    // HUD gère désormais les barres → plus d'UI legacy ici

    animId = requestAnimationFrame(loop);
}

// ================================
// STOP BIOME
// ================================
export function stopBiomeWIP() {

    if (animId) cancelAnimationFrame(animId);
    animId = null;

    const c = document.getElementById("game-canvas");

    if (c) {
        const ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        c.classList.add("hidden");
    }

    // Ancien HUD supprimé → rien à nettoyer ici
}

// ================================
// LOOP
// ================================
function loop() {

    if (getState() !== GameState.PLAYING) {
        animId = requestAnimationFrame(loop);
        return;
    }

    // Pause via input system
    if (isDown("escape")) {
        openPause();
    }

    draw();
    animId = requestAnimationFrame(loop);
}

// ================================
// DRAW BIOME
// ================================
function draw() {

    if (!ctx || !canvas) return;

    // BACKGROUND
    if (biomeName === "ruines") ctx.fillStyle = "#1a1510";
    else if (biomeName === "abysses") ctx.fillStyle = "#050510";
    else ctx.fillStyle = "#111";

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // UI VISUEL BIOME
    ctx.save();

    ctx.fillStyle = "rgba(201,168,106,0.15)";
    ctx.fillRect(canvas.width / 2 - 300, canvas.height / 2 - 80, 600, 160);

    ctx.strokeStyle = "#c9a86a";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width / 2 - 300, canvas.height / 2 - 80, 600, 160);

    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 28px Cinzel";
    ctx.textAlign = "center";
    ctx.fillText(getBiomeLabel(), canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = "#b8a88a";
    ctx.font = "16px Cinzel";
    ctx.fillText(
        "Work In Progress — Appuyez sur Echap pour la pause",
        canvas.width / 2,
        canvas.height / 2 + 20
    );

    ctx.restore();
}

// ================================
// LABEL BIOME
// ================================
function getBiomeLabel() {

    if (biomeName === "ruines") return "⚒ Ruines Oubliées";
    if (biomeName === "abysses") return "🌑 Abysses";

    return biomeName;
}
