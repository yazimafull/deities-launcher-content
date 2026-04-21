// ui/hud/hudSystem.js
// HUD HTML + Canvas (texte) — propre, modulaire, cohérent avec ton style actuel

let hudData = {
    hp: 1,
    maxHp: 1,
    xp: 0,
    xpMax: 1,
    objective: 0,
    objectiveMax: 1,
    timer: 0,            // en millisecondes
    bossSpawned: false
};

// ================================
// PUBLIC API
// ================================
export function updateHUD(data) {
    hudData = { ...hudData, ...data };
    updateHTMLBars();
}

export function drawHUD(ctx, canvas) {
    drawObjectiveText(ctx, canvas);
    drawTimer(ctx, canvas);
    drawBossIndicator(ctx, canvas);
}

// ================================
// HTML BARS (vie, xp, objectif)
// ================================
function updateHTMLBars() {
    // --- Barre de vie ---
    const hpPct = hudData.hp / hudData.maxHp;
    const hpBar = document.getElementById("healthbar");
    if (hpBar) {
        hpBar.style.width = (hpPct * 100) + "%";
        hpBar.style.background = hpPct > 0.6 ? "#00ff55" : hpPct > 0.3 ? "#ffaa00" : "#ff4444";
    }

    // --- Barre d'XP ---
    const xpPct = hudData.xp / hudData.xpMax;
    const xpBar = document.getElementById("xpbar");
    if (xpBar) {
        xpBar.style.width = (xpPct * 100) + "%";
    }

    // --- Barre d'objectif ---
    const objPct = Math.min(hudData.objective / hudData.objectiveMax, 1);
    const objBar = document.getElementById("objectivebar");
    if (objBar) {
        objBar.style.width = (objPct * 100) + "%";
        objBar.style.background = hudData.bossSpawned ? "#dd00ff" : "#ff8800";
    }
}

// ================================
// TEXTE OBJECTIF (Canvas)
// ================================
function drawObjectiveText(ctx, canvas) {
    const label = hudData.bossSpawned
        ? "⚠ Boss en approche !"
        : `Objectif : ${Math.min(hudData.objective, hudData.objectiveMax)} / ${hudData.objectiveMax}`;

    ctx.save();
    ctx.font = "16px 'Cinzel', serif";
    ctx.textAlign = "center";
    ctx.fillStyle = hudData.bossSpawned ? "#dd00ff" : "#ffcc88";
    ctx.shadowColor = hudData.bossSpawned ? "#dd00ff" : "#000000";
    ctx.shadowBlur = 6;
    ctx.fillText(label, canvas.width / 2, 48);
    ctx.restore();
}

// ================================
// TIMER (Canvas)
// ================================
function drawTimer(ctx, canvas) {
    const remaining = Math.max(0, hudData.timer);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    // Dégradé blanc → rouge
    const ratio = remaining / (5 * 60 * 1000); // basé sur 5 minutes
    const r = 255;
    const g = Math.floor(255 * ratio);
    const b = Math.floor(255 * ratio);
    const color = `rgb(${r},${g},${b})`;

    ctx.save();
    ctx.font = "26px 'Cinzel', serif";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;

    // Pulse si < 1 minute
    if (remaining < 60000) {
        const pulse = 0.7 + 0.3 * Math.sin(performance.now() / 120);
        ctx.globalAlpha = pulse;
    }

    ctx.fillText(timeStr, canvas.width / 2, 80);
    ctx.restore();
}

// ================================
// BOSS INDICATOR (Canvas)
// ================================
function drawBossIndicator(ctx, canvas) {
    if (!hudData.bossSpawned) return;

    // Ici : juste un petit effet visuel en haut
    ctx.save();
    ctx.font = "14px 'Cinzel', serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#dd00ff";
    ctx.shadowColor = "#dd00ff";
    ctx.shadowBlur = 10;
    ctx.fillText("Gardien détecté...", canvas.width / 2, 110);
    ctx.restore();
}
