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
    bossSpawned: false
};

// ================================
// API
// ================================
export function HUD_init(data = {}) {
    hudData = { ...hudData, ...data };
    updateHTMLBars();
}

export function HUD_update(data = {}) {
    hudData = { ...hudData, ...data };
    updateHTMLBars();
}

export function HUD_draw(ctx, canvas) {
    if (!ctx || !canvas) return;

    drawObjectiveText(ctx, canvas);
    drawTimer(ctx, canvas);
    drawBossIndicator(ctx, canvas);
}

// ================================
// BAR SYSTEM SAFE
// ================================
function clamp01(v) {
    return Math.max(0, Math.min(1, v || 0));
}

function setBar(name, ratio, color) {
    const el = document.querySelector(`[data-bar="${name}"] .fill`);
    if (!el) return;

    el.style.width = `${clamp01(ratio) * 100}%`;

    if (color) {
        el.style.background = color;
    }
}

// ================================
// HTML BARS
// ================================
function updateHTMLBars() {

    // HP
    setBar(
        "hp",
        hudData.hp / hudData.maxHp,
        hudData.hp / hudData.maxHp > 0.6
            ? "#00ff55"
            : hudData.hp / hudData.maxHp > 0.3
                ? "#ffaa00"
                : "#ff4444"
    );

    // SHIELD (safe division)
    setBar(
        "shield",
        hudData.maxShield > 0 ? hudData.shield / hudData.maxShield : 0,
        "#66ccff"
    );

    // XP
    setBar(
        "xp",
        hudData.xp / hudData.xpMax,
        "#ffcc00"
    );
}

// ================================
// OBJECTIVE (CANVAS)
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

    const r = 255;
    const g = Math.floor(255 * ratio);
    const b = Math.floor(255 * ratio);

    const color = `rgb(${r},${g},${b})`;

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
// BOSS INDICATOR
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