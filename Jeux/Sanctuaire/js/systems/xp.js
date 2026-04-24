 // systems/xp.js

import { randRange } from "../core/utils.js";
import { openLevelUpMenu } from "./levelup.js";

export const xpOrbs = [];

export const xpSystem = {
    xp: 0,
    xpToNext: 50,
    level: 1
};

// ================================
// SPAWN XP ORB
// ================================
export function spawnXP(x, y) {
    xpOrbs.push({
        x,
        y,
        size: 8,
        value: randRange(4, 8)
    });
}

// ================================
// UPDATE XP SYSTEM
// ================================
export function updateXP(player) {

    for (let i = xpOrbs.length - 1; i >= 0; i--) {

        const orb = xpOrbs[i];

        const dx = player.x - orb.x;
        const dy = player.y - orb.y;
        const dist = Math.hypot(dx, dy);

        // attraction
        if (dist > 0) {
            const pull = 1.5;
            orb.x += (dx / dist) * pull;
            orb.y += (dy / dist) * pull;
        }

        // pickup
        if (dist < 20) {

            xpSystem.xp += orb.value;
            xpOrbs.splice(i, 1);

            // LEVEL UP LOOP (multi-level safe)
            while (xpSystem.xp >= xpSystem.xpToNext) {

                xpSystem.xp -= xpSystem.xpToNext;
                xpSystem.level++;
                xpSystem.xpToNext = Math.floor(xpSystem.xpToNext * 1.25);

                openLevelUpMenu();
            }
        }
    }
}

// ================================
// DRAW ORBS
// ================================
export function drawXP(ctx) {

    ctx.fillStyle = "#4aa3ff";

    for (const o of xpOrbs) {
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}