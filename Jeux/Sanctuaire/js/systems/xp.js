// xp.js
import { randRange } from "./utils.js";
import { setState, GameState } from "./state.js";
import { showLevelUpMenu } from "./levelup.js";

export const xpOrbs = [];

export const xpSystem = {
    xp: 0,
    xpToNext: 50,
    level: 1
};

export function spawnXP(x, y) {
    xpOrbs.push({
        x,
        y,
        size: 8,
        value: randRange(4, 8)
    });
}

export function updateXP(player) {
    for (let i = xpOrbs.length - 1; i >= 0; i--) {
        let o = xpOrbs[i];

        let dx = player.x - o.x;
        let dy = player.y - o.y;
        let d = Math.sqrt(dx * dx + dy * dy);

        // ✅ Évite la division par zéro si l'orbe est exactement sur le joueur
        if (d > 0) {
            dx /= d;
            dy /= d;
            o.x += dx * 1.5;
            o.y += dy * 1.5;
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

                showLevelUpMenu();
            }
        }
    }
}

export function drawXP(ctx) {
    ctx.fillStyle = "#4aa3ff";
    for (let o of xpOrbs) {
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function drawXPBar() {
    const bar = document.getElementById("xpbar");
    if (!bar) return;
    const pct = xpSystem.xp / xpSystem.xpToNext;
    bar.style.width = (pct * 100) + "%";
}
