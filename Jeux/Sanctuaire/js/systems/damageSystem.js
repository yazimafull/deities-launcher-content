// systems/damageSystem.js
// Damage system simple + DoT simple + compatible avec un futur éditeur d'habilités

// ================================
// DAMAGE NUMBERS
// ================================
let dmgNumbers = [];

function updateDamageNumbers(dt) {
    for (let i = dmgNumbers.length - 1; i >= 0; i--) {
        const n = dmgNumbers[i];
        n.y -= dt * 0.05;
        n.alpha -= dt * 0.0008;

        if (n.alpha <= 0) dmgNumbers.splice(i, 1);
    }
}

function drawDamageNumbers(ctx) {
    for (let n of dmgNumbers) {
        ctx.save();
        ctx.globalAlpha = n.alpha;
        ctx.font = n.isCrit ? "bold 20px Cinzel" : "16px Cinzel";
        ctx.fillStyle = n.isPlayer ? "#ff4444" : "#ffcc88";
        ctx.textAlign = "center";
        ctx.fillText(n.value, n.x, n.y);
        ctx.restore();
    }
}

function spawnDamageNumber(x, y, value, isCrit = false, isPlayer = false) {
    dmgNumbers.push({
        x,
        y,
        value,
        isCrit,
        isPlayer,
        alpha: 1
    });
}

// ================================
// DOT SYSTEM (simple, individuel)
// ================================
function updateDots(dt, entity) {
    if (!entity.dots) return;

    for (let i = entity.dots.length - 1; i >= 0; i--) {
        const dot = entity.dots[i];

        dot.timer += dt;

        // Tick toutes les 1000 ms
        if (dot.timer >= 1000) {
            dot.timer = 0;
            applyDamage(entity, dot.amount, { type: dot.type });
        }

        dot.remaining -= dt;
        if (dot.remaining <= 0) {
            entity.dots.splice(i, 1);
        }
    }
}

function applyDot(entity, dotConfig) {
    if (!entity.dots) entity.dots = [];

    entity.dots.push({
        type: dotConfig.type,
        amount: dotConfig.amount,
        remaining: dotConfig.duration * 1000,
        timer: 0
    });
}

// ================================
// DAMAGE APPLICATION
// ================================
function damageEnemy(mob, dmgPacket) {
    if (mob.dead) return;

    const finalDamage = computeDamage(mob, dmgPacket);

    mob.hp = Math.max(0, mob.hp - finalDamage);

    spawnDamageNumber(mob.x, mob.y, finalDamage, dmgPacket.isCrit);

    // DoT simple
    if (dmgPacket.dot) {
        applyDot(mob, dmgPacket.dot);
    }
}

function damagePlayer(player, dmgPacket) {
    const finalDamage = computeDamage(player, dmgPacket);

    player.hp = Math.max(0, player.hp - finalDamage);

    spawnDamageNumber(player.x, player.y, finalDamage, dmgPacket.isCrit, true);

    if (dmgPacket.dot) {
        applyDot(player, dmgPacket.dot);
    }
}

// ================================
// DAMAGE CALCULATION
// ================================
function computeDamage(target, dmgPacket) {
    let dmg = dmgPacket.base ?? 0;

    // Multiplicateur (habilité)
    if (dmgPacket.multiplier) {
        dmg *= dmgPacket.multiplier;
    }

    // Résistances simples
    if (dmgPacket.type && target.resistances) {
        const res = target.resistances[dmgPacket.type] ?? 0;
        dmg *= (1 - res);
    }

    return Math.floor(dmg);
}

// ================================
// BIOME DAMAGE (DoT externe)
// ================================
let biomeTickTimer = 0;

function applyBiomeDamage(dt, difficulty, player) {
    const dmgPerSecond = Math.max(0, difficulty - 1);

    if (dmgPerSecond <= 0) return;

    biomeTickTimer += dt;

    if (biomeTickTimer >= 1000) {
        biomeTickTimer = 0;

        damagePlayer(player, {
            base: dmgPerSecond,
            type: "biome"
        });
    }
}
