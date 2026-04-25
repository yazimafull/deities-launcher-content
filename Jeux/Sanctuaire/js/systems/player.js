// systems/player.js
// Source de vérité des stats + logique combat joueur

// ================================
// BASE STATS (TEMPLATE)
// ================================
export const playerStats = {
    // --- MOVE ---
    speed: 1.5,
    moveSpeedMultiplier: 1.0,

    // --- HP ---
    hp: 100,
    maxHp: 100,
    hpRegen: 0,

    // --- SHIELD ---
    shield: 0,
    maxShield: 0,
    shieldRegen: 0.5,

    // --- DEFENSE ---
    armor: 0,
    resistance: 0,
    dodgeChance: 0,
    parryChance: 0,

    // --- OFFENSE ---
    damage: 10,
    critChance: 0.1,
    critMultiplier: 2,
    element: null,

    // --- SHOOT ---
    fireRate: 500,
    lastShot: 0,
    bulletSpeed: 8,
    bulletSize: 8,
    bulletRange: 800,
    piercing: false
};

// ================================
// SHOOT LOGIC
// ================================
export function tryShoot(player, enemies, spawnProjectile) {
    if (!player || !enemies || enemies.length === 0) return;

    const now = performance.now();
    if (now - (player.lastShot || 0) < player.fireRate) return;

    let target = null;
    let bestDist = Infinity;

    for (const e of enemies) {
        if (e.dead) continue;

        const dx = e.x - player.x;
        const dy = e.y - player.y;
        const d = dx * dx + dy * dy;

        if (d < bestDist) {
            bestDist = d;
            target = e;
        }
    }

    if (!target) return;

    player.lastShot = now;
    spawnProjectile(player, target);
}

// ================================
// SHIELD REGEN (CALL FROM ENGINE)
// ================================
export function updateShield(player, dt) {
    if (!player) return;
    if (player.maxShield <= 0) return;

    if (player.shield < player.maxShield) {
        player.shield += player.shieldRegen * (dt / 1000);

        if (player.shield > player.maxShield) {
            player.shield = player.maxShield;
        }
    }
}

// ================================
// OPTIONAL PLAYER DRAW (pure visual)
// ================================
export function drawPlayerSprite(ctx, player) {
    if (!ctx || !player) return;

    // shadow
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

    // body
    ctx.fillStyle = "#4aa3ff";
    ctx.fillRect(
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );
}