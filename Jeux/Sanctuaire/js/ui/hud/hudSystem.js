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

    bossSpawned: false
};

// ================================
// API HUD UNIQUE
// ================================
export const HUD = {

    init(data = {}) {
        hudData = { ...hudData, ...data };
        updateBars();
    },

    update(data = {}) {
        hudData = { ...hudData, ...data };
        updateBars();
    },

    draw(ctx, canvas) {
        if (!ctx || !canvas) return;

        drawObjective(ctx, canvas);
        drawBoss(ctx, canvas);
    },

    show() {
        document.getElementById("hud-root")?.classList.remove("hidden");
    },

    hide() {
        document.getElementById("hud-root")?.classList.add("hidden");
    },

    toggleEditMode() {
        document.body.classList.toggle("hud-edit-mode");
    }
};

// ================================
// SAFE HELPERS
// ================================
function clamp01(v) {
    return Math.max(0, Math.min(1, v || 0));
}

function ratio(v, max) {
    if (!max) return 0;
    return clamp01(v / max);
}

function setBar(name, value, max, color) {
    const el = document.querySelector(`[data-bar="${name}"] .fill`);
    if (!el) return;

    el.style.width = `${ratio(value, max) * 100}%`;
    if (color) el.style.background = color;
}

// ================================
// BARS HTML
// ================================
function updateBars() {

    const hpRatio = ratio(hudData.hp, hudData.maxHp);

    setBar("hp", hudData.hp, hudData.maxHp,
        hpRatio > 0.6 ? "#00ff55"
        : hpRatio > 0.3 ? "#ffaa00"
        : "#ff4444"
    );

    setBar("shield", hudData.shield, hudData.maxShield, "#66ccff");
    setBar("xp", hudData.xp, hudData.xpMax, "#ffcc00");
}

// ================================
// OBJECTIVE DISPLAY
// ================================
function drawObjective(ctx, canvas) {

    const obj = Math.min(hudData.objective, hudData.objectiveMax);

    ctx.save();
    ctx.font = "16px Cinzel";
    ctx.textAlign = "center";

    ctx.fillStyle = hudData.bossSpawned ? "#dd00ff" : "#ffcc88";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 6;

    ctx.fillText(
        hudData.bossSpawned
            ? "⚠ Boss en approche !"
            : `Objectif : ${obj} / ${hudData.objectiveMax}`,
        canvas.width / 2,
        48
    );

    ctx.restore();
}

// ================================
// BOSS TEXT
// ================================
function drawBoss(ctx, canvas) {

    if (!hudData.bossSpawned) return;

    ctx.save();
    ctx.font = "14px Cinzel";
    ctx.textAlign = "center";
    ctx.fillStyle = "#dd00ff";
    ctx.shadowColor = "#dd00ff";
    ctx.shadowBlur = 10;

    ctx.fillText("Gardien détecté...", canvas.width / 2, 80);

    ctx.restore();
}