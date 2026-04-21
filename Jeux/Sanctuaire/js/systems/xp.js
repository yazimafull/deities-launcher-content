// systems/xp.js

import { randRange } from "../core/utils.js";
import { openLevelUpMenu } from "./levelup.js";

export const xpOrbs = [];

export const xpSystem = {
    xp: 0,
    xpToNext: 50,
    level: 1
};

// --------------------------------------------------
// SPAWN XP
// --------------------------------------------------
export function spawnXP(x, y) {
    xpOrbs.push({
        x,
        y,
        size: 8,
        value: randRange(4, 8)
    });
}

// --------------------------------------------------
// UPDATE XP
// --------------------------------------------------
export function updateXP(player) {
    for (let i = xpOrbs.length - 1; i >= 0; i--) {
        const o = xpOrbs[i];

        const dx = player.x - o.x;
        const dy = player.y - o.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        // Attraction vers le joueur
        if (d > 0) {
            o.x += (dx / d) * 1.5;
            o.y += (dy / d) * 1.5;
        }

        // Pickup
        if (d < 20) {
            xpSystem.xp += o.value;
            xpOrbs.splice(i, 1);

            // Level up
            if (xpSystem.xp >= xpSystem.xpToNext) {
                xpSystem.xp -= xpSystem.xpToNext;
                xpSystem.level++;
                xpSystem.xpToNext = Math.floor(xpSystem.xpToNext * 1.25);

                // OUVERTURE DU MENU LEVEL-UP
                openLevelUpMenu();
            }
        }
    }
}

// --------------------------------------------------
// DRAW XP ORBS
// --------------------------------------------------
export function drawXP(ctx) {
    ctx.fillStyle = "#4aa3ff";
    for (const o of xpOrbs) {
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --------------------------------------------------
// DRAW XP BAR
// --------------------------------------------------
export function drawXPBar() {
    const bar = document.getElementById("xpbar");
    if (!bar) return;

    const pct = xpSystem.xp / xpSystem.xpToNext;
    bar.style.width = (pct * 100) + "%";
}
