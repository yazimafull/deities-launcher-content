// ui/hud/hudSystem.js

let hudData = {
    hp: 1,
    maxHp: 1,

    shield: 0,
    maxShield: 1,

    xp: 0,
    xpMax: 1,

    objective: 0,
    objectiveMax: 1,

    timer: 0,
    bossSpawned: false,

    dungeon: null
};

// ================================
// CORE API (OBJET HUD)
// ================================
export const HUD = {

    init(data = {}) {
        hudData = { ...hudData, ...data };
        updateHTMLBars();
    },

    update(data = {}) {
        hudData = { ...hudData, ...data };
        updateHTMLBars();
    },

    draw(ctx, canvas) {
        if (!ctx || !canvas) return;

        drawObjectiveText(ctx, canvas);
        drawTimer(ctx, canvas);
        drawBossIndicator(ctx, canvas);
    },

    toggleEditMode() {
        document.body.classList.toggle("hud-edit-mode");
    },

    show() {
        document.getElementById("hud-root")?.classList.remove("hidden");
    },

    hide() {
        document.getElementById("hud-root")?.classList.add("hidden");
    }
};

// ================================
// SAFE UTILS
// ================================
function clamp01(v) {
    return Math.max(0, Math.min(1, v || 0));
}

function safeRatio(v, max) {
    if (!max || max <= 0) return 0;
    return clamp01(v / max);
}

function setBar(name, ratio, color) {
    const el = document.querySelector(`[data-bar="${name}"] .fill`);
    if (!el) return;

    el.style.width = `${clamp01(ratio) * 100}%`;
    if (color) el.style.background = color;
}

// ================================
// HUD BARS
// ================================
function updateHTMLBars() {

    const hpRatio = safeRatio(hudData.hp, hudData.maxHp);

    setBar(
        "hp",
        hpRatio,
        hpRatio > 0.6 ? "#00ff55"
        : hpRatio > 0.3 ? "#ffaa00"
        : "#ff4444"
    );

    setBar("shield", safeRatio(hudData.shield, hudData.maxShield), "#66ccff");

    setBar("xp", safeRatio(hudData.xp, hudData.xpMax), "#ffcc00");
}

// ================================
// OBJECTIVE
// ================================
function drawObjectiveText(ctx, canvas) {

    const obj = Math.min(hudData.objective, hudData.objectiveMax);

    const label = hudData.bossSpawned
        ? "⚠ Boss en approche !"
        : `Objectif : ${obj} / ${hudData.objectiveMax}`;

    ctx.save();
    ctx.font = "16px Cinzel";
    ctx.textAlign = "center";

    ctx.fillStyle = hudData.bossSpawned ? "#dd00ff" : "#ffcc88";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 6;

    ctx.fillText(label, canvas.width / 2, 48);
    ctx.restore();
}

// ================================
// TIMER
// ================================
function drawTimer(ctx, canvas) {

    const remaining = Math.max(0, hudData.timer);

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    const timeStr = `${minutes}:${String(seconds).padStart(2, "0")}`;

    const ratio = remaining / (5 * 60 * 1000);

    const color = `rgb(255, ${Math.floor(255 * ratio)}, ${Math.floor(255 * ratio)})`;

    ctx.save();
    ctx.font = "26px Cinzel";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;

    if (remaining < 60000) {
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(performance.now() / 120);
    }

    ctx.fillText(timeStr, canvas.width / 2, 80);
    ctx.restore();
}

// ================================
// BOSS
// ================================
function drawBossIndicator(ctx, canvas) {

    if (!hudData.bossSpawned) return;

    ctx.save();
    ctx.font = "14px Cinzel";
    ctx.textAlign = "center";

    ctx.fillStyle = "#dd00ff";
    ctx.shadowColor = "#dd00ff";
    ctx.shadowBlur = 10;

    ctx.fillText("Gardien détecté...", canvas.width / 2, 110);

    ctx.restore();
}