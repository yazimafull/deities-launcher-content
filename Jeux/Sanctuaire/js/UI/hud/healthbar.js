// healthbar.js
// Gère : Vie + Bouclier Physique + Bouclier Magique

export function updateHealthBar(player) {

    // ================================
    // VIE
    // ================================
    const hpPct = player.hp / player.maxHp;
    const hpBar = document.getElementById("healthbar");

    if (hpBar) {
        hpBar.style.width = (hpPct * 100) + "%";

        if (hpPct > 0.6) hpBar.style.background = "#00ff55";
        else if (hpPct > 0.3) hpBar.style.background = "#ffaa00";
        else hpBar.style.background = "#ff4444";
    }

    // ================================
    // BOUCLIER PHYSIQUE
    // ================================
    const spPct = player.shieldPhysical / player.maxShieldPhysical;
    const spBar = document.getElementById("shield-physical-bar");

    if (spBar) {
        if (player.maxShieldPhysical > 0) {
            spBar.style.width = (spPct * 100) + "%";
            spBar.classList.remove("hidden");
        } else {
            spBar.classList.add("hidden");
        }

        spBar.style.background = "#4da6ff"; // bleu clair
    }

    // ================================
    // BOUCLIER MAGIQUE
    // ================================
    const smPct = player.shieldMagic / player.maxShieldMagic;
    const smBar = document.getElementById("shield-magic-bar");

    if (smBar) {
        if (player.maxShieldMagic > 0) {
            smBar.style.width = (smPct * 100) + "%";
            smBar.classList.remove("hidden");
        } else {
            smBar.classList.add("hidden");
        }

        smBar.style.background = "#c266ff"; // violet
    }
}
