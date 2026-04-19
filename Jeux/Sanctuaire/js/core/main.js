import { GameState, setState, getState } from "./state.js";
import { initUI } from "../ui/ui.js";
import { initSanctuary, updateSanctuary, renderSanctuary } from "../world/sanctuary.js";

/* ============================================================
   VARIABLES
============================================================ */

let canvas;
let ctx;
let lastTime = 0;
let isRunning = false;

let currentCharacter = null;

/* ============================================================
   INITIALISATION
============================================================ */

function initCanvas() {
    canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
}

function initGame(character) {
    currentCharacter = character;

    // futur : initPlayer, initEnemies, initSystems...
    initSanctuary();
}

/* ============================================================
   LOOP
============================================================ */

function update(dt) {
    if (getState() === GameState.SANCTUARY) {
        updateSanctuary(dt);
    }
}

function render() {
    if (!ctx) return;

    if (getState() === GameState.SANCTUARY) {
        renderSanctuary(ctx);
    }
}

function gameLoop(timestamp) {
    if (!isRunning) return;

    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if (getState() !== GameState.PAUSED) {
        update(dt);
        render();
    }

    requestAnimationFrame(gameLoop);
}

/* ============================================================
   UI / MENUS
============================================================ */

function showGameUI() {
    document.getElementById("game-canvas")?.classList.remove("hidden");
}

function hideGameUI() {
    document.getElementById("game-canvas")?.classList.add("hidden");
}

function showCharacterMenu() {
    document.getElementById("character-select-menu")?.classList.remove("hidden");
    hideGameUI();
    setState(GameState.MENU);
}

/* ============================================================
   EVENTS
============================================================ */

document.addEventListener("startGameWithCharacter", (e) => {
    const character = e.detail;

    initCanvas();
    initGame(character);

    document.getElementById("character-select-menu")?.classList.add("hidden");
    showGameUI();

    setState(GameState.SANCTUARY);

    isRunning = true;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
});

document.addEventListener("restartGame", () => {
    if (!currentCharacter) return;
    initGame(currentCharacter);
    setState(GameState.SANCTUARY);
});

document.addEventListener("returnToMenu", () => {
    isRunning = false;
    showCharacterMenu();
});

/* ============================================================
   STARTUP
============================================================ */

window.addEventListener("DOMContentLoaded", () => {
    initUI();
    setState(GameState.MENU);
});
