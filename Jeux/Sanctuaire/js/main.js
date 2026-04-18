// main.js
import { currentState, GameState, setState } from "./state.js";
import { keys } from "./input.js";
import { initUI } from "./ui.js";

import { player, updatePlayer, drawPlayer } from "./player.js";
import { enemies, spawnEnemy, updateEnemies, drawEnemies } from "./enemy.js";
import { bullets, updateBullets, drawBullets } from "./bullet.js";
import { showLevelUpMenu } from "./levelup.js";
import { xpOrbs, updateXP, drawXP, drawXPBar } from "./xp.js";
import { updateDamageNumbers, drawDamageNumbers } from "./damageNumbers.js";
import { updateHealthBar } from "./healthbar.js";

import { updateCollisions } from "./collisionSystem.js";
import { onPlayerDeath } from "./deathSystem.js";

let canvas, ctx;
let lastTime = 0;
let enemySpawnTimer = 0;
export let gameLoopId = null;

// 🔥 Nouveau : personnage chargé depuis le menu
export let activeCharacter = null;

window.onload = () => {

    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    initUI();

    document.getElementById("death-screen")?.classList.remove("show");

    // ❌ L'ancien bouton play-btn n'est plus utilisé
    // document.getElementById("play-btn")?.addEventListener("click", () => startGame());

    document.getElementById("restart-btn")?.addEventListener("click", () => restartGame());
    document.getElementById("resume-btn")?.addEventListener("click", () => resumeGame());
    document.getElementById("retry-button")?.addEventListener("click", () => returnToMenu());

    // 🔥 Nouveau : écouter l’événement envoyé par characterMenu.js
    document.addEventListener("startGameWithCharacter", (e) => {
        activeCharacter = e.detail; // On stocke le personnage
        startGame();                // On lance le jeu
    });
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// 🔥 Nouveau startGame adapté au menu personnage
function startGame() {

    resetGame();

    // Positionner le joueur au centre
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    // Masquer le menu de sélection de personnage
    document.getElementById("character-select-menu")?.classList.add("hidden");

    // Afficher le canvas
    canvas.classList.remove("hidden");

    // (Plus tard : charger stats, inventaire, hubState depuis activeCharacter)

    resumeGame();
}

export function resumeGame() {
    setState(GameState.PLAYING);
    gameLoopId = requestAnimationFrame(loop);
}

function returnToMenu() {
    cancelAnimationFrame(gameLoopId);

    setState(GameState.MENU);

    // Réafficher le menu de sélection de personnage
    document.getElementById("character-select-menu")?.classList.remove("hidden");

    // Cacher pause + death
    document.getElementById("pause-menu")?.classList.add("hidden");
    document.getElementById("death-screen")?.classList.remove("show");

    // Cacher le canvas
    canvas.classList.add("hidden");
}

function restartGame() {
    resetGame();

    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    document.getElementById("pause-menu")?.classList.add("hidden");
    document.getElementById("death-screen")?.classList.remove("show");

    resumeGame();
}

function resetGame() {
    enemies.length = 0;
    bullets.length = 0;
    xpOrbs.length = 0;

    enemySpawnTimer = 0;

    player.hp = player.maxHp;

    updateHealthBar();
    drawXPBar();
}

function loop(timestamp) {

    let dt = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentState === GameState.PLAYING) {
        updateGame(dt);
        drawGame();
        gameLoopId = requestAnimationFrame(loop);
    }

    if (keys["escape"] && currentState === GameState.PLAYING) {
        setState(GameState.PAUSED);
        document.getElementById("pause-menu")?.classList.remove("hidden");
    }
}

function updateGame(dt) {
    updatePlayer(dt, enemies);
    updateEnemies(player);
    updateBullets();

    updateCollisions();

    if (player.hp <= 0) {
        setState(GameState.PAUSED);
        onPlayerDeath();
        return;
    }

    updateXP(player);
    drawXPBar();
    updateDamageNumbers();
    updateHealthBar();

    enemySpawnTimer -= dt;
    if (enemySpawnTimer <= 0) {
        spawnEnemy();
        enemySpawnTimer = 1000;
    }
}

function drawGame() {
    drawPlayer(ctx);
    drawEnemies(ctx);
    drawBullets(ctx);
    drawXP(ctx);
    drawDamageNumbers(ctx);
}
