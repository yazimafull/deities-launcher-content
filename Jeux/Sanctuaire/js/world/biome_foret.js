// biome_foret.js
// Carte Forêt Mourante — déplacement souris, transparence arbres, zone révélation

// ⛔ Import supprimé pour éviter l'import circulaire :
// import { openPause } from "../ui/pauseMenu.js";
// openPause est exposé globalement par pauseMenu.js via window.openPause

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

// Transparence arbres
const REVEAL_RADIUS   = 640;   // rayon zone révélation (10 cases)
const TREE_FADE_ALPHA = 0.25;  // opacité arbre quand joueur/mob dessous
const TREE_FULL_ALPHA = 1.0;

// ================================
// STATE
// ================================
let canvas, ctx;
let camera   = { x: 0, y: 0 };
let player   = {};
let target   = null;   // point cible pour le déplacement souris
let trees    = [];
let mobs     = [];
let boss     = null;
let mobsToKill  = 0;
let mobsKilled  = 0;
let bossSpawned = false;
let lastTime    = 0;
let animId      = null;
let runConfig   = {};

// Touches clavier (pour combiner avec la souris si besoin)
const keys = {};
window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === "Escape" && getState() === GameState.PLAYING && window.openPause) {
        window.openPause();
    }
});
window.addEventListener("keyup", e => { keys[e.key.toLowerCase()] = false; });

