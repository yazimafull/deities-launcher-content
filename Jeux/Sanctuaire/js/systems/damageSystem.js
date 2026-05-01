// systems/damageSystem.js
/*
   ROUTE : Jeux/Sanctuaire/js/systems/damageSystem.js
   RÔLE : Système central de gestion des dégâts (ennemis, joueur, DOT, biome)
   EXPORTS : updateDamageNumbers, drawDamageNumbers, spawnDamageNumber,
             updateDots, applyDot, damageEnemy, damagePlayer,
             computeDamage, applyBiomeDamage
   NOTES :
   - Gère tous les types de dégâts + damage numbers
   - DOT tick toutes les 1000 ms
   - Résistances clampées (-0.9 → +1.0)
   - La mort n’est PAS gérée ici (engine.js s’en charge)
*/

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

            // --- CORRECTION : utiliser damageEnemy / damagePlayer ---
            if (entity.isMob) {
                damageEnemy(entity, { base: dot.amount, type: dot.type });
            } else {
                damagePlayer(entity, { base: dot.amount, type: dot.type });
            }
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

    // Aggro immédiat
    if (mob.state === "idle") mob.state = "chase";

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
// PLAYER DAMAGE (DODGE / PARRY / BLOCK / SHIELD)
// ================================
export function damagePlayer(player, dmgPacket) {

    if (!player) return;

    const weaponProfile = player.weapon?.defenseProfile ?? {
        canDodge: true,
        canParry: false,
        canBlock: false,
        dodgePenalty: 0
    };

    // ================================
    // 1) DODGE
    // ================================
    if (weaponProfile.canDodge) {

        const dodgeChance =
            (player.stats?.dodgeChance ?? 0) +
            (weaponProfile.dodgePenalty ?? 0);

        if (Math.random() < dodgeChance / 100) {
            spawnDamageNumber(player.x, player.y, "DODGE", false, true);
            return;
        }
    }

    // ================================
    // 2) PARRY
    // ================================
    if (weaponProfile.canParry) {

        const parryChance = player.stats?.parryChance ?? 0;

        if (Math.random() < parryChance / 100) {

            const parryPower = player.stats?.parryPower ?? 0;

            const reduced = dmgPacket.base * (parryPower / 100);

            spawnDamageNumber(player.x, player.y, "PARRY", false, true);

            dmgPacket = { ...dmgPacket, base: dmgPacket.base - reduced };
        }
    }

    // ================================
    // 3) BLOCK
    // ================================
    if (weaponProfile.canBlock) {

        const blockChance = player.stats?.blockChance ?? 0;

        if (Math.random() < blockChance / 100) {

            const blockPower = player.stats?.blockPower ?? 0;

            const reduced = dmgPacket.base * (blockPower / 100);

            spawnDamageNumber(player.x, player.y, "BLOCK", false, true);

            dmgPacket = { ...dmgPacket, base: dmgPacket.base - reduced };
        }
    }

    // ================================
    // 4) SHIELD FIRST
    // ================================
    let damage = computeDamage(player, dmgPacket);

    if (player.shield > 0) {

        const absorbed = Math.min(player.shield, damage);

        player.shield -= absorbed;
        damage -= absorbed;

        if (absorbed > 0) {
            spawnDamageNumber(player.x, player.y, absorbed, false, true);
        }
    }

    // ================================
    // 5) HP DAMAGE
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
    // RÉSISTANCES ÉLÉMENTAIRES
    // ================================
    if (target?.resistances) {

        const type = dmgPacket.element ?? dmgPacket.type;

        if (type) {
            let res = target.resistances[type] ?? 0;

            // clamp
            if (res < -0.9) res = -0.9;
            if (res > 1.0) res = 1.0;

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

        // résistance au biome
        const res = player.stats?.biomeResistance ?? 0;
        const finalDmg = dmgPerSecond * Math.max(0, 1 - res / 100);

        damagePlayer(player, {
            base: finalDmg,
            type: "biome"
        });
    }
}
