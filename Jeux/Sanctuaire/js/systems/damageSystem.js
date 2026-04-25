﻿// systems/damageSystem.js

export let dmgNumbers = [];

// ================================
// DAMAGE NUMBERS SYSTEM
// ================================
export function updateDamageNumbers(dt) {

    for (let i = dmgNumbers.length - 1; i >= 0; i--) {

        const n = dmgNumbers[i];

        n.y -= dt * 0.05;
        n.alpha -= dt * 0.0008;

        if (n.alpha <= 0) {
            dmgNumbers.splice(i, 1);
        }
    }
}

export function drawDamageNumbers(ctx) {

    for (let n of dmgNumbers) {

        ctx.save();

        ctx.globalAlpha = n.alpha;
        ctx.font = n.isCrit ? "bold 20px Cinzel" : "16px Cinzel";
        ctx.textAlign = "center";

        ctx.fillStyle = n.isPlayer ? "#ff4444" : "#ffcc88";

        ctx.fillText(n.value, n.x, n.y);

        ctx.restore();
    }
}

export function spawnDamageNumber(x, y, value, isCrit = false, isPlayer = false) {

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
// DOT SYSTEM
// ================================
export function updateDots(dt, entity) {

    if (!entity?.dots) return;

    for (let i = entity.dots.length - 1; i >= 0; i--) {

        const dot = entity.dots[i];

        dot.timer += dt;
        dot.remaining -= dt;

        // tick damage (1s)
        if (dot.timer >= 1000) {
            dot.timer = 0;

            applyDamage(entity, dot.amount, { type: dot.type });
        }

        if (dot.remaining <= 0) {
            entity.dots.splice(i, 1);
        }
    }
}

export function applyDot(entity, dotConfig) {

    if (!entity.dots) entity.dots = [];

    entity.dots.push({
        type: dotConfig.type,
        amount: dotConfig.amount,
        remaining: dotConfig.duration * 1000,
        timer: 0
    });
}

// ================================
// CORE DAMAGE FUNCTIONS
// ================================
export function damageEnemy(mob, dmgPacket) {

    if (!mob || mob.dead) return;

    const finalDamage = computeDamage(mob, dmgPacket);

    mob.hp = Math.max(0, mob.hp - finalDamage);

    spawnDamageNumber(
        mob.x,
        mob.y,
        finalDamage,
        dmgPacket.isCrit,
        false
    );

    if (dmgPacket.dot) {
        applyDot(mob, dmgPacket.dot);
    }
}

// ================================
// PLAYER DAMAGE (SHIELD SAFE)
// ================================
export function damagePlayer(player, dmgPacket) {

    if (!player) return;

    let damage = computeDamage(player, dmgPacket);

    // ================================
    // SHIELD FIRST
    // ================================
    if (player.shield > 0) {

        const absorbed = Math.min(player.shield, damage);

        player.shield -= absorbed;
        damage -= absorbed;

        if (absorbed > 0) {
            spawnDamageNumber(player.x, player.y, absorbed, false, true);
        }
    }

    // ================================
    // HP DAMAGE
    // ================================
    if (damage > 0) {

        player.hp = Math.max(0, player.hp - damage);

        spawnDamageNumber(
            player.x,
            player.y,
            damage,
            dmgPacket.isCrit,
            true
        );
    }

    if (dmgPacket.dot) {
        applyDot(player, dmgPacket.dot);
    }
}

// ================================
// DAMAGE CALCULATION CORE
// ================================
export function computeDamage(target, dmgPacket) {

    let dmg = dmgPacket.base ?? 0;

    // multiplicateur
    if (dmgPacket.multiplier) {
        dmg *= dmgPacket.multiplier;
    }

    // ================================
    // RÉSISTANCES (correction document)
    // ================================
    if (target?.resistances) {

        const type = dmgPacket.element ?? dmgPacket.type;

        if (type) {
            let res = target.resistances[type] ?? 0;

            // clamp pour éviter les aberrations
            if (res < -0.9) res = -0.9;   // vulnérabilité max +90%
            if (res > 1.0) res = 1.0;     // immunité totale

            dmg *= (1 - res);
        }
    }

    return Math.floor(dmg);
}

// ================================
// BIOME DAMAGE SYSTEM
// ================================
let biomeTickTimer = 0;

export function applyBiomeDamage(dt, difficulty, player) {

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