// ================================
// INIT
// ================================
export function initForet(config) {
    runConfig = config || {};

    canvas = document.getElementById("game-canvas");
    ctx    = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Clic gauche → définir la cible de déplacement
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

export function stopForet() {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    canvas?.removeEventListener("click", onCanvasClick);
}

// ================================
// CLIC SOURIS → CIBLE
// ================================
function onCanvasClick(e) {
    if (getState() !== GameState.PLAYING) return;

    // Convertir les coordonnées écran en coordonnées monde
    target = {
        x: e.clientX + camera.x,
        y: e.clientY + camera.y
    };
}

// ================================
// GÉNÉRATION ARBRES
// ================================
function generateTrees() {
    trees = [];
    const rand = (a, b) => Math.random() * (b - a) + a;

    for (let col = 0; col < MAP_COLS; col++) {
        for (let row = 0; row < MAP_ROWS; row++) {
            const inBorder = col < BORDER || col >= MAP_COLS - BORDER
                          || row < BORDER || row >= MAP_ROWS - BORDER;

            if (inBorder) {
                trees.push({
                    x: col * TILE + rand(4, TILE - 4),
                    y: row * TILE + rand(4, TILE - 4),
                    r: rand(18, 32),
                    solid: true,
                    color: pickTreeColor(),
                    alpha: TREE_FULL_ALPHA
                });
            } else if (Math.random() < 0.15) {
                trees.push({
                    x: col * TILE + rand(4, TILE - 4),
                    y: row * TILE + rand(4, TILE - 4),
                    r: rand(14, 26),
                    solid: true,
                    color: pickTreeColor(),
                    alpha: TREE_FULL_ALPHA
                });
            }
        }
    }
}

function pickTreeColor() {
    return ["#1a4a1a","#1e5c1e","#145214","#2d6e2d","#0f3b0f"][Math.floor(Math.random()*5)];
}

// ================================
// GÉNÉRATION MOBS
// ================================
function generateMobs() {
    mobs = [];
    const margin = BORDER * TILE + 80;
    for (let i = 0; i < MOB_COUNT; i++) {
        const x = margin + Math.random() * (MAP_W - margin * 2);
        const y = margin + Math.random() * (MAP_H - margin * 2);
        mobs.push({
            x, y,
            spawnX: x, spawnY: y,
            size: MOB_SIZE,
            hp: MOB_HP, maxHp: MOB_HP,
            speed: MOB_SPEED,
            damage: MOB_DAMAGE,
            state: "idle",
            lastDmgTime: 0,
            dead: false
        });
    }
}

// ================================
// GAME LOOP
// ================================
function loop(timestamp) {
    if (getState() !== GameState.PLAYING) {
        animId = requestAnimationFrame(loop);
        return;
    }
    const dt = Math.min(timestamp - lastTime, 200);
    lastTime = timestamp;
    update(dt);
    draw();
    animId = requestAnimationFrame(loop);
}

// ================================
// UPDATE
// ================================
function update(dt) {
    updatePlayer(dt);
    updateCamera();
    updateMobs(dt);
    updateTreeAlpha();
    updateHUD();
    checkBossTrigger();
}

// --------------------------------
// Déplacement joueur (souris + ZQSD)
// --------------------------------
function updatePlayer(dt) {
    let dx = 0, dy = 0;

    // ZQSD / flèches en complément
    if (keys["z"] || keys["arrowup"])    dy -= 1;
    if (keys["s"] || keys["arrowdown"])  dy += 1;
    if (keys["q"] || keys["arrowleft"])  dx -= 1;
    if (keys["d"] || keys["arrowright"]) dx += 1;

    // Déplacement souris si aucune touche pressée
    if (dx === 0 && dy === 0 && target) {
        const tdx = target.x - player.x;
        const tdy = target.y - player.y;
        const dist = Math.sqrt(tdx*tdx + tdy*tdy);

        if (dist > 5) {
            dx = tdx / dist;
            dy = tdy / dist;
        } else {
            target = null; // Arrivé à destination
        }
    }

    // Normaliser diagonale clavier
    if ((keys["z"] || keys["s"]) && (keys["q"] || keys["d"])) {
        dx *= 0.707;
        dy *= 0.707;
    }

    const nx = player.x + dx * player.speed;
    const ny = player.y + dy * player.speed;
    const half = player.size / 2;

    // Clamp carte
    player.x = Math.max(half, Math.min(MAP_W - half, nx));
    player.y = Math.max(half, Math.min(MAP_H - half, ny));

    // Collision arbres solides
    for (let t of trees) {
        if (!t.solid) continue;
        const cdx = player.x - t.x;
        const cdy = player.y - t.y;
        const dist = Math.sqrt(cdx*cdx + cdy*cdy);
        const minDist = half + t.r * 0.6; // hitbox un peu plus petite que le visuel
        if (dist < minDist && dist > 0) {
            const push = (minDist - dist) / dist;
            player.x += cdx * push;
            player.y += cdy * push;
        }
    }

    player.x = Math.max(half, Math.min(MAP_W - half, player.x));
    player.y = Math.max(half, Math.min(MAP_H - half, player.y));
}

function updateCamera() {
    camera.x = player.x - canvas.width  / 2;
    camera.y = player.y - canvas.height / 2;
    camera.x = Math.max(0, Math.min(MAP_W - canvas.width,  camera.x));
    camera.y = Math.max(0, Math.min(MAP_H - canvas.height, camera.y));
}

// --------------------------------
// Transparence des arbres
// --------------------------------
function updateTreeAlpha() {
    for (let t of trees) {
        // Est-ce que le joueur est "sous" cet arbre ?
        const dxP = player.x - t.x;
        const dyP = player.y - t.y;
        const distToPlayer = Math.sqrt(dxP*dxP + dyP*dyP);
        const playerUnder = distToPlayer < t.r + player.size / 2;

        // Est-ce qu'un mob visible est sous cet arbre dans la zone de révélation ?
        let mobUnder = false;
        if (distToPlayer < REVEAL_RADIUS) {
            for (let m of mobs) {
                if (m.dead) continue;
                const dxM = m.x - t.x;
                const dyM = m.y - t.y;
                if (Math.sqrt(dxM*dxM + dyM*dyM) < t.r + m.size / 2) {
                    mobUnder = true;
                    break;
                }
            }
        }

        // Cible alpha
        const targetAlpha = (playerUnder || mobUnder) ? TREE_FADE_ALPHA : TREE_FULL_ALPHA;

        // Transition douce
        t.alpha += (targetAlpha - t.alpha) * 0.12;
    }
}

// --------------------------------
// Mobs
// --------------------------------
function updateMobs(dt) {
    const now = performance.now();

    for (let m of mobs) {
        if (m.dead) continue;

        const dx = player.x - m.x;
        const dy = player.y - m.y;
        const distToPlayer = Math.sqrt(dx*dx + dy*dy);

        const sdx = m.spawnX - m.x;
        const sdy = m.spawnY - m.y;
        const distToSpawn = Math.sqrt(sdx*sdx + sdy*sdy);

        if (m.state === "idle") {
            if (distToPlayer < MOB_AGGRO_RANGE) m.state = "chase";

        } else if (m.state === "chase") {
            if (distToSpawn > MOB_LEASH_RANGE) {
                m.state = "leash";
            } else {
                if (distToPlayer > 0) {
                    m.x += (dx / distToPlayer) * m.speed;
                    m.y += (dy / distToPlayer) * m.speed;
                }
                if (distToPlayer < (player.size / 2 + m.size / 2)) {
                    if (now - m.lastDmgTime > MOB_DAMAGE_CD) {
                        player.hp = Math.max(0, player.hp - m.damage);
                        m.lastDmgTime = now;
                        if (player.hp <= 0) onPlayerDeath();
                    }
                }
            }

        } else if (m.state === "leash") {
            if (distToSpawn > 4) {
                m.x += (sdx / distToSpawn) * m.speed * 1.5;
                m.y += (sdy / distToSpawn) * m.speed * 1.5;
                m.hp = Math.min(m.maxHp, m.hp + 0.3);
            } else {
                m.state = "idle";
            }
            if (distToPlayer < MOB_AGGRO_RANGE) m.state = "chase";
        }
    }
}

function checkBossTrigger() {
    if (bossSpawned) return;
    if (mobsKilled >= mobsToKill) {
        bossSpawned = true;
        spawnBoss();
    }
}

function spawnBoss() {
    boss = {
        x: player.x + 300, y: player.y,
        size: 55, hp: 300, maxHp: 300,
        speed: 1.2, damage: 15,
        lastDmgTime: 0, dead: false
    };
    showBossAlert();
}

function onPlayerDeath() {
    stopForet();
    setState(GameState.DEAD);
    document.getElementById("death-screen")?.classList.remove("hidden");
    document.getElementById("death-screen")?.classList.add("show");
}

export function onMobKilled() {
    mobsKilled++;
}

// ================================
// DRAW
// ================================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fond herbe
    ctx.fillStyle = "#2d5a1b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Ordre de dessin : sol → mobs → joueur → arbres (par-dessus)
    drawMobs();
    drawPlayer();
    drawTrees();       // les arbres sont dessinés PAR-DESSUS le joueur/mobs
    if (boss && !boss.dead) drawBoss();

    // Indicateur de cible (point cliqué)
    if (target) drawTarget();

    ctx.restore();
}

