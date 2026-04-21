// biome_foret.js
// Carte Forêt Mourante — déplacement souris, transparence arbres, zone révélation
import { getState, setState, GameState } from "../core/state.js";
// ================================
// CONSTANTES
// ================================
const TILE      = 64;
const MAP_COLS  = 160;
const MAP_ROWS  = 120;
const MAP_W     = MAP_COLS * TILE;
const MAP_H     = MAP_ROWS * TILE;
const BORDER    = 8;

const MOB_COUNT       = 40;
const MOB_AGGRO_RANGE = 280;
const MOB_LEASH_RANGE = 500;
const MOB_SPEED       = 1.4;
const MOB_SIZE        = 28;
const MOB_HP          = 30;
const MOB_DAMAGE      = 5;
const MOB_DAMAGE_CD   = 800;
const BOSS_TRIGGER_PCT = 0.8;

const REVEAL_RADIUS   = 640;
const TREE_FADE_ALPHA = 0.25;
const TREE_FULL_ALPHA = 1.0;

// ================================
// STATE
// ================================
let canvas, ctx;
let camera   = { x: 0, y: 0 };
let player   = {};
let target   = null;
let trees    = [];
let mobs     = [];
let boss     = null;
let mobsToKill  = 0;
let mobsKilled  = 0;
let bossSpawned = false;
let lastTime    = 0;
let animId      = null;
let runConfig   = {};

const keys = {};

// ================================
// LISTENERS RETIRABLES
// ================================
window._foretKeydown = (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === "Escape" && getState() === GameState.PLAYING) window.openPause();
};
window._foretKeyup = (e) => {
    keys[e.key.toLowerCase()] = false;
};

window.addEventListener("keydown", window._foretKeydown);
window.addEventListener("keyup", window._foretKeyup);

// ================================
// INIT
// ================================
export function initForet(config) {
    runConfig = config || {};

    canvas = document.getElementById("game-canvas");
    ctx    = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // Resize retirable
    window._foretResize = () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", window._foretResize);

    // Clic gauche → définir la cible
    canvas.addEventListener("click", onCanvasClick);

    player = {
        x: MAP_W / 2,
        y: MAP_H / 2,
        size: 28,
        speed: 3.5,
        hp: 100,
        maxHp: 100,
    };

    target = null;

    generateTrees();
    generateMobs();

    mobsToKill  = Math.floor(MOB_COUNT * BOSS_TRIGGER_PCT);
    mobsKilled  = 0;
    bossSpawned = false;
    boss        = null;

    document.getElementById("game-canvas")?.classList.remove("hidden");
    document.getElementById("healthbar-container")?.classList.remove("hidden");
    document.getElementById("xpbar-container")?.classList.remove("hidden");

    setState(GameState.PLAYING);
    lastTime = performance.now();
    animId = requestAnimationFrame(loop);
}

// ================================
// STOP FORET — VERSION PROPRE
// ================================
export function stopForet() {

    // Stopper la boucle
    if (animId) cancelAnimationFrame(animId);
    animId = null;

    // Retirer clic
    canvas?.removeEventListener("click", onCanvasClick);

    // Retirer clavier
    if (window._foretKeydown) {
        window.removeEventListener("keydown", window._foretKeydown);
        window._foretKeydown = null;
    }
    if (window._foretKeyup) {
        window.removeEventListener("keyup", window._foretKeyup);
        window._foretKeyup = null;
    }

    // Retirer resize
    if (window._foretResize) {
        window.removeEventListener("resize", window._foretResize);
        window._foretResize = null;
    }
}

// ================================
// CLIC SOURIS
// ================================
function onCanvasClick(e) {
    if (getState() !== GameState.PLAYING) return;

    target = {
        x: e.clientX + camera.x,
        y: e.clientY + camera.y
    };
}

// ================================
// GÉNÉRATION ARBRES / MOBS / LOOP / UPDATE / DRAW
// (tout ton code original, inchangé)
// ================================

function generateTrees() { /* ... inchangé ... */ }
function pickTreeColor() { /* ... inchangé ... */ }
function generateMobs() { /* ... inchangé ... */ }

function loop(timestamp) { /* ... inchangé ... */ }
function update(dt) { /* ... inchangé ... */ }
function updatePlayer(dt) { /* ... inchangé ... */ }
function updateCamera() { /* ... inchangé ... */ }
function updateTreeAlpha() { /* ... inchangé ... */ }
function updateMobs(dt) { /* ... inchangé ... */ }
function checkBossTrigger() { /* ... inchangé ... */ }
function spawnBoss() { /* ... inchangé ... */ }
function onPlayerDeath() { /* ... inchangé ... */ }
export function onMobKilled() { mobsKilled++; }

function draw() { /* ... inchangé ... */ }
function drawTrees() { /* ... inchangé ... */ }
function drawMobs() { /* ... inchangé ... */ }
function drawBoss() { /* ... inchangé ... */ }
function drawPlayer() { /* ... inchangé ... */ }
function drawTarget() { /* ... inchangé ... */ }
function drawHealthBar(x,y,w,h,pct,color) { /* ... inchangé ... */ }

function updateHUD() { /* ... inchangé ... */ }
function showBossAlert() { /* ... inchangé ... */ }
