// biome_wip.js
// Squelette pour Ruines Oubliées et Abysses — Work In Progress
// Version sans import/export — tout global

let canvas, ctx;
let animId = null;
let biomeName = "";

// ================================
// LISTENER ESC RETIRABLE
// ================================
window._wipKeydown = (e) => {
    if (e.key === "Escape" && window.getState && getState() === GameState.PLAYING) {
        if (window.openPause) window.openPause();
    }
};
window.addEventListener("keydown", window._wipKeydown);

// ================================
// INITIALISATION
// ================================
function initBiomeWIP(name) {
    biomeName = name;

    canvas = document.getElementById("game-canvas");
    ctx    = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    document.getElementById("game-canvas")?.classList.remove("hidden");
    document.getElementById("healthbar-container")?.classList.remove("hidden");
    document.getElementById("xpbar-container")?.classList.remove("hidden");

    if (window.setState) setState(GameState.PLAYING);

    animId = requestAnimationFrame(loop);
}

// ================================
// STOP BIOME WIP
// ================================
function stopBiomeWIP() {

    // Stopper la boucle
    if (animId) cancelAnimationFrame(animId);
    animId = null;

    // Retirer le listener ESC
    if (window._wipKeydown) {
        window.removeEventListener("keydown", window._wipKeydown);
        window._wipKeydown = null;
    }

    // Nettoyer le canvas
    const canvas = document.getElementById("game-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.add("hidden");
    }
}

// ================================
// LOOP
// ================================
function loop() {
    if (window.getState && getState() !== GameState.PLAYING) {
        animId = requestAnimationFrame(loop);
        return;
    }
    draw();
    animId = requestAnimationFrame(loop);
}

// ================================
// DRAW — placeholder visuel
// ================================
function draw() {
    if (biomeName === "ruines") {
        ctx.fillStyle = "#1a1510";
    } else if (biomeName === "abysses") {
        ctx.fillStyle = "#050510";
    } else {
        ctx.fillStyle = "#111";
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.fillStyle = "rgba(201,168,106,0.15)";
    ctx.fillRect(canvas.width/2 - 300, canvas.height/2 - 80, 600, 160);

    ctx.strokeStyle = "#c9a86a";
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width/2 - 300, canvas.height/2 - 80, 600, 160);

    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 28px 'Cinzel', serif";
    ctx.textAlign = "center";
    ctx.fillText(getBiomeLabel(), canvas.width/2, canvas.height/2 - 20);

    ctx.fillStyle = "#b8a88a";
    ctx.font = "16px 'Cinzel', serif";
    ctx.fillText("Work In Progress — Appuyez sur Echap pour la pause", canvas.width/2, canvas.height/2 + 20);

    ctx.restore();
}

function getBiomeLabel() {
    if (biomeName === "ruines")  return "⚒ Ruines Oubliées";
    if (biomeName === "abysses") return "🌑 Abysses";
    return biomeName;
}

// ================================
// 🔥 Rendre accessibles globalement
// ================================
window.initBiomeWIP = initBiomeWIP;
window.stopBiomeWIP = stopBiomeWIP;
