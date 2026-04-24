// systems/player.js
// Stats et comportement du joueur — source unique de vérité

// ================================
// STATS DU JOUEUR
// ================================
export const playerStats = {
    // --- MOUVEMENT ---
    speed:               1.5,
    moveSpeedMultiplier: 1.0,

    // --- VIE ---
    hp:      100,
    maxHp:   100,
    hpRegen: 0,

    // --- 🛡️ SHIELD UNIQUE ---
    shield:      0,
    maxShield:   0,
    shieldRegen: 0.5, // points par seconde

    // --- DÉFENSE ---
    armor:          0,
    resistance:     0,
    dodgeChance:    0,
    parryChance:    0,
    parryReduction: 0.7,
    blockChance:    0,
    blockValue:     0,

    // --- COMBAT ---
    damage:         10,
    critChance:     0.1,
    critMultiplier: 2,
    element:        null,

    // --- TIR ---
    fireRate:    500,
    lastShot:    0,
    bulletSpeed: 8,
    bulletSize:  8,
    bulletRange: 800,
    piercing:    false
};

// ================================
// TIR AUTOMATIQUE
// ================================
export function tryShoot(player, mobs, spawnBulletFn) {
    if (!mobs || mobs.length === 0) return;

    const now = performance.now();
    if (now - player.lastShot < player.fireRate) return;

    let best = null;
    let bestDist = Infinity;

    for (let m of mobs) {
        if (m.dead) continue;

        const dx = m.x - player.x;
        const dy = m.y - player.y;
        const d = dx * dx + dy * dy;

        if (d < bestDist) {
            bestDist = d;
            best = m;
        }
    }

    if (!best) return;

    player.lastShot = now;
    spawnBulletFn(player, best);
}

// ================================
// REGEN SHIELD
// ================================
export function updateShield(dt) {
    if (playerStats.shield < playerStats.maxShield) {
        playerStats.shield += playerStats.shieldRegen * (dt / 1000);

        if (playerStats.shield > playerStats.maxShield) {
            playerStats.shield = playerStats.maxShield;
        }
    }
}

// ================================
// DESSIN DU JOUEUR
// ================================
export function drawPlayerSprite(ctx, player) {
    // Ombre
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(
        player.x,
        player.y + player.size / 2 - 4,
        player.size / 2,
        6,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Corps
    ctx.fillStyle = "#4aa3ff";
    ctx.fillRect(
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );
}