function drawTrees() {
    const margin = 80;
    for (let t of trees) {
        if (t.x < camera.x - margin || t.x > camera.x + canvas.width  + margin) continue;
        if (t.y < camera.y - margin || t.y > camera.y + canvas.height + margin) continue;

        ctx.globalAlpha = t.alpha;

        // Tronc
        ctx.fillStyle = "#4a2e0a";
        ctx.beginPath();
        ctx.arc(t.x, t.y + t.r * 0.3, t.r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Feuillage
        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fill();

        // Reflet
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.beginPath();
        ctx.arc(t.x - t.r * 0.2, t.y - t.r * 0.2, t.r * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1.0;
    }
}

function drawMobs() {
    for (let m of mobs) {
        if (m.dead) continue;
        if (m.x < camera.x - 100 || m.x > camera.x + canvas.width  + 100) continue;
        if (m.y < camera.y - 100 || m.y > camera.y + canvas.height + 100) continue;

        ctx.fillStyle = m.state === "chase" ? "#cc3333" : "#884444";
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size / 2, 0, Math.PI * 2);
        ctx.fill();

        drawHealthBar(m.x - 20, m.y - m.size / 2 - 10, 40, 5, m.hp / m.maxHp, "#ff4444");
    }
}

function drawBoss() {
    ctx.fillStyle = "#7700aa";
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#dd00ff";
    ctx.lineWidth = 3;
    ctx.stroke();
    drawHealthBar(boss.x - 50, boss.y - boss.size / 2 - 14, 100, 8, boss.hp / boss.maxHp, "#dd00ff");
}

function drawPlayer() {
    // Ombre au sol
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(player.x, player.y + player.size / 2 - 4, player.size / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Corps joueur
    ctx.fillStyle = "#4aa3ff";
    ctx.fillRect(
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );
}

function drawTarget() {
    // Petit cercle à la destination
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(target.x, target.y, 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(target.x, target.y, 4, 0, Math.PI * 2);
    ctx.stroke();
}

function drawHealthBar(x, y, w, h, pct, color) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w * Math.max(0, pct), h);
}

// ================================
// HUD
// ================================
function updateHUD() {
    const bar = document.getElementById("healthbar");
    if (bar) {
        const pct = player.hp / player.maxHp;
        bar.style.width = (pct * 100) + "%";
        bar.style.background = pct > 0.6 ? "#00ff55" : pct > 0.3 ? "#ffaa00" : "#ff4444";
    }

    const xpbar = document.getElementById("xpbar");
    if (xpbar) {
        xpbar.style.width = (Math.min(mobsKilled / mobsToKill, 1) * 100) + "%";
        xpbar.style.background = "#ff8800";
    }
}

// ================================
// BOSS ALERT
// ================================
function showBossAlert() {
    const el = document.createElement("div");
    el.style.cssText = `
        position: fixed; top: 30%; left: 50%;
        transform: translateX(-50%);
        font-family: 'Cinzel', serif; font-size: 32px;
        color: #dd00ff; text-shadow: 0 0 20px #dd00ff;
        z-index: 9000; pointer-events: none;
        animation: fadeout 3s forwards;
    `;
    el.textContent = "⚠ Un Gardien Corrompu approche...";
    document.body.appendChild(el);

    if (!document.getElementById("boss-alert-style")) {
        const s = document.createElement("style");
        s.id = "boss-alert-style";
        s.textContent = `@keyframes fadeout { 0%,70%{opacity:1} 100%{opacity:0} }`;
        document.head.appendChild(s);
    }
    setTimeout(() => el.remove(), 3000);
}
