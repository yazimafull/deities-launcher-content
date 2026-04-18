// healthbar.js
import { player } from "./player.js";

export function updateHealthBar() {
    const bar = document.getElementById("healthbar");
    const pct = player.hp / player.maxHp;
    bar.style.width = (pct * 100) + "%";

    if (pct > 0.6) bar.style.background = "#00ff55";
    else if (pct > 0.3) bar.style.background = "#ffaa00";
    else bar.style.background = "#ff4444";
}
